import { createLogger, format, Logger, LoggerOptions, transports } from 'winston';
import { network } from 'hardhat';
import userName from 'git-user-name';
import { deploymentLogsPath } from '../../../common/paths';


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
  level: 'info',
  format: format.combine(
    ...formats
  ),
  transports: [
    new (transports.File)({ 
      filename: deploymentLogsPath.fileName, 
      dirname: deploymentLogsPath.location, 
      level: 'info', 
      format: format.combine(
        ...formats
      )
    })
  ]
};

const logger: Logger = createLogger(loggerOptions);

const DeploymentLogger = async (msg: string) => {
  if ( network.name !== "hardhat" ) {
    logger.info(msg);
  }
}

export default DeploymentLogger;