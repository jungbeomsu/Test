import {format, createLogger, transports} from "winston";

const {combine, timestamp, prettyPrint, printf} = format;

const logFormat = printf(info => {
  return `${info.timestamp} ${info.level}: ${info.message}`;
});

const logger = createLogger({
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat,
  ),
  transports: [new transports.Console({level: 'silly', colorize: true, prettyPrint: true})]
});

export {logger};
