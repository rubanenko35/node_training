import express from 'express';
import { expressLoader } from './loaders/express';
import LoggerInstance from './loaders/logger';
import config from './config';

const app = express();

app.listen(config.port, async () => {
    await expressLoader({ app });

    LoggerInstance.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `);
}).on('error', error => {
    LoggerInstance.error(error);
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
});
