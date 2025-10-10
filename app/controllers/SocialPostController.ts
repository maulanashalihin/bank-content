import { Request, Response } from "../../type";
import DB from "../services/DB";
import { randomUUID } from "crypto";

const ALLOWED_PLATFORMS = ["facebook", "instagram", "threads", "x", "tiktok", "youtube"];

class SocialPostController {
  // List social posts for current user
  public async index(request: Request, response: Response) {
    try {
      const user = request.user;
      if (!user) return response.status(401).json({ error: "Unauthorized" });

      const posts = await DB.from("social_posts")
        .select(["social_posts.*"]) 
        .where("social_posts.user_id", user.id)
        .orderBy("social_posts.created_at", "desc");

      return response.inertia("social-posts/index", { posts });
    } catch (error) {
      console.error("Error listing social posts:", error);
      return response.status(500).json({ error: "Internal server error" });
    }
  }

  // Show create form
  public async create(request: Request, response: Response) {
    try {
      const contents = await DB.from("contents")
        .select(["id", "title"]) // optional mapping to a content
        .orderBy("created_at", "desc");
      return response.inertia("social-posts/create", { contents, platforms: ALLOWED_PLATFORMS });
    } catch (error) {
      console.error("Error loading create form:", error);
      return response.status(500).json({ error: "Internal server error" });
    }
  }

  // Store new social post submission
  public async store(request: Request, response: Response) {
    try {
      const user = request.user;
      if (!user) return response.status(401).json({ error: "Unauthorized" });

      const {
        title,
        platform,
        post_url,
        external_post_id,
      } = await request.json();

      // Basic validation
      if (!title || String(title).trim().length === 0) {
        return response.status(400).json({ error: "Title is required" });
      }
      if (!platform || !ALLOWED_PLATFORMS.includes(String(platform).toLowerCase())) {
        return response.status(400).json({ error: "Invalid platform" });
      }
      if (!post_url || !/^https?:\/\//i.test(post_url)) {
        return response.status(400).json({ error: "Invalid post URL" });
      }

      const id = randomUUID();
      const now = Date.now();

      const normalizedPlatform = platform === "x" ? "twitter" : String(platform).toLowerCase();

      const data = {
        id,
        user_id: user.id,
        title: String(title).trim(),
        platform: normalizedPlatform,
        post_url,
        external_post_id: external_post_id || null,
        is_verified: false,
        status: "pending_verification",
        verification_notes: null,
        likes_count: 0,
        comments_count: 0,
        shares_count: 0,
        views_count: 0,
        bookmarks_count: 0,
        engagement_score: 0,
        posted_at: null,
        last_synced_at: null,
        metadata: null,
        created_at: now,
        updated_at: now,
      };

      await DB.table("social_posts").insert(data);

      return response.redirect("/social-posts");
    } catch (error) {
      console.error("Error storing social post:", error);
      return response.status(500).json({ error: "Internal server error" });
    }
  }

  // Show single social post (owner only)
  public async show(request: Request, response: Response) {
    try {
      const user = request.user;
      if (!user) return response.status(401).json({ error: "Unauthorized" });
      const { id } = request.params as any;

      const post = await DB.from("social_posts")
        .select([
          "social_posts.*",
          "users.name as user_name",
        ])
        .leftJoin("users", "social_posts.user_id", "users.id")
        .where("social_posts.id", id)
        .first();

      if (!post) return response.status(404).json({ error: "Social post not found" });
      if (post.user_id !== user.id) return response.status(403).json({ error: "Forbidden" });

      // Fetch metrics history for the owner to view
      const metrics = await DB.from("social_post_metrics")
        .where("social_post_id", id)
        .orderBy("captured_at", "desc");

      return response.inertia("social-posts/show", { post, history: metrics });
    } catch (error) {
      console.error("Error fetching social post:", error);
      return response.status(500).json({ error: "Internal server error" });
    }
  }

  // Admin: list all submissions
  public async adminIndex(request: Request, response: Response) {
    try {
      const { platform, status } = request.query as any;

      let query = DB.from("social_posts")
        .select([
          "social_posts.*",
          "users.name as user_name",
        ])
        .leftJoin("users", "social_posts.user_id", "users.id")
        .orderBy("social_posts.created_at", "desc");

      if (platform && ALLOWED_PLATFORMS.includes(String(platform).toLowerCase())) {
        query = query.where("social_posts.platform", String(platform).toLowerCase());
      }
      if (status) {
        query = query.where("social_posts.status", status);
      }

      const posts = await query;
      return response.inertia("admin/social-posts/index", { posts, filters: { platform, status } });
    } catch (error) {
      console.error("Error listing admin social posts:", error);
      return response.status(500).json({ error: "Internal server error" });
    }
  }

