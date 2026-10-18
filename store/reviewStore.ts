import { createReview, getPendingReviews, type PendingReview } from "~/shared/api/review-api";
import { useNotifications } from "~/store/notiStore";
import { useUserStore } from "~/store/userStore";

/**
 * Отзывы, которые ждут оценки пользователя. Нужны в нескольких местах:
 * в диалоге с собеседником, в «Моих заказах» и в счётчике на вкладке.
 */
export const useReviewStore = defineStore("review", () => {
  const notifications = useNotifications();
  const userStore = useUserStore();

  const pending = ref<PendingReview[]>([]);
  /** Заказ, по которому сейчас открыто окно отзыва. */
  const target = ref<PendingReview | null>(null);

  async function loadPending() {
    pending.value = userStore.isAuth ? ((await getPendingReviews()) ?? []) : [];
  }

  function pendingWith(partnerId: string) {
    return pending.value.filter((p) => p.partner?.id === partnerId);
  }

  function open(item: PendingReview) {
    target.value = item;
  }

  async function submit(rating: number, text: string) {
    const item = target.value;
    if (!item) return false;
    const review = await createReview(item.order.id, rating, text);
    if (!review) return false;

    pending.value = pending.value.filter((p) => p.order.id !== item.order.id);
    target.value = null;
    // Пока вторая сторона не оценила, отзыв скрыт — объясняем, чтобы его не искали.
    notifications.setNotification(
      review.published
        ? "Спасибо! Отзывы опубликованы в профилях"
        : "Спасибо! Отзыв откроется, когда собеседник тоже оценит сотрудничество, или через 14 дней",
    );
    return true;
  }

  return { pending, target, loadPending, pendingWith, open, submit };
});
