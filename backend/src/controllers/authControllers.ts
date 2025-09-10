import authServices from '../services/authServices';
import { HTTP_STATUS } from '../constants/httpStatus';
import ctrlWrapper from '../decorators/ctrlWrapper';

const signUpController = async (req: any, res: any) => {
  const user = await authServices.registerUser(req.body);

  res.status(HTTP_STATUS.CREATED).json({
    ok: true,
    message: 'Registration successful',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token: user.token,
    refreshToken: user.refreshToken,
  });
};

const singInController = async (req: any, res: any) => {
  const { email, password } = req.body;
  const result = await authServices.signInUser({ email, password });
  res.status(HTTP_STATUS.OK).json({
    ok: true,
    message: 'Login successful',
    ...result,
  });
};

const logOutController = async (req: any, res: any) => {
  const { id } = req.user;
  await authServices.invalidateUserToken(id);
  res.status(HTTP_STATUS.NO_CONTENT).json();
};

const refreshTokenController = async (req: any, res: any) => {
  const { refreshToken } = req.body;
  const result = await authServices.refreshUserToken(refreshToken);
  res.status(HTTP_STATUS.OK).json({
    ok: true,
    message: 'Token refreshed successfully',
    ...result,
  });
};

export default {
  signUpController: ctrlWrapper(signUpController),
  singInController: ctrlWrapper(singInController),
  logOutController: ctrlWrapper(logOutController),
  refreshTokenController: ctrlWrapper(refreshTokenController),
};