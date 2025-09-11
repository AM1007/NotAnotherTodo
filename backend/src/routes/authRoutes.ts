import { Router } from 'express';
import Joi from 'joi';
import authControllers from '../controllers/authControllers';
import { emailRegexp } from '../constants/auth';

const router = Router();

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
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

router.post('/register', validateBody(registerSchema), authControllers.signUpController);
router.post('/login', validateBody(loginSchema), authControllers.singInController);
router.post('/logout', authControllers.logOutController);
router.post('/refresh', validateBody(refreshTokenSchema), authControllers.refreshTokenController);

export default router;