import models from '../db/associations';
import HttpError from '../helpers/httpError';
import { HTTP_STATUS } from '../constants/httpStatus';

const { Todo } = models;

const getUserTodos = async (userId: number) => {
  const todos = await Todo.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']]
  });
  
  return todos;
};

const createTodo = async (userId: number, todoData: any) => {
  const { title, description } = todoData;
  
  const newTodo = await Todo.create({
    title,
    description,
    userId,
    completed: false
  });
  
  return newTodo;
};

const getTodoById = async (todoId: number, userId: number) => {
  const todo = await Todo.findOne({
    where: { 
      id: todoId,
      userId 
    }
  });
  
  if (!todo) {
    throw HttpError(HTTP_STATUS.NOT_FOUND, 'Todo not found');
  }
  
  return todo;
};

const updateTodo = async (todoId: number, userId: number, updateData: any) => {
  const todo = await getTodoById(todoId, userId);
  
  const updatedTodo = await (todo as any).update({
    title: updateData.title || (todo as any).title,
    description: updateData.description !== undefined ? updateData.description : (todo as any).description,
    completed: updateData.completed !== undefined ? updateData.completed : (todo as any).completed
  });
  
  return updatedTodo;
};

const deleteTodo = async (todoId: number, userId: number) => {
  const todo = await getTodoById(todoId, userId);
  
  await (todo as any).destroy();
  
  return { message: 'Todo deleted' };
};

export default {
  getUserTodos,
  createTodo,
  getTodoById,
  updateTodo,
  deleteTodo,
};