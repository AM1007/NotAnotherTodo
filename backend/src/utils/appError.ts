export class AppError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

export const appErrors = {
  badRequest: (msg?: string) => new AppError(400, msg || 'Bad request'),
  notFound: (msg?: string) => new AppError(404, msg || 'Not found'),
  internal: (msg?: string) => new AppError(500, msg || 'Internal server error'),
};