  // Admin: verify or reject submission
  public async verify(request: Request, response: Response) {
    try {
      const { id } = request.params as any;
      const { action, notes } = await request.json();
      const now = Date.now();

      if (!["verified", "rejected"].includes(action)) {
        return response.status(400).json({ error: "Invalid action" });
      }

      const is_verified = action === "verified";
      await DB.table("social_posts")
        .where("id", id)
        .update({
          status: action,
          is_verified,
          verification_notes: notes || null,
          updated_at: now,
        });

      // If verified, attempt to grant reward based on current aggregate metrics
      if (is_verified) {
        const post = await DB.from("social_posts").where("id", id).first();
        if (post) {
          const { default: RewardService } = await import("../services/RewardService");
          await RewardService.evaluateAndGrant({
            id: post.id,
            user_id: post.user_id,
            engagement_score: post.engagement_score || 0,
          });
        }
      }

      return response.redirect("/admin/social-posts");
    } catch (error) {
      console.error("Error verifying social post:", error);
      return response.status(500).json({ error: "Internal server error" });
    }
  }

  // Admin: show single submission with metrics history
  public async adminShow(request: Request, response: Response) {
    try {
      const { id } = request.params as any;

      const post = await DB.from("social_posts")
        .select([
          "social_posts.*",
          "users.name as user_name",
        ])
        .leftJoin("users", "social_posts.user_id", "users.id")
        .where("social_posts.id", id)
        .first();

      if (!post) return response.status(404).json({ error: "Social post not found" });

      const metrics = await DB.from("social_post_metrics")
        .where("social_post_id", id)
        .orderBy("captured_at", "desc");

      // Load rewards associated with this post (include product info)
      const rewards = await DB.from("social_post_rewards")
        .select([
          "social_post_rewards.*",
          "products.name as product_name",
        ])
        .leftJoin("products", "social_post_rewards.product_id", "products.id")
        .where("social_post_rewards.social_post_id", id)
        .orderBy("social_post_rewards.created_at", "desc");

      // Load products for reward assignment
      const products = await DB.table("products")
        .select(["id", "name"]) 
        .orderBy("created_at", "desc");
      return response.inertia("admin/social-posts/show", { post, metrics, rewards, products });
    } catch (error) {
      console.error("Error fetching admin social post:", error);
      return response.status(500).json({ error: "Internal server error" });
    }
  }
  
  // Admin: manually grant a reward to the user for a social post
  public async adminRewardStore(request: Request, response: Response) {
    try {
      const { id } = request.params as any;
      const body = await request.json();

      const post = await DB.from("social_posts").where("id", id).first();
      if (!post) return response.status(404).json({ error: "Social post not found" });

      const user = request.user;
      if (!user || !user.is_admin) {
        return response.status(403).json({ error: "Forbidden" });
      }

      const allowedTypes = ["cash", "membership", "token"];
      const reward_type = String(body.reward_type || "cash").toLowerCase();
      if (!allowedTypes.includes(reward_type)) {
        return response.status(400).json({ error: "Invalid reward type" });
      }

      const pointsRaw = body.reward_points ?? 0;
      const reward_points = Number(pointsRaw);
      if (Number.isNaN(reward_points) || reward_points < 0) {
        return response.status(400).json({ error: "Invalid reward points" });
      }

      // Validate product and email
      const product_id = String(body.product_id || "");
      const email = String(body.email || "").trim();
      if (!product_id) {
        return response.status(400).json({ error: "product_id is required" });
      }
      if (!email) {
        return response.status(400).json({ error: "email is required" });
      }
      const product = await DB.table("products").where("id", product_id).first();
      if (!product) {
        return response.status(404).json({ error: "Product not found" });
      }

      const now = Date.now();
      const reward = {
        id: randomUUID(),
        social_post_id: post.id,
        user_id: post.user_id,
        product_id,
        email,
        reward_type,
        reward_points,
        notes: body.notes || null,
        granted_at: now,
        created_at: now,
        updated_at: now,
      };

      await DB.table("social_post_rewards").insert(reward);

      return response.json({ ok: true, reward });
    } catch (error) {
      console.error("Error granting reward:", error);
      return response.status(500).json({ error: "Internal server error" });
    }
  }
  // Admin/User: manual metrics input
  public async metricsStore(request: Request, response: Response) {
    try {
      const { id } = request.params as any;
      const body = await request.json();

      const allowedKeys = [
        "likes_count",
        "comments_count",
        "shares_count",
        "views_count",
        "bookmarks_count",
      ];

      const payload: any = {};
      for (const key of allowedKeys) {
        if (body[key] !== undefined) {
          const val = Number(body[key]);
          if (Number.isNaN(val) || val < 0) {
            return response.status(400).json({ error: `Invalid value for ${key}` });
          }
          payload[key] = val;
        }
      }

      if (Object.keys(payload).length === 0) {
        return response.status(400).json({ error: "No metrics provided" });
      }

      // Ensure post exists
      const post = await DB.from("social_posts").where("id", id).first();
      if (!post) return response.status(404).json({ error: "Social post not found" });

      // Only owner or admin can update metrics manually
      const user = request.user;
      if (!user) return response.status(401).json({ error: "Unauthorized" });
      if (!user.is_admin && user.id !== post.user_id) {
        return response.status(403).json({ error: "Forbidden" });
      }

      const { default: SocialMetricsService } = await import("../services/SocialMetricsService");
      const aggregate = await SocialMetricsService.snapshot(id, payload, "manual");

      return response.json({ ok: true, aggregate });
    } catch (error) {
      console.error("Error storing metrics:", error);
      return response.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new SocialPostController();