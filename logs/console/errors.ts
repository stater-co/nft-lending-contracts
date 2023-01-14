import { createLogger, format, Logger, LoggerOptions, transports } from 'winston';
import { testErrorsPath } from '../../common/paths';


const formats: Array<any> = [
  format.timestamp(),
  format.prettyPrint()
];

const loggerOptions: LoggerOptions = {
  level: 'error',
  transports: [
    new (transports.Console)(),
    new (transports.File)({ 
      filename: testErrorsPath.fileName, 
      dirname: testErrorsPath.location, 
      level: 'error',
      format: format.combine(
        ...formats
      ) 
    })
  ]
};

const logger: Logger = createLogger(loggerOptions);

const ConsoleError = (msg: string) => {
  logger.error(msg);
}

export default ConsoleError;