import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('content_shares', function (table) {
        table.uuid('id').primary().notNullable()
        table.uuid('content_id').notNullable()
        table.uuid('shared_by_user_id').notNullable() // User who shared the content
        table.uuid('shared_to_user_id').nullable() // User who received the share (null for public shares)
        table.string('share_type', 50).notNullable() // direct, public, affiliate, driplab
        table.string('share_platform', 100).nullable() // whatsapp, email, telegram, instagram, etc.
        table.text('share_message').nullable() // Custom message when sharing
        table.text('share_url').nullable() // Generated share URL
        table.boolean('is_active').defaultTo(true) // Whether the share is still active
        table.integer('view_count').defaultTo(0) // How many times the shared content was viewed
        table.integer('click_count').defaultTo(0) // How many times the share link was clicked
        table.dateTime('expires_at').nullable() // Expiration date for the share
        table.json('metadata').nullable() // Additional sharing metadata
        
        /**
         * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
         */
        table.bigInteger("created_at")
        table.bigInteger("updated_at")
        
        // Foreign key constraints
        table.foreign('content_id').references('id').inTable('contents').onDelete('CASCADE')
        table.foreign('shared_by_user_id').references('id').inTable('users').onDelete('CASCADE')
        table.foreign('shared_to_user_id').references('id').inTable('users').onDelete('CASCADE')
        
        // Indexes for better performance
        table.index(['content_id'])
        table.index(['shared_by_user_id'])
        table.index(['shared_to_user_id'])
        table.index(['share_type'])
        table.index(['is_active'])
        table.index(['created_at'])
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('content_shares')
}