"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = __importDefault(require("../services/DB"));
const crypto_1 = require("crypto");
const ALLOWED_PLATFORMS = ["facebook", "instagram", "x", "tiktok", "youtube"];
class SocialPostController {
    async index(request, response) {
        try {
            const user = request.user;
            if (!user)
                return response.status(401).json({ error: "Unauthorized" });
            const posts = await DB_1.default.from("social_posts")
                .select(["social_posts.*"])
                .where("social_posts.user_id", user.id)
                .orderBy("social_posts.created_at", "desc");
            return response.inertia("social-posts/index", { posts });
        }
        catch (error) {
            console.error("Error listing social posts:", error);
            return response.status(500).json({ error: "Internal server error" });
        }
    }
    async create(request, response) {
        try {
            const contents = await DB_1.default.from("contents")
                .select(["id", "title"])
                .orderBy("created_at", "desc");
            return response.inertia("social-posts/create", { contents, platforms: ALLOWED_PLATFORMS });
        }
        catch (error) {
            console.error("Error loading create form:", error);
            return response.status(500).json({ error: "Internal server error" });
        }
    }
    async store(request, response) {
        try {
            const user = request.user;
            if (!user)
                return response.status(401).json({ error: "Unauthorized" });
            const { title, platform, post_url, external_post_id, } = await request.json();
            if (!title || String(title).trim().length === 0) {
                return response.status(400).json({ error: "Title is required" });
            }
            if (!platform || !ALLOWED_PLATFORMS.includes(String(platform).toLowerCase())) {
                return response.status(400).json({ error: "Invalid platform" });
            }
            if (!post_url || !/^https?:\/\//i.test(post_url)) {
                return response.status(400).json({ error: "Invalid post URL" });
            }
            const id = (0, crypto_1.randomUUID)();
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
            await DB_1.default.table("social_posts").insert(data);
            return response.redirect("/social-posts");
        }
        catch (error) {
            console.error("Error storing social post:", error);
            return response.status(500).json({ error: "Internal server error" });
        }
    }
    async show(request, response) {
        try {
            const user = request.user;
            if (!user)
                return response.status(401).json({ error: "Unauthorized" });
            const { id } = request.params;
            const post = await DB_1.default.from("social_posts")
                .select([
                "social_posts.*",
                "users.name as user_name",
            ])
                .leftJoin("users", "social_posts.user_id", "users.id")
                .where("social_posts.id", id)
                .first();
            if (!post)
                return response.status(404).json({ error: "Social post not found" });
            if (post.user_id !== user.id)
                return response.status(403).json({ error: "Forbidden" });
            const metrics = await DB_1.default.from("social_post_metrics")
                .where("social_post_id", id)
                .orderBy("captured_at", "desc");
            return response.inertia("social-posts/show", { post, history: metrics });
        }
        catch (error) {
            console.error("Error fetching social post:", error);
            return response.status(500).json({ error: "Internal server error" });
        }
    }
    async adminIndex(request, response) {
        try {
            const { platform, status } = request.query;
            let query = DB_1.default.from("social_posts")
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
        }
        catch (error) {
            console.error("Error listing admin social posts:", error);
            return response.status(500).json({ error: "Internal server error" });
        }
    }
    async verify(request, response) {
        try {
            const { id } = request.params;
            const { action, notes } = await request.json();
            const now = Date.now();
            if (!["verified", "rejected"].includes(action)) {
                return response.status(400).json({ error: "Invalid action" });
            }
            const is_verified = action === "verified";
            await DB_1.default.table("social_posts")
                .where("id", id)
                .update({
                status: action,
                is_verified,
                verification_notes: notes || null,
                updated_at: now,
            });
            if (is_verified) {
                const post = await DB_1.default.from("social_posts").where("id", id).first();
                if (post) {
                    const { default: RewardService } = await Promise.resolve().then(() => __importStar(require("../services/RewardService")));
                    await RewardService.evaluateAndGrant({
                        id: post.id,
                        user_id: post.user_id,
                        engagement_score: post.engagement_score || 0,
                    });
                }
            }
            return response.redirect("/admin/social-posts");
        }
        catch (error) {
            console.error("Error verifying social post:", error);
            return response.status(500).json({ error: "Internal server error" });
        }
    }
    async adminShow(request, response) {
        try {
            const { id } = request.params;
            const post = await DB_1.default.from("social_posts")
                .select([
                "social_posts.*",
                "users.name as user_name",
            ])
                .leftJoin("users", "social_posts.user_id", "users.id")
                .where("social_posts.id", id)
                .first();
            if (!post)
                return response.status(404).json({ error: "Social post not found" });
            const metrics = await DB_1.default.from("social_post_metrics")
                .where("social_post_id", id)
                .orderBy("captured_at", "desc");
            return response.inertia("admin/social-posts/show", { post, metrics });
        }
        catch (error) {
            console.error("Error fetching admin social post:", error);
            return response.status(500).json({ error: "Internal server error" });
        }
    }
    async metricsStore(request, response) {
        try {
            const { id } = request.params;
            const body = await request.json();
            const allowedKeys = [
                "likes_count",
                "comments_count",
                "shares_count",
                "views_count",
                "bookmarks_count",
            ];
            const payload = {};
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
            const post = await DB_1.default.from("social_posts").where("id", id).first();
            if (!post)
                return response.status(404).json({ error: "Social post not found" });
            const user = request.user;
            if (!user)
                return response.status(401).json({ error: "Unauthorized" });
            if (!user.is_admin && user.id !== post.user_id) {
                return response.status(403).json({ error: "Forbidden" });
            }
            const { default: SocialMetricsService } = await Promise.resolve().then(() => __importStar(require("../services/SocialMetricsService")));
            const aggregate = await SocialMetricsService.snapshot(id, payload, "manual");
            return response.json({ ok: true, aggregate });
        }
        catch (error) {
            console.error("Error storing metrics:", error);
            return response.status(500).json({ error: "Internal server error" });
        }
    }
}
exports.default = new SocialPostController();
//# sourceMappingURL=SocialPostController.js.map