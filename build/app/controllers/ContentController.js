"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = __importDefault(require("../services/DB"));
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class ContentController {
    async index(request, response) {
        try {
            const { product_id, content_type_id, search, page = 1, limit = 12, sortBy = 'created_at', sortOrder = 'desc' } = request.query;
            const offset = (parseInt(page) - 1) * parseInt(limit);
            let query = DB_1.default.from('contents')
                .select([
                'contents.*',
                'users.name as user_name',
                'content_types.display_name as content_type_name',
                'products.name as product_name'
            ])
                .leftJoin('users', 'contents.user_id', 'users.id')
                .leftJoin('content_types', 'contents.content_type_id', 'content_types.id')
                .leftJoin('products', 'contents.product_id', 'products.id')
                .where('contents.is_public', true);
            const validSortColumns = ['created_at', 'title', 'view_count', 'download_count', 'share_count'];
            const validSortOrders = ['asc', 'desc'];
            const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
            const sortDirection = validSortOrders.includes(sortOrder) ? sortOrder : 'desc';
            query = query.orderBy(`contents.${sortColumn}`, sortDirection);
            if (product_id) {
                query = query.where('contents.product_id', product_id);
            }
            if (content_type_id) {
                query = query.where('contents.content_type_id', content_type_id);
            }
            if (search) {
                query = query.where(function () {
                    this.where('contents.title', 'like', `%${search}%`)
                        .orWhere('contents.content_text', 'like', `%${search}%`)
                        .orWhere('contents.tags', 'like', `%${search}%`);
                });
            }
            const totalQuery = query.clone();
            const [{ count }] = await totalQuery.count('* as count');
            const contents = await query.limit(parseInt(limit)).offset(offset);
            const products = await DB_1.default.from('products').select('id', 'name').where('is_active', true);
            const contentTypes = await DB_1.default.from('content_types').select('id', 'display_name').where('is_active', true);
            return response.inertia("contents/index", {
                contents,
                products,
                contentTypes,
                filters: { product_id, content_type_id, search, sortBy, sortOrder },
                pagination: {
                    current_page: parseInt(page),
                    per_page: parseInt(limit),
                    total: count,
                    last_page: Math.ceil(count / parseInt(limit))
                }
            });
        }
        catch (error) {
            console.error('Error fetching contents:', error);
            return response.status(500).json({ error: 'Internal server error' });
        }
    }
    async create(request, response) {
        try {
            const products = await DB_1.default.from('products').select('id', 'name').where('is_active', true);
            const contentTypes = await DB_1.default.from('content_types').select('*').where('is_active', true);
            return response.inertia("contents/create", {
                products,
                contentTypes
            });
        }
        catch (error) {
            console.error('Error loading create form:', error);
            return response.status(500).json({ error: 'Internal server error' });
        }
    }
    async store(request, response) {
        try {
            const user = request.user;
            if (!user) {
                return response.status(401).json({ error: 'Unauthorized' });
            }
            const { title, content_text, content_type_id, product_id, youtube_url, tags, status = 'published', is_public = true, carousel_files, file_data } = await request.json();
            if (!title || !content_type_id) {
                return response.status(400).json({
                    error: 'Title and content type are required'
                });
            }
            const contentId = (0, uuid_1.v4)();
            const now = Date.now();
            let metadata = null;
            let file_path = null;
            let file_type = null;
            let file_size = null;
            let file_key = null;
            if (carousel_files && carousel_files.length > 0) {
                metadata = JSON.stringify({
                    carousel_files: carousel_files
                });
            }
            else if (file_data) {
                file_path = file_data.url;
                file_type = file_data.type;
                file_size = file_data.size;
                file_key = file_data.key;
                metadata = JSON.stringify({
                    filename: file_data.filename,
                    s3_key: file_data.key
                });
            }
            const contentData = {
                id: contentId,
                user_id: user.id,
                title,
                content_text,
                content_type_id,
                product_id: product_id || null,
                youtube_url: youtube_url || null,
                tags: tags || null,
                status,
                is_public,
                file_path,
                file_type,
                file_size,
                file_key,
                metadata,
                view_count: 0,
                download_count: 0,
                share_count: 0,
                created_at: now,
                updated_at: now
            };
            await DB_1.default.table('contents').insert(contentData);
            return response.redirect('/contents/' + contentId + "/edit");
        }
        catch (error) {
            console.error('Error creating content:', error);
            return response.status(500).json({ error: 'Internal server error' });
        }
    }
    async show(request, response) {
        try {
            const { id } = request.params;
            const content = await DB_1.default.from('contents')
                .select([
                'contents.*',
                'users.name as user_name',
                'users.email as user_email',
                'content_types.display_name as content_type_name',
                'products.name as product_name'
            ])
                .leftJoin('users', 'contents.user_id', 'users.id')
                .leftJoin('content_types', 'contents.content_type_id', 'content_types.id')
                .leftJoin('products', 'contents.product_id', 'products.id')
                .where('contents.id', id)
                .first();
            if (!content) {
                return response.status(404).json({ error: 'Content not found' });
            }
            if (content.metadata) {
                try {
                    const metadata = JSON.parse(content.metadata);
                    content.carousel_files = metadata.carousel_files || [];
                }
                catch (error) {
                    content.carousel_files = [];
                }
            }
            else {
                content.carousel_files = [];
            }
            await DB_1.default.table('contents')
                .where('id', id)
                .increment('view_count', 1);
            return response.inertia("contents/show", { content });
        }
        catch (error) {
            console.error('Error fetching content:', error);
            return response.status(500).json({ error: 'Internal server error' });
        }
    }
    async edit(request, response) {
        try {
            const { id } = request.params;
            const user = request.user;
            const content = await DB_1.default.from('contents')
                .where('id', id)
                .first();
            if (!content) {
                return response.status(404).json({ error: 'Content not found' });
            }
            if (content.user_id !== user?.id && !user?.is_admin) {
                return response.status(403).json({ error: 'Forbidden' });
            }
            if (content.metadata) {
                try {
                    const metadata = JSON.parse(content.metadata);
                    content.carousel_files = metadata.carousel_files || [];
                }
                catch (error) {
                    content.carousel_files = [];
                }
            }
            else {
                content.carousel_files = [];
            }
            const products = await DB_1.default.from('products').select('id', 'name').where('is_active', true);
            const contentTypes = await DB_1.default.from('content_types').select('*').where('is_active', true);
            return response.inertia("contents/edit", {
                content,
                products,
                contentTypes
            });
        }
        catch (error) {
            console.error('Error loading edit form:', error);
            return response.status(500).json({ error: 'Internal server error' });
        }
    }
    async update(request, response) {
        try {
            const { id } = request.params;
            const user = request.user;
            const content = await DB_1.default.from('contents').where('id', id).first();
            if (!content) {
                return response.status(404).json({ error: 'Content not found' });
            }
            if (content.user_id !== user?.id && !user?.is_admin) {
                return response.status(403).json({ error: 'Forbidden' });
            }
            const { title, content_text, content_type_id, product_id, youtube_url, tags, status, is_public, carousel_files, file_data, remove_file } = await request.json();
            let metadata = null;
            let file_path = null;
            let file_type = null;
            let file_size = null;
            let file_key = null;
            if (carousel_files && carousel_files.length > 0) {
                metadata = JSON.stringify({
                    carousel_files: carousel_files
                });
            }
            else if (file_data) {
                file_path = file_data.url;
                file_type = file_data.type;
                file_size = file_data.size;
                file_key = file_data.key;
                metadata = JSON.stringify({
                    filename: file_data.filename,
                    s3_key: file_data.key
                });
            }
            else if (remove_file) {
                file_path = null;
                file_type = null;
                file_size = null;
                file_key = null;
                metadata = null;
            }
            const updateData = {
                title,
                content_text,
                content_type_id,
                product_id: product_id || null,
                youtube_url: youtube_url || null,
                tags: tags || null,
                status,
                is_public,
                updated_at: Date.now()
            };
            if (file_data || remove_file) {
                updateData.file_path = file_path;
                updateData.file_type = file_type;
                updateData.file_size = file_size;
                updateData.file_key = file_key;
            }
            if (metadata !== null || remove_file) {
                updateData.metadata = metadata;
            }
            await DB_1.default.table('contents')
                .where('id', id)
                .update(updateData);
            return response.send("OK");
        }
        catch (error) {
            console.error('Error updating content:', error);
            return response.status(500).json({ error: 'Internal server error' });
        }
    }
    async destroy(request, response) {
        try {
            const { id } = request.params;
            const user = request.user;
            const content = await DB_1.default.from('contents').where('id', id).first();
            if (!content) {
                return response.status(404).json({ error: 'Content not found' });
            }
            if (content.user_id !== user?.id && !user?.is_admin) {
                return response.status(403).json({ error: 'Forbidden' });
            }
            if (content.file_path) {
                const filePath = path_1.default.join(process.cwd(), 'public', content.file_path);
                if (fs_1.default.existsSync(filePath)) {
                    fs_1.default.unlinkSync(filePath);
                }
            }
            if (content.thumbnail_path) {
                const thumbnailPath = path_1.default.join(process.cwd(), 'public', content.thumbnail_path);
                if (fs_1.default.existsSync(thumbnailPath)) {
                    fs_1.default.unlinkSync(thumbnailPath);
                }
            }
            await DB_1.default.table('contents').where('id', id).del();
            return response.redirect('/contents');
        }
        catch (error) {
            console.error('Error deleting content:', error);
            return response.status(500).json({ error: 'Internal server error' });
        }
    }
    async download(request, response) {
        try {
            const { id } = request.params;
            const content = await DB_1.default.from('contents')
                .where('id', id)
                .first();
            if (!content) {
                return response.status(404).json({ error: 'Content not found' });
            }
            await DB_1.default.table('contents')
                .where('id', id)
                .increment('download_count', 1);
            const updatedContent = await DB_1.default.from('contents')
                .where('id', id)
                .first();
            return response.json({
                success: true,
                message: 'Download count updated',
                download_count: updatedContent.download_count
            });
        }
        catch (error) {
            console.error('Error updating download count:', error);
            return response.status(500).json({ error: 'Internal server error' });
        }
    }
    async share(request, response) {
        try {
            const { id } = request.params;
            const { share_type = 'public', share_platform, share_message, shared_to_user_id } = await request.json();
            const content = await DB_1.default.from('contents')
                .where('id', id)
                .where('status', 'published')
                .first();
            if (!content) {
                return response.status(404).json({ error: 'Content not found' });
            }
            const baseUrl = process.env.APP_URL || 'http://localhost:5555';
            const shareId = (0, uuid_1.v4)();
            const shareUrl = `${baseUrl}/shared/${shareId}`;
            await DB_1.default.table('content_shares').insert({
                id: shareId,
                content_id: id,
                shared_by_user_id: request.user.id,
                shared_to_user_id: shared_to_user_id || null,
                share_type,
                share_platform: share_platform || null,
                share_message: share_message || null,
                share_url: shareUrl,
                is_active: true,
                view_count: 0,
                click_count: 0,
                expires_at: null,
                metadata: JSON.stringify({
                    user_agent: request.headers['user-agent'],
                    ip_address: request.ip
                }),
                created_at: Date.now(),
                updated_at: Date.now()
            });
            await DB_1.default.from('contents')
                .where('id', id)
                .increment('share_count', 1);
            return response.json({
                success: true,
                share_url: shareUrl,
                share_id: shareId,
                message: 'Content shared successfully'
            });
        }
        catch (error) {
            console.error('Error sharing content:', error);
            return response.status(500).json({ error: 'Internal server error' });
        }
    }
    async getSharedContent(request, response) {
        try {
            const { shareId } = request.params;
            const share = await DB_1.default.from('content_shares')
                .select([
                'content_shares.*',
                'contents.*',
                'users.name as shared_by_name',
                'content_types.display_name as content_type_name',
                'products.name as product_name'
            ])
                .leftJoin('contents', 'content_shares.content_id', 'contents.id')
                .leftJoin('users', 'content_shares.shared_by_user_id', 'users.id')
                .leftJoin('content_types', 'contents.content_type_id', 'content_types.id')
                .leftJoin('products', 'contents.product_id', 'products.id')
                .where('content_shares.id', shareId)
                .where('content_shares.is_active', true)
                .where('contents.status', 'published')
                .first();
            if (!share) {
                return response.status(404).json({
                    error: 'Shared content not found or has expired'
                });
            }
            if (share.expires_at && new Date(share.expires_at) < new Date()) {
                return response.status(404).json({
                    error: 'This shared content has expired'
                });
            }
            await DB_1.default.from('content_shares')
                .where('id', shareId)
                .increment('view_count', 1);
            await DB_1.default.from('contents')
                .where('id', share.content_id)
                .increment('view_count', 1);
            return response.inertia('contents/shared', {
                content: share,
                shareInfo: {
                    shared_by: share.shared_by_name,
                    shared_at: share.created_at,
                    share_message: share.share_message
                }
            });
        }
        catch (error) {
            console.error('Error getting shared content:', error);
            return response.status(500).json({
                error: 'Internal server error'
            });
        }
    }
}
exports.default = new ContentController();
//# sourceMappingURL=ContentController.js.map