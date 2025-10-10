"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('social_post_rewards', function (table) {
        table.uuid('id').primary().notNullable();
        table.uuid('social_post_id').notNullable();
        table.uuid('user_id').notNullable();
        table.string('reward_type', 50).notNullable();
        table.integer('reward_points').defaultTo(0);
        table.string('reward_status', 50).defaultTo('pending');
        table.text('notes').nullable();
        table.bigInteger('granted_at').nullable();
        table.bigInteger('created_at');
        table.bigInteger('updated_at');
        table.foreign('social_post_id').references('id').inTable('social_posts').onDelete('CASCADE');
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.index(['social_post_id']);
        table.index(['user_id']);
        table.index(['reward_status']);
        table.index(['created_at']);
    });
}
async function down(knex) {
    await knex.schema.dropTable('social_post_rewards');
}
//# sourceMappingURL=20241201000009_create_social_post_rewards.js.map