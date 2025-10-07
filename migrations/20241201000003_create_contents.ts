import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('contents', function (table) {
        table.uuid('id').primary().notNullable()
        table.uuid('user_id').notNullable()
        table.uuid('content_type_id').notNullable()
        table.uuid('product_id').nullable() // One-to-many relationship with products
        table.string('title', 255).notNullable() 
        table.text('content_text').nullable() // For blog posts, email templates, whatsapp messages
        table.text('file_path').nullable() // For images, videos, short videos
        table.string('youtube_url', 255).nullable()
        table.string('file_name', 255).nullable()
        table.string('file_type', 50).nullable() // MIME type
        table.integer('file_size').nullable() // in bytes
        table.text('thumbnail_path').nullable() // For videos
        table.json('metadata').nullable() // Additional content-specific data
        table.string('status', 50).defaultTo('draft') // draft, published, archived
        table.boolean('is_public').defaultTo(true) // Whether content can be shared publicly
        table.boolean('is_featured').defaultTo(false) // Featured content
        table.integer('view_count').defaultTo(0)
        table.integer('download_count').defaultTo(0)
        table.integer('share_count').defaultTo(0)
        table.text('tags').nullable() // Comma-separated tags
        table.uuid('original_content_id').nullable() // If this is a shared/copied content
        
        /**
         * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
         */
        table.bigInteger("created_at")
        table.bigInteger("updated_at")
        
        // Foreign key constraints
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
        table.foreign('content_type_id').references('id').inTable('content_types').onDelete('RESTRICT')
        table.foreign('product_id').references('id').inTable('products').onDelete('SET NULL')
        table.foreign('original_content_id').references('id').inTable('contents').onDelete('SET NULL')
        
        // Indexes for better performance
        table.index(['user_id'])
        table.index(['content_type_id'])
        table.index(['product_id'])
        table.index(['status'])
        table.index(['is_public'])
        table.index(['created_at'])
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('contents')
}