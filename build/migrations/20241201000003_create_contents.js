"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('contents', function (table) {
        table.uuid('id').primary().notNullable();
        table.uuid('user_id').notNullable();
        table.uuid('content_type_id').notNullable();
        table.uuid('product_id').nullable();
        table.string('title', 255).notNullable();
        table.text('content_text').nullable();
        table.text('file_path').nullable();
        table.string('youtube_url', 255).nullable();
        table.string('file_name', 255).nullable();
        table.string('file_type', 50).nullable();
        table.integer('file_size').nullable();
        table.text('thumbnail_path').nullable();
        table.json('metadata').nullable();
        table.string('status', 50).defaultTo('draft');
        table.boolean('is_public').defaultTo(true);
        table.boolean('is_featured').defaultTo(false);
        table.integer('view_count').defaultTo(0);
        table.integer('download_count').defaultTo(0);
        table.integer('share_count').defaultTo(0);
        table.text('tags').nullable();
        table.uuid('original_content_id').nullable();
        table.bigInteger("created_at");
        table.bigInteger("updated_at");
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.foreign('content_type_id').references('id').inTable('content_types').onDelete('RESTRICT');
        table.foreign('product_id').references('id').inTable('products').onDelete('SET NULL');
        table.foreign('original_content_id').references('id').inTable('contents').onDelete('SET NULL');
        table.index(['user_id']);
        table.index(['content_type_id']);
        table.index(['product_id']);
        table.index(['status']);
        table.index(['is_public']);
        table.index(['created_at']);
    });
}
async function down(knex) {
    await knex.schema.dropTable('contents');
}
//# sourceMappingURL=20241201000003_create_contents.js.map