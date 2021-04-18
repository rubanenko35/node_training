import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('refresh_token', function (table) {
        table.string('tokenId').unique().notNullable();
        table.integer('userId').unique().notNullable();
        table.string('__type').notNullable().defaultTo('RefreshToken');
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('refresh_token');
}
