"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = __importDefault(require("../services/DB"));
class ProductController {
    async index(request, response) {
        try {
            const page = parseInt(request.query?.page) || 1;
            const limit = 10;
            const offset = (page - 1) * limit;
            const totalResult = await DB_1.default.table('products').count('* as count').first();
            const totalCount = totalResult.count;
            const totalPages = Math.ceil(totalCount / limit);
            const products = await DB_1.default.table('products')
                .select('*')
                .orderBy('created_at', 'desc')
                .limit(limit)
                .offset(offset);
            return response.inertia('admin/products/index', {
                products,
                pagination: {
                    current_page: page,
                    total_pages: totalPages,
                    total_count: totalCount,
                    per_page: limit
                }
            });
        }
        catch (error) {
            console.error('Error fetching products:', error);
            return response.cookie("error", "Terjadi kesalahan saat mengambil data produk", 3000).redirect("/admin/products");
        }
    }
    async create(request, response) {
        return response.inertia("admin/products/create");
    }
    async store(request, response) {
        try {
            const { name, description, image_url, product_url, is_active, metadata } = await request.json();
            if (!name || !description) {
                return response.cookie("error", "Nama dan deskripsi wajib diisi", 3000).redirect("/admin/products/create");
            }
            const productId = crypto.randomUUID();
            const now = Date.now();
            await DB_1.default.table('products').insert({
                id: productId,
                name,
                description,
                image_url: image_url || null,
                product_url: product_url || null,
                is_active: is_active !== undefined ? is_active : true,
                metadata: metadata ? JSON.stringify(metadata) : null,
                created_at: now,
                updated_at: now
            });
            return response.cookie("success", "Produk berhasil dibuat", 3000).redirect("/admin/products");
        }
        catch (error) {
            console.error('Error creating product:', error);
            return response.cookie("error", "Terjadi kesalahan saat membuat produk", 3000).redirect("/admin/products/create");
        }
    }
    async show(request, response) {
        const { id } = request.params;
        const product = await DB_1.default.table("products").where("id", id).first();
        if (!product) {
            return response
                .cookie("error", "Produk tidak ditemukan", 3000)
                .redirect("/admin/products");
        }
        return response.inertia("admin/products/show", { product });
    }
    async edit(request, response) {
        const { id } = request.params;
        const product = await DB_1.default.table("products").where("id", id).first();
        if (!product) {
            return response
                .cookie("error", "Produk tidak ditemukan", 3000)
                .redirect("/admin/products");
        }
        return response.inertia("admin/products/edit", { product });
    }
    async update(request, response) {
        try {
            const productId = request.params.id;
            const { name, description, image_url, product_url, is_active, metadata } = await request.json();
            if (!name || !description) {
                return response.cookie("error", "Nama dan deskripsi wajib diisi", 3000).redirect(`/admin/products/${productId}/edit`);
            }
            const product = await DB_1.default.table('products').where('id', productId).first();
            if (!product) {
                return response.cookie("error", "Produk tidak ditemukan", 3000).redirect("/admin/products");
            }
            await DB_1.default.table('products').where('id', productId).update({
                name,
                description,
                image_url: image_url || null,
                product_url: product_url || null,
                is_active: is_active !== undefined ? is_active : true,
                metadata: metadata ? JSON.stringify(metadata) : null,
                updated_at: Date.now()
            });
            return response.cookie("success", "Produk berhasil diperbarui", 3000).redirect("/admin/products");
        }
        catch (error) {
            console.error('Error updating product:', error);
            return response.cookie("error", "Terjadi kesalahan saat memperbarui produk", 3000).redirect(`/admin/products/${request.params.id}/edit`);
        }
    }
    async destroy(request, response) {
        try {
            const { id } = request.params;
            const product = await DB_1.default.table("products").where("id", id).first();
            if (!product) {
                return response
                    .cookie("error", "Produk tidak ditemukan", 3000)
                    .redirect("/admin/products");
            }
            await DB_1.default.table("products").where("id", id).del();
            return response
                .cookie("success", "Produk berhasil dihapus", 3000)
                .redirect("/admin/products");
        }
        catch (error) {
            console.error("Error deleting product:", error);
            return response
                .cookie("error", "Terjadi kesalahan saat menghapus produk", 3000)
                .redirect("/admin/products");
        }
    }
    async search(request, response) {
        const query = request.query.q || "";
        const limit = parseInt(request.query.limit) || 10;
        let searchQuery = DB_1.default.from("products")
            .select("id", "name", "description", "sku", "price", "category", "brand", "image_url")
            .where("is_active", true);
        if (query) {
            searchQuery = searchQuery.where(function () {
                this.where('name', 'like', `%${query}%`)
                    .orWhere('description', 'like', `%${query}%`)
                    .orWhere('sku', 'like', `%${query}%`)
                    .orWhere('brand', 'like', `%${query}%`)
                    .orWhere('category', 'like', `%${query}%`);
            });
        }
        const products = await searchQuery
            .orderBy('name')
            .limit(limit);
        return response.json({ products });
    }
    async getById(request, response) {
        const id = request.params.id;
        const product = await DB_1.default.from("products")
            .select("id", "name", "description", "sku", "price", "category", "brand", "image_url", "product_url")
            .where("id", id)
            .where("is_active", true)
            .first();
        if (!product) {
            return response.status(404).json({ error: "Produk tidak ditemukan" });
        }
        return response.json({ product });
    }
}
exports.default = new ProductController();
//# sourceMappingURL=ProductController.js.map