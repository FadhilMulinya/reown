import { usePublicClient, useWalletClient, useWriteContract } from 'wagmi';
import { TodoContractMethods, Todo } from '../todo/types';
import contractInfo from '../contracts/contract.json';
import { todoDB } from '../services/todoDb';
import { useEffect, useState, useCallback } from 'react';

const contractAddress = "0x21eAeDbb969A9F970202FE5fd353A4d2514ED518" as `0x${string}`;
const MAX_TODOS = 1000;

export function useTodoContract(): TodoContractMethods | null {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { writeContractAsync } = useWriteContract();
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastKnownId, setLastKnownId] = useState(1);
  const [todos, setTodos] = useState<Todo[]>([]);

  const loadAllTodos = useCallback(async () => {
    if (!publicClient || isInitialized) return;

    try {
      console.log('Preloading todos from blockchain...');
      const loadedTodos: Todo[] = [];
      let consecutiveEmptyCount = 0;
      let highestId = 1;
      
      for (let id = 1; id <= MAX_TODOS; id++) {
        try {
          const data = await publicClient.readContract({
            address: contractAddress,
            abi: contractInfo.abi,
            functionName: 'readTask',
            args: [BigInt(id)],
          }) as [string, string, boolean];

          // Only add if we got actual content
          if (data[0].trim() || data[1].trim()) {
            consecutiveEmptyCount = 0; // Reset counter when we find a todo
            const todo: Todo = {
              id,
              title: data[0],
              content: data[1],
              done: data[2]
            };
            loadedTodos.push(todo);
            await todoDB.saveTodo(todo);
            highestId = Math.max(highestId, id + 1);
          } else {
            consecutiveEmptyCount++;
            if (consecutiveEmptyCount >= 3) {
              break;
            }
          }
        } catch (error) {
          consecutiveEmptyCount++;
          if (consecutiveEmptyCount >= 3) {
            break;
          }
        }
      }
      
      console.log(`Loaded ${loadedTodos.length} todos`);
      setTodos(loadedTodos);
      setLastKnownId(highestId);
      setIsInitialized(true);
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  }, [publicClient, isInitialized]);

  // Initialize todos when the contract is first available
  useEffect(() => {
    loadAllTodos();
  }, [loadAllTodos]);

  const refreshTodos = useCallback(async () => {
    if (!publicClient || !isInitialized) return;
    
    try {
      const loadedTodos: Todo[] = [];
      for (let id = 1; id < lastKnownId; id++) {
        try {
          const data = await publicClient.readContract({
            address: contractAddress,
            abi: contractInfo.abi,
            functionName: 'readTask',
            args: [BigInt(id)],
          }) as [string, string, boolean];

          if (data[0].trim() || data[1].trim()) {
            loadedTodos.push({
              id,
              title: data[0],
              content: data[1],
              done: data[2]
            });
          }
        } catch (error) {
          // Skip errors for deleted todos
          continue;
        }
      }
      setTodos(loadedTodos);
    } catch (error) {
      console.error('Error refreshing todos:', error);
    }
  }, [publicClient, isInitialized, lastKnownId]);

  if (!publicClient || !walletClient) return null;

  return {
    todos,
    createTask: async (title: string, content: string) => {
      console.log('Creating new task:', { title, content });
      try {
        const hash = await writeContractAsync({
          address: contractAddress,
          abi: contractInfo.abi,
          functionName: 'createTask',
          args: [title, content],
        });
        
        const receipt = await publicClient.waitForTransactionReceipt({ 
          hash,
          confirmations: 1,
          timeout: 60_000
        });
        
        const newId = lastKnownId;
        setLastKnownId(newId + 1);
        
        const newTodo: Todo = {
          id: newId,
          title,
          content,
          done: false
        };
        await todoDB.saveTodo(newTodo);
        setTodos(prevTodos => [...prevTodos, newTodo]);
        
        // Refresh todos after a short delay to ensure blockchain state is updated
        setTimeout(refreshTodos, 2000);
      } catch (error) {
        console.error('Error creating task:', error);
        throw error;
      }
    },

    updateTask: async (id: number, content: string) => {
      try {
        const hash = await writeContractAsync({
          address: contractAddress,
          abi: contractInfo.abi,
          functionName: 'updateTask',
          args: [BigInt(id), content],
        });
        
        await publicClient.waitForTransactionReceipt({ 
          hash,
          confirmations: 1,
          timeout: 60_000
        });
        
        setTodos(prevTodos => 
          prevTodos.map(t => t.id === id ? { ...t, content } : t)
        );
        
        setTimeout(refreshTodos, 2000);
      } catch (error) {
        console.error('Error updating task:', error);
        throw error;
      }
    },

    markTaskDone: async (id: number) => {
      try {
        const hash = await writeContractAsync({
          address: contractAddress,
          abi: contractInfo.abi,
          functionName: 'markTaskDone',
          args: [BigInt(id)],
        });
        
        await publicClient.waitForTransactionReceipt({ 
          hash,
          confirmations: 1,
          timeout: 60_000
        });
        
        setTodos(prevTodos => 
          prevTodos.map(t => t.id === id ? { ...t, done: true } : t)
        );
        
        setTimeout(refreshTodos, 2000);
      } catch (error) {
        console.error('Error marking task as done:', error);
        throw error;
      }
    },

    readTask: async (id: number) => {
      try {
        const data = await publicClient.readContract({
          address: contractAddress,
          abi: contractInfo.abi,
          functionName: 'readTask',
          args: [BigInt(id)],
        }) as [string, string, boolean];
        
        return data;
      } catch (error) {
        console.error('Error reading task:', error);
        throw error;
      }
    },

    deleteTask: async (id: number) => {
      try {
        const hash = await writeContractAsync({
          address: contractAddress,
          abi: contractInfo.abi,
          functionName: 'deleteTask',
          args: [BigInt(id)],
        });
        
        await publicClient.waitForTransactionReceipt({ 
          hash,
          confirmations: 1,
          timeout: 60_000
        });
        
        setTodos(prevTodos => prevTodos.filter(t => t.id !== id));
        await todoDB.deleteTodo(id);
        
        setTimeout(refreshTodos, 2000);
      } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
      }
    },
  };
} 