import models from '../db/associations';
import HttpError from '../helpers/httpError';
import { HTTP_STATUS } from '../constants/httpStatus';
import { WhereOptions } from 'sequelize';
import bcrypt from 'bcryptjs';

const { User } = models;

const findUser = async (query: WhereOptions) => {
  const user = await User.findOne({ where: query });
  if (!user) {
    throw HttpError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }
  return user;
};

const updateUserProfile = async (userId: number, updateData: { name?: string }) => {
  const user = await findUser({ id: userId });
  
  if (updateData.name) {
    await (user as any).update({ name: updateData.name });
  }
  
  return {
    id: (user as any).id,
    name: (user as any).name,
    email: (user as any).email,
  };
};

const changeUserPassword = async (
  userId: number, 
  currentPassword: string, 
  newPassword: string
) => {
  const user = await findUser({ id: userId });
  
  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword, 
    (user as any).password
  );
  
  if (!isCurrentPasswordValid) {
    throw HttpError(HTTP_STATUS.BAD_REQUEST, 'Current password is incorrect');
  }
  
  const isSamePassword = await bcrypt.compare(newPassword, (user as any).password);
  if (isSamePassword) {
    throw HttpError(HTTP_STATUS.BAD_REQUEST, 'New password must be different from current password');
  }
  
   const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  
  await (user as any).update({ password: hashedNewPassword });
  
  return {
    message: 'Password changed successfully',
    userId: (user as any).id
  };
};

export default {
  findUser,
  updateUserProfile,
  changeUserPassword,
};