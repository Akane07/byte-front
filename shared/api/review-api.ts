import { api, call } from ".";

/** В какой роли оценивали пользователя. */
export type ReviewRole = "performer" | "customer";

export interface ReviewAuthor {
  id: string;
  name: string;
  nickname?: string;
  avatar?: string;
}

export interface Review {
  id: string;
  order_id: string;
  author_id: string;
  target_id: string;
  target_role: ReviewRole;
  rating: number;
  text: string;
  reply?: { text: string; created_at: string };
  published: boolean;
  published_at?: string;
  created_at: string;
}

/** Отзыв в ленте профиля — с автором и заказом. */
export interface ReviewWithContext extends Review {
  author: ReviewAuthor | null;
  order: { id: string; title: string };
}

export interface ReviewPage {
  reviews: ReviewWithContext[];
  totalPages: number;
  currentPage: number;
}

export interface RatingStats {
  average: number;
  count: number;
  /** Сколько оценок каждого балла: { 1: 0, …, 5: 12 }. */
  distribution: Record<number, number>;
}

export interface ReviewSummary {
  performer: RatingStats;
  customer: RatingStats;
  completedAsPerformer: number;
}

/** Завершённый заказ, по которому можно оставить отзыв. */
export interface PendingReview {
  order: { id: string; title: string; completed_at: string };
  /** Роль того, кого предстоит оценить. */
  role: ReviewRole;
  partner: ReviewAuthor | null;
  /** До какого момента можно оставить отзыв. */
  deadline: string;
}

export function createReview(orderId: string, rating: number, text: string) {
  return call(api.post<Review>("/reviews", { orderId, rating, text }));
}

export function replyToReview(reviewId: string, text: string) {
  return call(api.post<Review>(`/reviews/${reviewId}/reply`, { text }));
}

export function getPendingReviews() {
  return call(api.get<PendingReview[]>("/reviews/pending", { silent: true }));
}

export function getUserReviews(userId: string, role: ReviewRole, page = 1) {
  return call(api.get<ReviewPage>(`/reviews/user/${userId}`, { params: { role, page } }));
}

export function getReviewSummary(userId: string) {
  return call(api.get<ReviewSummary>(`/reviews/user/${userId}/summary`));
}
