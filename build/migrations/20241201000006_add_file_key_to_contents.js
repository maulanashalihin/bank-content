"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.alterTable('contents', function (table) {
        table.text('file_key').nullable().after('file_size');
    });
}
async function down(knex) {
    await knex.schema.alterTable('contents', function (table) {
        table.dropColumn('file_key');
    });
}
//# sourceMappingURL=20241201000006_add_file_key_to_contents.js.map