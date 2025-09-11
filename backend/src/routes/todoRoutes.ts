import { Router } from 'express';
import Joi from 'joi';
import todoControllers from '../controllers/todoControllers';
import { authenticate } from '../middleware/auth';

const router = Router();

const createTodoSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().max(1000).optional().allow('', null),
});

const updateTodoSchema = Joi.object({
  title: Joi.string().min(1).max(200).optional(),
  description: Joi.string().max(1000).optional().allow('', null),
  completed: Joi.boolean().optional(),
});

const validateBody = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        ok: false,
        error: error.details[0].message,
      });
    }
    next();
  };
};

router.use(authenticate);

router.get('/', todoControllers.getAllTodos);
router.post('/', validateBody(createTodoSchema), todoControllers.createNewTodo);
router.get('/:id', todoControllers.getSingleTodo);
router.put('/:id', validateBody(updateTodoSchema), todoControllers.updateExistingTodo);
router.delete('/:id', todoControllers.removeTodo);

export default router;