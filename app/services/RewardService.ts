import DB from "./DB";

type SocialPost = {
  id: string;
  user_id: string;
  engagement_score: number;
};

type Threshold = {
  min: number;
  type: string; // cash, membership, token
  points: number;
  notes?: string;
};

class RewardService {
  private thresholds: Threshold[] = [
    { min: 100, type: "token", points: 50 },
    { min: 300, type: "token", points: 150 },
    { min: 600, type: "membership", points: 0, notes: "Gold membership" },
  ];

  private pickThreshold(score: number): Threshold | null {
    let picked: Threshold | null = null;
    for (const t of this.thresholds) {
      if (score >= t.min) picked = t; // thresholds ascending; take the highest satisfied
    }
    return picked;
  }

  // Manual grant via admin UI is required for product/email mapping
  public async evaluateAndGrant(post: SocialPost) {
    const threshold = this.pickThreshold(Number(post.engagement_score || 0));
    if (!threshold) return null;
    // No automatic insert due to required product_id and email on rewards
    return null;
  }
}

export default new RewardService();