"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = __importDefault(require("./DB"));
class RewardService {
    constructor() {
        this.thresholds = [
            { min: 100, type: "points", points: 50 },
            { min: 300, type: "points", points: 150 },
            { min: 600, type: "badge", points: 0, notes: "Gold badge" },
        ];
    }
    pickThreshold(score) {
        let picked = null;
        for (const t of this.thresholds) {
            if (score >= t.min)
                picked = t;
        }
        return picked;
    }
    async evaluateAndGrant(post) {
        const threshold = this.pickThreshold(Number(post.engagement_score || 0));
        if (!threshold)
            return null;
        const now = Date.now();
        const existing = await DB_1.default.from("social_post_rewards")
            .where({
            social_post_id: post.id,
            user_id: post.user_id,
            reward_type: threshold.type,
            reward_points: threshold.points,
        })
            .first();
        if (existing)
            return existing;
        const reward = {
            id: crypto.randomUUID(),
            social_post_id: post.id,
            user_id: post.user_id,
            reward_type: threshold.type,
            reward_points: threshold.points,
            reward_status: "granted",
            notes: threshold.notes || null,
            granted_at: now,
            created_at: now,
            updated_at: now,
        };
        await DB_1.default.table("social_post_rewards").insert(reward);
        return reward;
    }
}
exports.default = new RewardService();
//# sourceMappingURL=RewardService.js.map