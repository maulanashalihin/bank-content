import { Response, Request } from "../../type";
import DB from "../services/DB";

class ProductController {
    
    // Admin methods for CRUD operations
    public async index(request: Request, response: Response) {
        try {
            const page = parseInt(request.query?.page as string) || 1;
            const limit = 10;
            const offset = (page - 1) * limit;
            
            // Get total count for pagination
            const totalResult = await DB.table('products').count('* as count').first() as any;
            const totalCount = totalResult.count;
            const totalPages = Math.ceil(totalCount / limit);
            
            // Get products with pagination
            const products = await DB.table('products')
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
        } catch (error) {
            console.error('Error fetching products:', error);
            return response.cookie("error", "Terjadi kesalahan saat mengambil data produk", 3000).redirect("/admin/products");
        }
    }

    public async create(request: Request, response: Response) {
        return response.inertia("admin/products/create");
    }

    public async store(request: Request, response: Response) {
        try {
            const { name, description, image_url, product_url, is_active, metadata } = await request.json();
            
            // Validation
            if (!name || !description) {
                return response.cookie("error", "Nama dan deskripsi wajib diisi", 3000).redirect("/admin/products/create");
            }
            
            const productId = crypto.randomUUID();
            const now = Date.now();
            
            await DB.table('products').insert({
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
        } catch (error) {
            console.error('Error creating product:', error);
            return response.cookie("error", "Terjadi kesalahan saat membuat produk", 3000).redirect("/admin/products/create");
        }
    }

    public async show(request: Request, response: Response) {
    const { id } = request.params;
    
    const product = await DB.table("products").where("id", id).first();
    
    if (!product) {
      return response
        .cookie("error", "Produk tidak ditemukan", 3000)
        .redirect("/admin/products");
    }

    return response.inertia("admin/products/show", { product });
  }

    public async edit(request: Request, response: Response) {
    const { id } = request.params;
    
    const product = await DB.table("products").where("id", id).first();
    
    if (!product) {
      return response
        .cookie("error", "Produk tidak ditemukan", 3000)
        .redirect("/admin/products");
    }

    return response.inertia("admin/products/edit", { product });
  }

    public async update(request: Request, response: Response) {
        try {
            const productId = request.params.id;
            const { name, description, image_url, product_url, is_active, metadata } = await request.json();
            
            // Validation
            if (!name || !description) {
                return response.cookie("error", "Nama dan deskripsi wajib diisi", 3000).redirect(`/admin/products/${productId}/edit`);
            }
            
            // Check if product exists
            const product = await DB.table('products').where('id', productId).first();
            if (!product) {
                return response.cookie("error", "Produk tidak ditemukan", 3000).redirect("/admin/products");
            }
            
            await DB.table('products').where('id', productId).update({
                name,
                description,
                image_url: image_url || null,
                product_url: product_url || null,
                is_active: is_active !== undefined ? is_active : true,
                metadata: metadata ? JSON.stringify(metadata) : null,
                updated_at: Date.now()
            });
            
            return response.cookie("success", "Produk berhasil diperbarui", 3000).redirect("/admin/products");
        } catch (error) {
            console.error('Error updating product:', error);
            return response.cookie("error", "Terjadi kesalahan saat memperbarui produk", 3000).redirect(`/admin/products/${request.params.id}/edit`);
        }
    }

    public async destroy(request: Request, response: Response) {
        try {
            const { id } = request.params;
            
            const product = await DB.table("products").where("id", id).first();
            
            if (!product) {
                return response
                    .cookie("error", "Produk tidak ditemukan", 3000)
                    .redirect("/admin/products");
            }

            await DB.table("products").where("id", id).del();

            return response
                .cookie("success", "Produk berhasil dihapus", 3000)
                .redirect("/admin/products");
        } catch (error) {
            console.error("Error deleting product:", error);
            return response
                .cookie("error", "Terjadi kesalahan saat menghapus produk", 3000)
                .redirect("/admin/products");
        }
    }

    // User methods for searching products to mention
    public async search(request: Request, response: Response) {
        const query = request.query.q as string || "";
        const limit = parseInt(request.query.limit as string) || 10;
        
        let searchQuery = DB.from("products")
            .select("id", "name", "description", "sku", "price", "category", "brand", "image_url")
            .where("is_active", true);
        
        if (query) {
            searchQuery = searchQuery.where(function() {
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

    public async getById(request: Request, response: Response) {
        const id = request.params.id;
        const product = await DB.from("products")
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

export default new ProductController();