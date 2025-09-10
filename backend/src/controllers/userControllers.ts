import { Request, Response } from 'express';
import ctrlWrapper from '../decorators/ctrlWrapper';
import { HTTP_STATUS } from '../constants/httpStatus';
import userServices from '../services/userServices';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

const getUserInfoController = async (req: AuthenticatedRequest, res: Response) => {
  res.status(HTTP_STATUS.OK).json({ 
    ok: true,
    user: req.user 
  });
};

const changePasswordController = async (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user!.id;
  
  const result = await userServices.changeUserPassword(
    userId, 
    currentPassword, 
    newPassword
  );
  
  res.status(HTTP_STATUS.OK).json({
    ok: true,
    ...result
  });
};

export default {
  getUserInfoController: ctrlWrapper(getUserInfoController),
  changePasswordController: ctrlWrapper(changePasswordController),
};