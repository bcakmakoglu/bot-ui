import { ErrorInterceptor, ApiError } from 'ts-lambda-api';
import consolaGlobalInstance from 'consola';
import { APIError } from './apiErrors';

export class APIErrorInterceptor extends ErrorInterceptor {
  shouldIntercept(): boolean {
    return true;
  }

  async intercept(apiError: ApiError): Promise<any> {
    consolaGlobalInstance.error(`## ${apiError.error} ##`);
    if (apiError.error instanceof APIError) {
      apiError.response.status(apiError.error.code);
      await apiError.response.send({
        error: apiError.error.name,
        message: apiError.error.message,
        details: apiError.error.details
      });
    } else {
      apiError.response.status(500);
      await apiError.response.send({
        error: 'UnknownError',
        message: 'An unexpected error occurred. Please try again later.'
      });
    }
  }
}
