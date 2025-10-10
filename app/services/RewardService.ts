import DB from "./DB";

type SocialPost = {
  id: string;
  user_id: string;
  engagement_score: number;
};

type Threshold = {
  min: number;
  type: string; // points, voucher, cash, badge
  points: number;
  notes?: string;
};

class RewardService {
  private thresholds: Threshold[] = [
    { min: 100, type: "points", points: 50 },
    { min: 300, type: "points", points: 150 },
    { min: 600, type: "badge", points: 0, notes: "Gold badge" },
  ];

  private pickThreshold(score: number): Threshold | null {
    let picked: Threshold | null = null;
    for (const t of this.thresholds) {
      if (score >= t.min) picked = t; // thresholds ascending; take the highest satisfied
    }
    return picked;
  }

  // Ensure idempotency: one reward per (post, type, points)
  public async evaluateAndGrant(post: SocialPost) {
    const threshold = this.pickThreshold(Number(post.engagement_score || 0));
    if (!threshold) return null;

    const now = Date.now();

    // Check existing reward for this post & threshold
    const existing = await DB.from("social_post_rewards")
      .where({
        social_post_id: post.id,
        user_id: post.user_id,
        reward_type: threshold.type,
        reward_points: threshold.points,
      })
      .first();

    if (existing) return existing; // idempotent

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

    await DB.table("social_post_rewards").insert(reward);
    return reward;
  }
}

export default new RewardService();