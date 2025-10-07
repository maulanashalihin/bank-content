
import { Response, Request } from "../../type"; 
import DB from "../services/DB";
import Authenticate from "../services/Authenticate";
import { randomUUID } from "crypto";

class Controller {
    
  public async index (request : Request, response : Response) { 
    try {
      const page = parseInt(request.query.page as string) || 1;
      const limit = parseInt(request.query.limit as string) || 10;
      const search = request.query.search as string || '';
      const offset = (page - 1) * limit;

      let query = DB.from("users").select("*");
      
      if (search) {
        query = query.where(function() {
          this.where('name', 'like', `%${search}%`)
              .orWhere('email', 'like', `%${search}%`)
              .orWhere('phone', 'like', `%${search}%`);
        });
      }

      const users = await query
        .orderBy('created_at', 'desc')
        .limit(limit)
        .offset(offset);

      // Get total count for pagination
      let countQuery = DB.from("users").count('* as total');
      if (search) {
        countQuery = countQuery.where(function() {
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
    } catch (error) {
      console.error('Error fetching users:', error);
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

  public async create (request : Request, response : Response) {
    return response.inertia("admin/users/create");
  }

  public async store (request : Request, response : Response) {
    try {
      const { name, email, phone, password, is_admin, is_verified } = await request.json();

      // Validation
      if (!name || !email || !password) {
        return response.status(400).json({ 
          error: 'Name, email, and password are required' 
        });
      }

      // Check if email already exists
      const existingUser = await DB.from("users").where("email", email).first();
      if (existingUser) {
        return response.status(400).json({ 
          error: 'Email already exists' 
        });
      }

      // Hash password
      const hashedPassword = await Authenticate.hash(password);

      // Create user
      const userId = randomUUID();
      await DB.table("users").insert({
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
    } catch (error) {
      console.error('Error creating user:', error);
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

  public async show (request : Request, response : Response) {
    try {
      const { id } = request.params;
      
      const user = await DB.from("users").where("id", id).first();
      
      if (!user) {
        return response.status(404).json({ error: 'User not found' });
      }

      // Remove password from response
      delete user.password;
      delete user.remember_me_token;

      return response.inertia("admin/users/show", { user });
    } catch (error) {
      console.error('Error fetching user:', error);
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

  public async edit (request : Request, response : Response) {
    try {
      const { id } = request.params;
      
      const user = await DB.from("users").where("id", id).first();
      
      if (!user) {
        return response.status(404).json({ error: 'User not found' });
      }

      // Remove password from response
      delete user.password;
      delete user.remember_me_token;

      return response.inertia("admin/users/edit", { user });
    } catch (error) {
      console.error('Error fetching user for edit:', error);
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

  public async update (request : Request, response : Response) {
    try {
      const { id } = request.params;
      const { name, email, phone, password, is_admin, is_verified } = await request.json();

      // Check if user exists
      const existingUser = await DB.from("users").where("id", id).first();
      if (!existingUser) {
        return response.status(404).json({ error: 'User not found' });
      }

      // Validation
      if (!name || !email) {
        return response.status(400).json({ 
          error: 'Name and email are required' 
        });
      }

      // Check if email already exists for other users
      const emailExists = await DB.from("users")
        .where("email", email)
        .whereNot("id", id)
        .first();
      
      if (emailExists) {
        return response.status(400).json({ 
          error: 'Email already exists' 
        });
      }

      // Prepare update data
      const updateData: any = {
        name,
        email,
        phone: phone || null,
        is_admin: is_admin || false,
        is_verified: is_verified || false,
        updated_at: Date.now()
      };

      // Hash new password if provided
      if (password && password.trim() !== '') {
        updateData.password = await Authenticate.hash(password);
      }

      // Update user
      await DB.table("users").where("id", id).update(updateData);

      return response.redirect("/admin/users");
    } catch (error) {
      console.error('Error updating user:', error);
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

  public async destroy (request : Request, response : Response) {
    try {
      const { id } = request.params;

      // Check if user exists
      const user = await DB.from("users").where("id", id).first();
      if (!user) {
        return response.status(404).json({ error: 'User not found' });
      }

      // Prevent deleting admin users (optional safety check)
      if (user.is_admin) {
        return response.status(400).json({ 
          error: 'Cannot delete admin users' 
        });
      }

      // Delete user
      await DB.table("users").where("id", id).del();

      return response.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

}

export default new Controller()
  