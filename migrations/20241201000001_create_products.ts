import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('products', function (table) {
        table.uuid('id').primary().notNullable()
        table.string('name', 255).notNullable()
        table.text('description').nullable() 
        table.text('image_url').nullable()
        table.text('product_url').nullable()
        table.boolean('is_active').defaultTo(true)
        table.json('metadata').nullable() // For additional product data
        
        /**
         * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
         */
        table.bigInteger("created_at")
        table.bigInteger("updated_at")
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('products')
}