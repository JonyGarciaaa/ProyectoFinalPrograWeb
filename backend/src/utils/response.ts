import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
}

export const sendSuccess = <T>(res: Response, statusCode = 200, message?: string, data?: T) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res: Response, statusCode = 400, message: string, errors?: any) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
