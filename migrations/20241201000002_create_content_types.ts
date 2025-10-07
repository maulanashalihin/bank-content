import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('content_types', function (table) {
        table.string('id').primary().notNullable()
        table.string('display_name', 255).notNullable()
        table.text('description').nullable()
        table.json('allowed_file_types').nullable() // ['jpg', 'png', 'gif'] for images, ['mp4', 'avi'] for videos, etc.
        table.integer('max_file_size').nullable() // in bytes
        table.json('validation_rules').nullable() // Additional validation rules specific to content type
        table.boolean('is_active').defaultTo(true)
        
        /**
         * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
         */
        table.bigInteger("created_at")
        table.bigInteger("updated_at")
    })

    // Insert default content types
    await knex('content_types').insert([
        {
            id: "image", 
            display_name: 'Gambar',
            description: 'Konten berupa gambar/foto',
            allowed_file_types: JSON.stringify(['jpg', 'jpeg', 'png', 'gif', 'webp']),
            max_file_size: 10485760, // 10MB
            created_at: Date.now(),
            updated_at: Date.now()
        },
        {
            id: "carousel", 
            display_name: 'Carousel',
            description:  'Konten berupa carousel/galeri gambar',
            allowed_file_types: JSON.stringify(['jpg', 'jpeg', 'png', 'gif', 'webp']),
            max_file_size: 10485760, // 10MB
            created_at: Date.now(),
            updated_at: Date.now()
        },
        {
            id: "video", 
            display_name: 'Video',
            description: 'Konten berupa video',
            allowed_file_types: JSON.stringify(['mp4', 'avi', 'mov', 'wmv', 'flv']),
            max_file_size: 104857600, // 100MB
            created_at: Date.now(),
            updated_at: Date.now()
        },
        {
            id: "blog_post", 
            display_name: 'Blog Post',
            description: 'Konten berupa artikel/blog post',
            allowed_file_types: null,
            max_file_size: null,
            created_at: Date.now(),
            updated_at: Date.now()
        },
        {
            id: "email", 
            display_name: 'Email',
            description: 'Konten berupa template email',
            allowed_file_types: null,
            max_file_size: null,
            created_at: Date.now(),
            updated_at: Date.now()
        },
        {
            id: "whatsapp_message", 
            display_name: 'WhatsApp Message',
            description: 'Konten berupa template pesan WhatsApp',
            allowed_file_types: null,
            max_file_size: null,
            created_at: Date.now(),
            updated_at: Date.now()
        },
        {
            id: "short_video", 
            display_name: 'Short Video',
            description: 'Konten berupa video pendek (seperti TikTok, Instagram Reels)',
            allowed_file_types: JSON.stringify(['mp4', 'mov']),
            max_file_size: 52428800, // 50MB
            created_at: Date.now(),
            updated_at: Date.now()
        },
        {
            id: "youtube_video", 
            display_name: 'Youtube Video',
            description: 'Konten berupa video dari Youtube',
            allowed_file_types: null,
            max_file_size: 52428800, // 50MB
            created_at: Date.now(),
            updated_at: Date.now()
        }
    ])
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('content_types')
}