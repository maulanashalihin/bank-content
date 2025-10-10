import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('social_post_metrics', function (table) {
        table.uuid('id').primary().notNullable();
        table.uuid('social_post_id').notNullable();

        // Snapshot metrics
        table.integer('likes_count').defaultTo(0);
        table.integer('comments_count').defaultTo(0);
        table.integer('shares_count').defaultTo(0);
        table.integer('views_count').defaultTo(0);
        table.integer('bookmarks_count').defaultTo(0);
        table.integer('engagement_score').defaultTo(0);

        table.string('source', 50).defaultTo('manual'); // manual, scrape, api
        table.bigInteger('captured_at').notNullable();

        /**
         * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
         */
        table.bigInteger('created_at');
        table.bigInteger('updated_at');

        // Foreign key constraints
        table.foreign('social_post_id').references('id').inTable('social_posts').onDelete('CASCADE');

        // Indexes for better performance
        table.index(['social_post_id']);
        table.index(['captured_at']);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('social_post_metrics');
}