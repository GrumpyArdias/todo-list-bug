import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { logger } from '../config/logger.config';
import { ValidationError } from 'class-validator';

const DUPLICATE_INDICATORS = [
    { code: 'SQLITE_CONSTRAINT' },
    { errno: 19 },
    { code: '23505' },
    { code: 'ER_DUP_ENTRY' },
    { messageIncludes: 'unique' },
    { messageIncludes: 'duplicate' },
] as const;

const sanitizeBody = (body: any) => {
    if (!body) return body;

    const sensitiveFields = ['pass', 'password', 'token', 'secret'];
    const sanitized = { ...body };

    sensitiveFields.forEach((field) => {
        if (field in sanitized) {
            sanitized[field] = '[REDACTED]';
        }
    });

    return sanitized;
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            message = exception.message;
        } else if (exception instanceof QueryFailedError) {
            const error = exception.driverError;
            const msg = exception.message;

            // Soporta SQLite, PostgreSQL, MySQL de forma agnostica y puede ser ampliado añadiendo más indicadores

            const isDuplicate = DUPLICATE_INDICATORS.some((indicator) => {
                if ('code' in indicator && error?.code === indicator.code)
                    return true;
                if ('errno' in indicator && error?.errno === indicator.errno)
                    return true;
                if (
                    'messageIncludes' in indicator &&
                    msg.includes(indicator.messageIncludes)
                )
                    return true;
                return false;
            });

            if (isDuplicate) {
                status = HttpStatus.CONFLICT;
                message = 'Duplicate entry';
            } else {
                status = HttpStatus.BAD_REQUEST;
                message = 'Database error';
            }
        } else if (
            exception instanceof Array &&
            exception[0] instanceof ValidationError
        ) {
            status = HttpStatus.BAD_REQUEST;
            message = 'Validation failed';

            const details = exception.map((err) => ({
                field: err.property,
                errors: Object.values(err.constraints || {}),
            }));

            logger.warn('Validation failed', {
                stack: 'ValidationError',
                url: request.url,
                method: request.method,
                body: sanitizeBody(request.body),
                validationDetails: details,
            });

            response.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Validation failed',
                timestamp: new Date().toISOString(),
                path: request.url,
            });
            return;
        }

        const isClientError = status >= 400 && status < 500;
        const logLevel = isClientError ? 'warn' : 'error';
        logger[logLevel](message, {
            stack: exception instanceof Error ? exception.stack : undefined,
            url: request.url,
            method: request.method,
            body: sanitizeBody(request.body),
        });

        response.status(status).json({
            statusCode: status,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
