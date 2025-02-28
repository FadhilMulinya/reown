export interface Todo {
  id: number;
  title: string;
  content: string;
  done: boolean;
}

export interface TodoContractMethods {
  todos: Todo[];
  createTask: (title: string, content: string) => Promise<void>;
  updateTask: (id: number, content: string) => Promise<void>;
  markTaskDone: (id: number) => Promise<void>;
  readTask: (id: number) => Promise<[string, string, boolean]>;
  deleteTask: (id: number) => Promise<void>;
} 