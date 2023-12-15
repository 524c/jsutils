import path from 'path';
import pino from 'pino';

// eslint-disable-next-line @typescript-eslint/naming-convention
const transport_file = pino.transport({
  target: 'pino/file',
  options: {
    destination: path.join('.', 'app.log'),
    mkdir: true,
    sync: false // Asynchronous logging. Mandatory for pino.transport.File or the node js event loop will stop.
  }
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const transport_console = pino.transport({
  target: 'pino-pretty',
  options: {
    colorize: true,
    destination: 1,
    sync: false
  }
});

/**
 * A logger that supports JSON.
 */
export const logger: pino.Logger = pino(
  {
    level:
      process.env.PINO_LEVEL || process.env.NODE_ENV === 'production'
        ? 'info'
        : 'debug'
  },
  process.env.NODE_ENV === 'production' ? transport_file : transport_console
);

/*
const log = (...msg: any[]) => {
  console.log(...msg);
};

type NodeJsGlobal = typeof globalThis;

interface CustomNodeJsGlobal extends NodeJsGlobal {
  log: typeof log;
}

declare const global: CustomNodeJsGlobal;
global.log = log;
*/
