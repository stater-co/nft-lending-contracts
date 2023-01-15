import { createLogger , format, Logger, LoggerOptions, transports } from 'winston';
import { testErrorsPath } from '../../../common/paths';


const formats: Array<any> = [
  format.timestamp(),
  format.prettyPrint()
];

const loggerOptions: LoggerOptions = {
  level: 'error',
  format: format.combine(
    ...formats
  ),
  transports: [
    new (transports.File)({ 
      filename: testErrorsPath.fileName, 
      dirname: testErrorsPath.location, 
      level: 'error',
      format: format.combine(
        ...formats
      ) 
    }),
    transports.Console
  ]
};

const logger: Logger = createLogger(loggerOptions);

const TestError = (msg: string) => {
  logger.error(msg);
}

export default TestError;