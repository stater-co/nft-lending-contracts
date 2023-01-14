import { createLogger, Logger, LoggerOptions, transports } from 'winston';


const loggerOptions: LoggerOptions = {
  level: 'info',
  transports: [
    new (transports.Console)()
  ]
};

const logger: Logger = createLogger(loggerOptions);

export const TestLogger = async (msg: string) => {
  logger.info(msg);
}