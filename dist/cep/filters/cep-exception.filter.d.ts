import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
export declare class CepExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(error: Error, host: ArgumentsHost): Response<any, Record<string, any>> | undefined;
}
