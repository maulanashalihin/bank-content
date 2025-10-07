"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('products', function (table) {
        table.uuid('id').primary().notNullable();
        table.string('name', 255).notNullable();
        table.text('description').nullable();
        table.text('image_url').nullable();
        table.text('product_url').nullable();
        table.boolean('is_active').defaultTo(true);
        table.json('metadata').nullable();
        table.bigInteger("created_at");
        table.bigInteger("updated_at");
    });
}
async function down(knex) {
    await knex.schema.dropTable('products');
}
//# sourceMappingURL=20241201000001_create_products.js.map