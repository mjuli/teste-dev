import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { CepNotFoundError } from '../errors/cep-not-found.error';
import { AllProvidersFailedError } from '../errors/all-providers-failed.error';

@Catch(CepNotFoundError, AllProvidersFailedError)
export class CepExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CepExceptionFilter.name);

  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (error instanceof CepNotFoundError) {
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        error: 'Not Found',
        message: error.message,
      });
    }

    if (error instanceof AllProvidersFailedError) {
      const message =
        error.reason === 'timeout'
          ? 'Tempo limite de resposta excedido em todos os serviços de CEP.'
          : 'Todos os serviços de CEP estão indisponíveis no momento.';

      return response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        statusCode: 503,
        error: 'Service Unavailable',
        message,
      });
    }
  }
}
