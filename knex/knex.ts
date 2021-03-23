import knex from 'knex';
import { knexFileConfig } from '../knexfile';

const environment = 'development'; // process.env.ENVIRONMENT || 'development';
const config = knexFileConfig[environment];
export const database = knex(config);
