export type User = {
  id: number;
  email: string;
  name: string;
  password: string;
};

export type Todo = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  userId: number;
};

export type LoginDto = {
  email: string;
  password: string;
};

export type CreateTodoDto = {
  title: string;
  description?: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};
