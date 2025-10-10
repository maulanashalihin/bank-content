"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('social_posts', function (table) {
        table.uuid('id').primary().notNullable();
        table.uuid('user_id').notNullable();
        table.string('title', 255).notNullable();
        table.string('platform', 50).notNullable();
        table.text('post_url').notNullable();
        table.string('external_post_id', 255).nullable();
        table.boolean('is_verified').defaultTo(false);
        table.string('status', 50).defaultTo('pending_verification');
        table.text('verification_notes').nullable();
        table.integer('likes_count').defaultTo(0);
        table.integer('comments_count').defaultTo(0);
        table.integer('shares_count').defaultTo(0);
        table.integer('views_count').defaultTo(0);
        table.integer('bookmarks_count').defaultTo(0);
        table.integer('engagement_score').defaultTo(0);
        table.bigInteger('posted_at').nullable();
        table.bigInteger('last_synced_at').nullable();
        table.json('metadata').nullable();
        table.bigInteger('created_at');
        table.bigInteger('updated_at');
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.index(['user_id']);
        table.index(['platform']);
        table.index(['status']);
        table.index(['created_at']);
    });
}
async function down(knex) {
    await knex.schema.dropTable('social_posts');
}
//# sourceMappingURL=20241201000007_create_social_posts.js.map