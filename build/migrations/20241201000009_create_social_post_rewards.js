"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('social_post_rewards', function (table) {
        table.uuid('id').primary().notNullable();
        table.uuid('social_post_id').notNullable();
        table.uuid('user_id').notNullable();
        table.uuid('product_id').notNullable();
        table.string('email', 255).notNullable();
        table.enum('reward_type', ['cash', 'membership', 'token']).notNullable();
        table.integer('reward_points').defaultTo(0);
        table.text('notes').nullable();
        table.bigInteger('granted_at').nullable();
        table.bigInteger('created_at');
        table.bigInteger('updated_at');
        table.foreign('social_post_id').references('id').inTable('social_posts').onDelete('CASCADE');
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE');
        table.index(['social_post_id']);
        table.index(['user_id']);
        table.index(['product_id']);
        table.index(['reward_type']);
        table.index(['created_at']);
    });
}
async function down(knex) {
    await knex.schema.dropTable('social_post_rewards');
}
//# sourceMappingURL=20241201000009_create_social_post_rewards.js.map