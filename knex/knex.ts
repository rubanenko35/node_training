import knex from 'knex';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import * as knexFileConfig from '../knexfile';

const environment = process.env.ENVIRONMENT || 'development';
const config = knexFileConfig[environment];
export const database = knex(config);
