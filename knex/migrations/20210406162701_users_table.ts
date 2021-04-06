import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.table('users_table', function(table) {
        table.string('__type').notNullable().defaultTo('User');
    })
}


export async function down(knex: Knex): Promise<void> {
}

