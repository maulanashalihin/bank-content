import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('social_posts', function (table) {
        table.uuid('id').primary().notNullable();
        table.uuid('user_id').notNullable();
        // No longer linked to contents; store title directly
        table.string('title', 255).notNullable();

        table.string('platform', 50).notNullable(); // facebook, instagram, twitter/x, tiktok
        table.text('post_url').notNullable();
        table.string('external_post_id', 255).nullable();

        table.boolean('is_verified').defaultTo(false);
        table.string('status', 50).defaultTo('pending_verification'); // pending_verification, verified, rejected, archived
        table.text('verification_notes').nullable();

        // Aggregated engagement metrics (latest snapshot)
        table.integer('likes_count').defaultTo(0);
        table.integer('comments_count').defaultTo(0);
        table.integer('shares_count').defaultTo(0);
        table.integer('views_count').defaultTo(0);
        table.integer('bookmarks_count').defaultTo(0);
        table.integer('engagement_score').defaultTo(0);

        table.bigInteger('posted_at').nullable();
        table.bigInteger('last_synced_at').nullable();

        table.json('metadata').nullable();

        /**
         * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
         */
        table.bigInteger('created_at');
        table.bigInteger('updated_at');

        // Foreign key constraints
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');

        // Indexes for better performance
        table.index(['user_id']);
        table.index(['platform']);
        table.index(['status']);
        table.index(['created_at']);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('social_posts');
}