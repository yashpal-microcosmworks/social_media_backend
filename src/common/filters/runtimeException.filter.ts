import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse } from '../responses/errorResponse';
import { CustomLogger } from '../logger/custom-logger.service';

@Catch()
export class RuntimeExceptionFilter<T> implements ExceptionFilter {
  constructor(private readonly logger: CustomLogger) {}

  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse: ErrorResponse = new ErrorResponse();
    errorResponse.timestamp = new Date();
    errorResponse.path = request.url;

    if (exception instanceof HttpException) {
      const responseError = exception.getResponse();
      const status = exception.getStatus();

      errorResponse.statusCode = status;

      if (
        typeof responseError === 'object' &&
        responseError.hasOwnProperty('message')
      ) {
        if (Array.isArray(responseError['message'])) {
          errorResponse.message = responseError['message'][0];
        } else {
          errorResponse.message = responseError['message'];
        }
      } else {
        errorResponse.message = exception.message || 'Bad Request';
      }

      this.logger.error(errorResponse);
    } else if (exception instanceof Error) {
      const error = exception as any;

      if (error.code === 'ER_DUP_ENTRY') {
        const columnValueMatch = /Duplicate entry '(.+?)'/g.exec(
          error.sqlMessage,
        );
        const columnNameMatch = /for key 'users\.([^']+)'/g.exec(
          error.sqlMessage,
        );

        let field = '';

        if (columnValueMatch && columnNameMatch) {
          const columnKey = columnNameMatch[1];

          const fieldMap: Record<string, string> = {
            email: 'Email',
            enterprise: 'Enterprise',
          };

          for (const [key, value] of Object.entries(fieldMap)) {
            if (columnKey.toLowerCase().includes(key)) {
              field = value;
              break;
            }
          }
          if (!field) {
            field = 'Some fields';
          }

          errorResponse.statusCode = HttpStatus.CONFLICT;
          errorResponse.message = `${field} must be unique, but an instance already exists in the database. Please check the value and try again.`;
        } else {
          errorResponse.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
          errorResponse.message = `An Unexpected error occured | ${error.message || ''}`;
        }
      } else if (
        error.message.includes('RelationIdLoader') ||
        error.stack?.includes('RelationIdLoader')
      ) {
        errorResponse.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        errorResponse.message =
          error.message || 'Database relation loading error';
      } else {
        errorResponse.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        errorResponse.message = `An Unexpected error occured | ${error.message || ''}`;
      }

      this.logger.error(errorResponse);
    } else {
      errorResponse.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      errorResponse.message = 'An unexpected error occurred!';

      this.logger.error(errorResponse);
    }

    response.status(errorResponse.statusCode).json(errorResponse);
  }
}
