import express from 'express';
import { expressLoader } from './loaders/express';
import LoggerInstance from './loaders/logger';
import config from './config';
import { database } from '../knex/knex';
// appKnex

const app = express();

app.listen(config.port, async () => {
    await expressLoader({ app });

    await database('users_table').insert([{name: 'name', email: 'mail'}]).then(data => {
        LoggerInstance.info(`Data: ${data}`);
    });
    LoggerInstance.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `);
}).on('error', err => {
    LoggerInstance.error(err);
    process.exit(1);
});
