"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('social_post_metrics', function (table) {
        table.uuid('id').primary().notNullable();
        table.uuid('social_post_id').notNullable();
        table.integer('likes_count').defaultTo(0);
        table.integer('comments_count').defaultTo(0);
        table.integer('shares_count').defaultTo(0);
        table.integer('views_count').defaultTo(0);
        table.integer('bookmarks_count').defaultTo(0);
        table.integer('engagement_score').defaultTo(0);
        table.string('source', 50).defaultTo('manual');
        table.bigInteger('captured_at').notNullable();
        table.bigInteger('created_at');
        table.bigInteger('updated_at');
        table.foreign('social_post_id').references('id').inTable('social_posts').onDelete('CASCADE');
        table.index(['social_post_id']);
        table.index(['captured_at']);
    });
}
async function down(knex) {
    await knex.schema.dropTable('social_post_metrics');
}
//# sourceMappingURL=20241201000008_create_social_post_metrics.js.map