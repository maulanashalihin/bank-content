"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = __importDefault(require("./DB"));
class SocialMetricsService {
    computeScore(metrics) {
        const likes = Number(metrics.likes_count || 0);
        const comments = Number(metrics.comments_count || 0);
        const shares = Number(metrics.shares_count || 0);
        const views = Number(metrics.views_count || 0);
        const bookmarks = Number(metrics.bookmarks_count || 0);
        const score = likes * 1 + comments * 2 + shares * 3 + views * 0.2 + bookmarks * 2.5;
        return Math.round(score);
    }
    async snapshot(social_post_id, payload, source = "manual") {
        const now = Date.now();
        const likes = Number(payload.likes_count || 0);
        const comments = Number(payload.comments_count || 0);
        const shares = Number(payload.shares_count || 0);
        const views = Number(payload.views_count || 0);
        const bookmarks = Number(payload.bookmarks_count || 0);
        const engagement_score = this.computeScore({ likes_count: likes, comments_count: comments, shares_count: shares, views_count: views, bookmarks_count: bookmarks });
        await DB_1.default.table("social_post_metrics").insert({
            id: crypto.randomUUID(),
            social_post_id,
            likes_count: likes,
            comments_count: comments,
            shares_count: shares,
            views_count: views,
            bookmarks_count: bookmarks,
            engagement_score,
            source,
            captured_at: now,
            created_at: now,
            updated_at: now,
        });
        await DB_1.default.table("social_posts")
            .where("id", social_post_id)
            .update({
            likes_count: likes,
            comments_count: comments,
            shares_count: shares,
            views_count: views,
            bookmarks_count: bookmarks,
            engagement_score,
            last_synced_at: now,
            updated_at: now,
        });
        return {
            likes_count: likes,
            comments_count: comments,
            shares_count: shares,
            views_count: views,
            bookmarks_count: bookmarks,
            engagement_score,
            last_synced_at: now,
        };
    }
}
exports.default = new SocialMetricsService();
//# sourceMappingURL=SocialMetricsService.js.map