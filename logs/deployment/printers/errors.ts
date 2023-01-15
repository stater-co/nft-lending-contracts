import { createLogger, format, Logger, LoggerOptions, transports } from 'winston';
import { network } from 'hardhat';
import userName from 'git-user-name';
import { deploymentErrorsPath } from '../../../common/paths';


const deploymentFormat = format((info) => {
  return {
    ...info,
    network: network.name
  };
})();

const formats: Array<any> = [
  deploymentFormat,
  format.timestamp(),
  format.json(),
  format.label({
    label: String(userName()),
    message: true
  })
];

const loggerOptions: LoggerOptions = {
  level: 'error',
  format: format.combine(
    ...formats
  ),
  transports: [
    new (transports.File)({ 
      filename: deploymentErrorsPath.fileName, 
      dirname: deploymentErrorsPath.location, 
      level: 'error',
      format: format.combine(
        ...formats
      ) 
    })
  ]
};

const logger: Logger = createLogger(loggerOptions);

const DeploymentError = (msg: string) => {
  logger.error(msg);
}

export default DeploymentError;