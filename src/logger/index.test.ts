import createLogger from './index';
import fs from 'fs';

describe('createLogger', () => {
  it('should create a logger with a console transport', () => {
    const logger = createLogger();
    expect(logger).toBeDefined();
  });

  it('should create a logger with a file transport', async () => {
    const logFilePath = '__test__.log';
    function deleteLog() {
      if (fs.existsSync('__test__.log')) {
        fs.unlinkSync('__test__.log');
      }
    }
    deleteLog();
    const logger = createLogger({ logFilePath });
    expect(logger).toBeDefined();

    // Wait for a brief period before checking the existence of the log file
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Check if the log file is created
    expect(fs.existsSync(logFilePath)).toBe(true);
    deleteLog();
  });

  it('should create a logger with the specified log level', () => {
    process.env.PINO_LEVEL = 'trace';
    const logger = createLogger();
    expect(logger).toBeDefined();
    delete process.env.PINO_LEVEL;
  });

  it('should create a logger with the specified log level in production', () => {
    process.env.NODE_ENV = 'production';
    const logger = createLogger();
    expect(logger).toBeDefined();
    delete process.env.NODE_ENV;
  });
});
