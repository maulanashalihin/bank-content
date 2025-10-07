"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('content_shares', function (table) {
        table.uuid('id').primary().notNullable();
        table.uuid('content_id').notNullable();
        table.uuid('shared_by_user_id').notNullable();
        table.uuid('shared_to_user_id').nullable();
        table.string('share_type', 50).notNullable();
        table.string('share_platform', 100).nullable();
        table.text('share_message').nullable();
        table.text('share_url').nullable();
        table.boolean('is_active').defaultTo(true);
        table.integer('view_count').defaultTo(0);
        table.integer('click_count').defaultTo(0);
        table.dateTime('expires_at').nullable();
        table.json('metadata').nullable();
        table.bigInteger("created_at");
        table.bigInteger("updated_at");
        table.foreign('content_id').references('id').inTable('contents').onDelete('CASCADE');
        table.foreign('shared_by_user_id').references('id').inTable('users').onDelete('CASCADE');
        table.foreign('shared_to_user_id').references('id').inTable('users').onDelete('CASCADE');
        table.index(['content_id']);
        table.index(['shared_by_user_id']);
        table.index(['shared_to_user_id']);
        table.index(['share_type']);
        table.index(['is_active']);
        table.index(['created_at']);
    });
}
async function down(knex) {
    await knex.schema.dropTable('content_shares');
}
//# sourceMappingURL=20241201000005_create_content_shares.js.map