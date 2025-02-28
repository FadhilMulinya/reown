import React, { useState } from 'react';
import { TodoContractMethods } from './types';

interface DeleteTodoProps {
  id: number;
  contract: TodoContractMethods;
  onSuccess?: () => void;
}

export const DeleteTodo: React.FC<DeleteTodoProps> = ({ id, contract, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this todo?')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await contract.deleteTask(id);
      onSuccess?.();
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError('Failed to delete todo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={isLoading}
        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
      >
        {isLoading ? 'Deleting...' : 'Delete Todo'}
      </button>
      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
    </div>
  );
};
