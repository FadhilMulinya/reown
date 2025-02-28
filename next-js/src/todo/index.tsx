import React, { useState } from 'react';
import { Todo, TodoContractMethods } from './types';
import { CreateTodo } from './createTodo';
import { ReadTodo } from './readTodo';
import { UpdateTodo } from './updateTodo';
import { MarkTodo } from './markTodo';
import { DeleteTodo } from './deleteTodo';

interface TodoAppProps {
  contract: TodoContractMethods;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const TodoApp: React.FC<TodoAppProps> = ({ contract }) => {
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleCreateSuccess = async () => {
    console.log('Todo created successfully');
  };

  const handleUpdateSuccess = async () => {
    console.log('Todo updated successfully');
    setIsEditing(false);
    setSelectedTodo(null);
  };

  const handleDeleteSuccess = async () => {
    console.log('Todo deleted successfully');
    setSelectedTodo(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-100">Todo App</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-200">Create New Todo</h2>
        <CreateTodo contract={contract} onSuccess={handleCreateSuccess} />
      </div>

      {contract.todos.length === 0 ? (
        <div className="text-center text-gray-400">No todos found. Create one to get started!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contract.todos.map((todo) => (
            <div key={todo.id} className="border border-gray-700 rounded-lg p-4 bg-gray-800 shadow-sm">
              <div>
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
              
              <div className="mt-4 space-x-2">
                {!todo.done && (
                  <>
                    <button
                      onClick={() => {
                        setSelectedTodo(todo);
                        setIsEditing(true);
                      }}
                      className="inline-flex items-center px-3 py-2 border border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-200 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Edit
                    </button>
                    <MarkTodo
                      id={todo.id}
                      contract={contract}
                      onSuccess={handleUpdateSuccess}
                    />
                  </>
                )}
                <DeleteTodo
                  id={todo.id}
                  contract={contract}
                  onSuccess={handleDeleteSuccess}
                />
              </div>

              {isEditing && selectedTodo?.id === todo.id && (
                <div className="mt-4">
                  <UpdateTodo
                    id={todo.id}
                    initialContent={todo.content}
                    contract={contract}
                    onSuccess={handleUpdateSuccess}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
