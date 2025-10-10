"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RewardService {
    constructor() {
        this.thresholds = [
            { min: 100, type: "token", points: 50 },
            { min: 300, type: "token", points: 150 },
            { min: 600, type: "membership", points: 0, notes: "Gold membership" },
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
        return null;
    }
}
exports.default = new RewardService();
//# sourceMappingURL=RewardService.js.map