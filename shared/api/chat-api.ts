import { api, call, getApiOrigin } from ".";
import type { ChatHistoryPage, ChatPreview, MediaType } from "../types";

export const HISTORY_PAGE_SIZE = 50;

/** Ответ POST /upload: где лежит файл и как его показать в чате. */
export interface UploadedFile {
  url: string;
  mimetype: string;
  mediaType: Exclude<MediaType, "none">;
  name: string;
  size: number;
}

export function getChats() {
  return call(api.get<ChatPreview[]>("/chat/all"));
}

export function getUnread() {
  return call(
    api.get<{ total: number; byUser: Record<string, number> }>("/chat/unread", { silent: true }),
  );
}

/** Страница истории: последние сообщения или те, что раньше before. */
export function getHistory(userId: string, before?: string) {
  return call(
    api.get<ChatHistoryPage>("/chat", {
      params: { user: userId, before, limit: HISTORY_PAGE_SIZE },
    }),
  );
}

export function uploadChatFile(file: File) {
  const form = new FormData();
  form.append("file", file);
  // Видео и архивы до 50 МБ за 10 секунд общего таймаута не успевают.
  return call(api.post<UploadedFile>("/upload", form, { timeout: 5 * 60_000 }));
}

/** Ссылка на скачивание вложения под его исходным именем. */
export function downloadUrl(mediaUrl: string, name?: string) {
  const file = mediaUrl.split("/").pop() ?? "";
  const query = name ? `?name=${encodeURIComponent(name)}` : "";
  return `${getApiOrigin()}/api/v1/files/${file}${query}`;
}
