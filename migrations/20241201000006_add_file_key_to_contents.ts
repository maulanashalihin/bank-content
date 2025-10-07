import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('contents', function (table) {
        table.text('file_key').nullable().after('file_size'); // S3 object key for file management
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('contents', function (table) {
        table.dropColumn('file_key');
    });
}