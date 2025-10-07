"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = __importDefault(require("../services/DB"));
const Authenticate_1 = __importDefault(require("../services/Authenticate"));
const crypto_1 = require("crypto");
class Controller {
    async index(request, response) {
        try {
            const page = parseInt(request.query.page) || 1;
            const limit = parseInt(request.query.limit) || 10;
            const search = request.query.search || '';
            const offset = (page - 1) * limit;
            let query = DB_1.default.from("users").select("*");
            if (search) {
                query = query.where(function () {
                    this.where('name', 'like', `%${search}%`)
                        .orWhere('email', 'like', `%${search}%`)
                        .orWhere('phone', 'like', `%${search}%`);
                });
            }
            const users = await query
                .orderBy('created_at', 'desc')
                .limit(limit)
                .offset(offset);
            let countQuery = DB_1.default.from("users").count('* as total');
            if (search) {
                countQuery = countQuery.where(function () {
                    this.where('name', 'like', `%${search}%`)
                        .orWhere('email', 'like', `%${search}%`)
                        .orWhere('phone', 'like', `%${search}%`);
                });
            }
            const totalResult = await countQuery.first();
            const total = totalResult?.total || 0;
            const totalPages = Math.ceil(total / limit);
            return response.inertia("admin/users/index", {
                users,
                pagination: {
                    current_page: page,
                    total_pages: totalPages,
                    total_items: total,
                    per_page: limit
                },
                search
            });
        }
        catch (error) {
            console.error('Error fetching users:', error);
            return response.status(500).json({ error: 'Internal server error' });
        }
    }
    async create(request, response) {
        return response.inertia("admin/users/create");
    }
    async store(request, response) {
        try {
            const { name, email, phone, password, is_admin, is_verified } = await request.json();
            if (!name || !email || !password) {
                return response.status(400).json({
                    error: 'Name, email, and password are required'
                });
            }
            const existingUser = await DB_1.default.from("users").where("email", email).first();
            if (existingUser) {
                return response.status(400).json({
                    error: 'Email already exists'
                });
            }
            const hashedPassword = await Authenticate_1.default.hash(password);
            const userId = (0, crypto_1.randomUUID)();
            await DB_1.default.table("users").insert({
                id: userId,
                name,
                email,
                phone: phone || null,
                password: hashedPassword,
                is_admin: is_admin || false,
                is_verified: is_verified || false,
                membership_date: new Date().toISOString(),
                created_at: Date.now(),
                updated_at: Date.now()
            });
            return response.redirect("/admin/users");
        }
        catch (error) {
            console.error('Error creating user:', error);
            return response.status(500).json({ error: 'Internal server error' });
        }
    }
    async show(request, response) {
        try {
            const { id } = request.params;
            const user = await DB_1.default.from("users").where("id", id).first();
            if (!user) {
                return response.status(404).json({ error: 'User not found' });
            }
            delete user.password;
            delete user.remember_me_token;
            return response.inertia("admin/users/show", { user });
        }
        catch (error) {
            console.error('Error fetching user:', error);
            return response.status(500).json({ error: 'Internal server error' });
        }
    }
    async edit(request, response) {
        try {
            const { id } = request.params;
            const user = await DB_1.default.from("users").where("id", id).first();
            if (!user) {
                return response.status(404).json({ error: 'User not found' });
            }
            delete user.password;
            delete user.remember_me_token;
            return response.inertia("admin/users/edit", { user });
        }
        catch (error) {
            console.error('Error fetching user for edit:', error);
            return response.status(500).json({ error: 'Internal server error' });
        }
    }
    async update(request, response) {
        try {
            const { id } = request.params;
            const { name, email, phone, password, is_admin, is_verified } = await request.json();
            const existingUser = await DB_1.default.from("users").where("id", id).first();
            if (!existingUser) {
                return response.status(404).json({ error: 'User not found' });
            }
            if (!name || !email) {
                return response.status(400).json({
                    error: 'Name and email are required'
                });
            }
            const emailExists = await DB_1.default.from("users")
                .where("email", email)
                .whereNot("id", id)
                .first();
            if (emailExists) {
                return response.status(400).json({
                    error: 'Email already exists'
                });
            }
            const updateData = {
                name,
                email,
                phone: phone || null,
                is_admin: is_admin || false,
                is_verified: is_verified || false,
                updated_at: Date.now()
            };
            if (password && password.trim() !== '') {
                updateData.password = await Authenticate_1.default.hash(password);
            }
            await DB_1.default.table("users").where("id", id).update(updateData);
            return response.redirect("/admin/users");
        }
        catch (error) {
            console.error('Error updating user:', error);
            return response.status(500).json({ error: 'Internal server error' });
        }
    }
    async destroy(request, response) {
        try {
            const { id } = request.params;
            const user = await DB_1.default.from("users").where("id", id).first();
            if (!user) {
                return response.status(404).json({ error: 'User not found' });
            }
            if (user.is_admin) {
                return response.status(400).json({
                    error: 'Cannot delete admin users'
                });
            }
            await DB_1.default.table("users").where("id", id).del();
            return response.json({ message: 'User deleted successfully' });
        }
        catch (error) {
            console.error('Error deleting user:', error);
            return response.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.default = new Controller();
//# sourceMappingURL=UserController.js.map