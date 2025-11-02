import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
export const logger = WinstonModule.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
    ),
    transports: [
        // Console
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp({ format: 'HH:mm:ss' }),
                winston.format.printf(
                    ({ timestamp, level, message, context, ...meta }) => {
                        let formattedMessage = message;
                        if (typeof message === 'object') {
                            formattedMessage = JSON.stringify(message, null, 2);
                        }

                        const metaStr =
                            Object.keys(meta).length > 0
                                ? `\n${JSON.stringify(meta, null, 2)}`
                                : '';

                        return `${timestamp} [${context || 'APP'}] ${level}: ${formattedMessage}${metaStr}`;
                    },
                ),
            ),
        }),
        // This is just for errors
        new winston.transports.DailyRotateFile({
            dirname: 'logs',
            filename: 'error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: 'error',
        }),

        //This is for warnings
        new winston.transports.DailyRotateFile({
            dirname: 'logs',
            filename: 'warn-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '21d',
            level: 'warn',
        }),
        // All events that happend in the API just for DEV
        new winston.transports.DailyRotateFile({
            dirname: 'logs',
            filename: 'combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '30d',
        }),
    ],
});
