import knex from 'knex';
// @ts-ignore
import * as knexFileConfig from './../knexfile';

const environment = process.env.ENVIRONMENT || 'development';
const config = knexFileConfig[environment];
export const database = knex(config);
