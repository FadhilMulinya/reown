import React, { useState } from 'react';
import { TodoContractMethods } from './types';

interface MarkTodoProps {
  id: number;
  contract: TodoContractMethods;
  onSuccess?: () => void;
}

export const MarkTodo: React.FC<MarkTodoProps> = ({ id, contract, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMarkDone = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await contract.markTaskDone(id);
      onSuccess?.();
    } catch (err) {
      console.error('Error marking todo as done:', err);
      setError('Failed to mark todo as done');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleMarkDone}
        disabled={isLoading}
        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
      >
        {isLoading ? 'Marking as done...' : 'Mark as Done'}
      </button>
      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
    </div>
  );
};
