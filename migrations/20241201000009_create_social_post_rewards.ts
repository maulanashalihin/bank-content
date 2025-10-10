import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('social_post_rewards', function (table) {
        table.uuid('id').primary().notNullable();
        table.uuid('social_post_id').notNullable();
        table.uuid('user_id').notNullable(); // recipient of reward
        table.uuid('product_id').notNullable(); // link reward to product
        table.string('email', 255).notNullable(); // mapping with product account

        // Allowed types: cash, membership, token
        table.enum('reward_type', ['cash', 'membership', 'token']).notNullable();
        table.integer('reward_points').defaultTo(0);
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
        table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE');

        // Indexes for better performance
        table.index(['social_post_id']);
        table.index(['user_id']);
        table.index(['product_id']);
        table.index(['reward_type']);
        table.index(['created_at']);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('social_post_rewards');
}