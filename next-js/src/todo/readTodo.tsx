import React, { useEffect, useState } from 'react';
import { Todo, TodoContractMethods } from './types';

interface ReadTodoProps {
  id: number;
  contract: TodoContractMethods;
}

export const ReadTodo: React.FC<ReadTodoProps> = ({ id, contract }) => {
  const [todo, setTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        setIsLoading(true);
        const [title, content, done] = await contract.readTask(id);
        setTodo({ id, title, content, done });
        setError(null);
      } catch (err) {
        setError('Failed to load todo');
        console.error('Error fetching todo:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodo();
  }, [id, contract]);

  if (isLoading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  if (error || !todo) {
    return <div className="text-red-400">{error || 'Todo not found'}</div>;
  }

  return (
    <div className="border border-gray-700 rounded-lg p-4 bg-gray-800 shadow-sm">
      <h3 className="text-lg font-medium text-gray-100">{todo.title}</h3>
      <p className="mt-2 text-gray-300">{todo.content}</p>
      <div className="mt-2">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          todo.done ? 'bg-green-900 text-green-200' : 'bg-yellow-900 text-yellow-200'
        }`}>
          {todo.done ? 'Completed' : 'Pending'}
        </span>
      </div>
    </div>
  );
};
