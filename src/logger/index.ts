import { pino } from 'pino';

interface LoggerOptions {
  logFilePath?: string;
}

const createFileTransport = (logFilePath: string): typeof pino.transport => {
  return pino.transport({
    target: 'pino/file',
    options: {
      destination: logFilePath,
      mkdir: true,
      sync: false // Asynchronous logging. Mandatory for pino.transport.File or the node js event loop will stop.
    }
  }) as typeof pino.transport;
};

const createConsoleTransport = (): typeof pino.transport => {
  return pino.transport({
    target: 'pino-pretty',
    options: {
      colorize: true,
      destination: 1,
      sync: false
    }
  }) as typeof pino.transport;
};

/**
 * A logger that supports JSON.
 * @param logFilePath path to log file (optional)
 * @returns pino.Logger
 * @example
 * const logger = createLogger({ logFilePath: 'logs/app.log' });
 * logger.info('Hello, world!');
 * logger.error('An error occurred', new Error('An error occurred'));
 */
const createLogger = ({ logFilePath }: LoggerOptions = {}): pino.Logger => {
  const transports: any[] = [];
  if (logFilePath) {
    const fileTransport = createFileTransport(logFilePath);
    transports.push(fileTransport);
  } else {
    const consoleTransport = createConsoleTransport();
    transports.push(consoleTransport);
  }

  return pino(
    {
      level:
        process.env.PINO_LEVEL || process.env.NODE_ENV === 'production'
          ? 'info'
          : 'debug'
    },
    ...(transports as [])
  ) as pino.Logger;
};

export default createLogger;
