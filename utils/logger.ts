import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf } = format;

export function createLoggerInstance() {
    const myFormat = printf(({ level, message, timestamp }) => {
        const formattedTimestamp = timestamp;
        return `${formattedTimestamp} ${level}: ${message}`;
    });

    return createLogger({
        format: combine(
            timestamp({ format: 'HH:mm:ss' }),
            myFormat
        ),
        transports: [
            new transports.File({ filename: `./logs/starknet_${new Date().toISOString().replace(/:/g, '-').replace(/T|\..+/g, '_')}.log` }),
            new transports.Console()
        ],
    });
}