import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('social_post_rewards', function (table) {
        table.uuid('id').primary().notNullable();
        table.uuid('social_post_id').notNullable();
        table.uuid('user_id').notNullable(); // recipient of reward

        table.string('reward_type', 50).notNullable(); // points, voucher, cash, badge
        table.integer('reward_points').defaultTo(0);
        table.string('reward_status', 50).defaultTo('pending'); // pending, granted, revoked
        table.text('notes').nullable();
        table.bigInteger('granted_at').nullable();

        /**
         * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
         */
        table.bigInteger('created_at');
        table.bigInteger('updated_at');

        // Foreign key constraints
        table.foreign('social_post_id').references('id').inTable('social_posts').onDelete('CASCADE');
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');

        // Indexes for better performance
        table.index(['social_post_id']);
        table.index(['user_id']);
        table.index(['reward_status']);
        table.index(['created_at']);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('social_post_rewards');
}