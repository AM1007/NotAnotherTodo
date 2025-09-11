import { Request, Response } from 'express';
import ctrlWrapper from '../decorators/ctrlWrapper';
import { HTTP_STATUS } from '../constants/httpStatus';
import todoServices from '../services/todoServices';

interface AuthReq extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

const getAllTodos = async (req: AuthReq, res: Response) => {
  const userId = req.user!.id;
  const todos = await todoServices.getUserTodos(userId);
  
  res.status(HTTP_STATUS.OK).json({
    ok: true,
    todos,
    count: todos.length
  });
};

const createNewTodo = async (req: AuthReq, res: Response) => {
  const userId = req.user!.id;
  const todo = await todoServices.createTodo(userId, req.body);
  
  res.status(HTTP_STATUS.CREATED).json({
    ok: true,
    message: 'Todo created',
    todo
  });
};

const getSingleTodo = async (req: AuthReq, res: Response) => {
  const userId = req.user!.id;
  const todoId = parseInt(req.params.id);
  
  const todo = await todoServices.getTodoById(todoId, userId);
  
  res.status(HTTP_STATUS.OK).json({
    ok: true,
    todo
  });
};

const updateExistingTodo = async (req: AuthReq, res: Response) => {
  const userId = req.user!.id;
  const todoId = parseInt(req.params.id);
  
  const updatedTodo = await todoServices.updateTodo(todoId, userId, req.body);
  
  res.status(HTTP_STATUS.OK).json({
    ok: true,
    message: 'Todo updated',
    todo: updatedTodo
  });
};

const removeTodo = async (req: AuthReq, res: Response) => {
  const userId = req.user!.id;
  const todoId = parseInt(req.params.id);
  
  await todoServices.deleteTodo(todoId, userId);
  
  res.status(HTTP_STATUS.NO_CONTENT).json();
};

export default {
  getAllTodos: ctrlWrapper(getAllTodos),
  createNewTodo: ctrlWrapper(createNewTodo),
  getSingleTodo: ctrlWrapper(getSingleTodo),
  updateExistingTodo: ctrlWrapper(updateExistingTodo),
  removeTodo: ctrlWrapper(removeTodo),
};