import { STATUS_MESSAGES } from '../constants/httpStatus';

const HttpError = (status: number, message?: string) => {
  const err: any = new Error(message || STATUS_MESSAGES[status] || 'Error');
  err.status = status;
  return err;
};

export default HttpError;
