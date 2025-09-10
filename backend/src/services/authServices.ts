import bcrypt from 'bcryptjs';
import models from '../db/associations';
import HttpError from '../helpers/httpError';
import { HTTP_STATUS } from '../constants/httpStatus';
import jwtHelpers from '../helpers/jwt';
import { userNameRegexp } from '../constants/auth';
const { User } = models;
import { WhereOptions } from "sequelize";

const findUser = async (query: WhereOptions) => {
  return await User.findOne({ where: query });
};

const validateUserName = (userName: string) => {
  if (!userName) {
    return { valid: false, message: 'Username is required' };
  }
  if (userName.length < 3 || userName.length > 30) {
    return {
      valid: false,
      message: 'Name must be between 3 and 30 characters',
    };
  }
  if (!userNameRegexp.test(userName)) {
    return {
      valid: false,
      message:
        'Name should only contain letters, numbers, underscores, hyphens, dots and commas',
    };
  }
  return { valid: true };
};

const registerUser = async (userData: any) => {
  const { email, password, name } = userData;

  const sanitizedName = name.trim();

  const validatedName = validateUserName(sanitizedName);

  if (!validatedName.valid) {
    throw HttpError(HTTP_STATUS.BAD_REQUEST, validatedName.message);
  }

  const existingUser = await findUser({ email });

  if (existingUser) {
    throw HttpError(HTTP_STATUS.CONFLICT, 'Email already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name: sanitizedName,
    email,
    password: hashedPassword,
  });

  const payload = { id: newUser.id, email };
  const token = jwtHelpers.generateToken(payload);
  const refreshToken = jwtHelpers.generateToken(payload, '7d');

  await newUser.update({ token, refreshToken });

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    token,
    refreshToken,
  };
};

const signInUser = async (userData: any) => {
  const { email, password } = userData;
  const user = await findUser({ email });

  if (!user) {
    throw HttpError(HTTP_STATUS.UNAUTHORIZED, 'Email or password is wrong');
  }

  const userResponse = {
    id: (user as any).id,
    email: (user as any).email,
    name: (user as any).name,
  };

  const isValidPassword = await bcrypt.compare(password, (user as any).password);
  if (!isValidPassword) {
    throw HttpError(HTTP_STATUS.UNAUTHORIZED, 'Email or password is wrong');
  }

  if ((user as any).token) {
    const { error } = jwtHelpers.verifyToken((user as any).token);
    if (!error) {
      return {
        token: (user as any).token,
        refreshToken: (user as any).refreshToken,
        user: userResponse,
      };
    }
  }

  const payload = { id: (user as any).id, email };
  const token = jwtHelpers.generateToken(payload);
  const refreshToken = jwtHelpers.generateToken(payload, '7d');
  await (user as any).update({ token, refreshToken });

  return { token, refreshToken, user: userResponse };
};

const refreshUserToken = async (refreshToken: any) => {
  if (!refreshToken) {
    throw HttpError(HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }

  const { payload, error } = jwtHelpers.verifyToken(refreshToken);

  if (error || !payload) {
    throw HttpError(HTTP_STATUS.FORBIDDEN, 'Invalid or expired refresh token');
  }

  const user = await findUser({ email: (payload as any).email });

  if (!user || (user as any).refreshToken !== refreshToken) {
    throw HttpError(HTTP_STATUS.FORBIDDEN, 'Refresh token mismatch');
  }

  const newAccessToken = jwtHelpers.generateToken({
    id: (user as any).id,
    email: (user as any).email,
  });

  await (user as any).update({ token: newAccessToken });

  return { token: newAccessToken };
};

const invalidateUserToken = async (userId: any) => {
  const user = await findUser({ id: userId });

  if (!user || !(user as any).token) {
    throw HttpError(HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }

  await (user as any).update({ token: null, refreshToken: null });

  return user;
};

export default {
  findUser,
  registerUser,
  signInUser,
  invalidateUserToken,
  refreshUserToken,
};