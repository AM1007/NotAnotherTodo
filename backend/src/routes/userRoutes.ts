import { Router } from 'express';
import Joi from 'joi';
import userControllers from '../controllers/userControllers';
import { authenticate } from '../middleware/auth';

const router = Router();

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).required(),
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

router.get('/me', authenticate, userControllers.getUserInfoController);
router.put('/change-password', 
  authenticate, 
  validateBody(changePasswordSchema), 
  userControllers.changePasswordController
);

export default router;