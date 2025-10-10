import DB from "./DB";

type MetricsPayload = {
  likes_count?: number;
  comments_count?: number;
  shares_count?: number;
  views_count?: number;
  bookmarks_count?: number;
};

class SocialMetricsService {
  // Simple weighted engagement score calculator
  public computeScore(metrics: MetricsPayload): number {
    const likes = Number(metrics.likes_count || 0);
    const comments = Number(metrics.comments_count || 0);
    const shares = Number(metrics.shares_count || 0);
    const views = Number(metrics.views_count || 0);
    const bookmarks = Number(metrics.bookmarks_count || 0);

    // Weights can be externalized later via config
    const score = likes * 1 + comments * 2 + shares * 3 + views * 0.2 + bookmarks * 2.5;
    return Math.round(score);
  }

  // Create a snapshot and update aggregate on social_posts
  public async snapshot(social_post_id: string, payload: MetricsPayload, source: string = "manual") {
    const now = Date.now();

    const likes = Number(payload.likes_count || 0);
    const comments = Number(payload.comments_count || 0);
    const shares = Number(payload.shares_count || 0);
    const views = Number(payload.views_count || 0);
    const bookmarks = Number(payload.bookmarks_count || 0);

    const engagement_score = this.computeScore({ likes_count: likes, comments_count: comments, shares_count: shares, views_count: views, bookmarks_count: bookmarks });

    // Insert snapshot
    await DB.table("social_post_metrics").insert({
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

    // Update aggregate on social_posts
    await DB.table("social_posts")
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

export default new SocialMetricsService();