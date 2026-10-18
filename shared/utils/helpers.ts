import { getApiOrigin } from "../api";

/** Полный адрес файла с бэкенда по пути вида /uploads/... */
export function makeURL(path: string | undefined | null): string {
  if (!path) return "";
  if (/^(https?:|blob:|data:)/.test(path)) return path;
  return getApiOrigin() + path;
}

/**
 * Выбор словоформы для числа: plural(5, "проект", "проекта", "проектов").
 * Учитывает исключения 11–14: «11 проектов», «21 проект», «22 проекта».
 */
export function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

/** Номера страниц для пагинации, «...» — пропуск. */
export function generatePagination(current: number, total: number): (number | string)[] {
  const pages: (number | string)[] = [];

  if (total <= 6) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }

  if (current >= total - 2) {
    for (let i = total - 3; i <= total; i++) pages.push(i);
    return pages;
  }

  const start = Math.max(1, current - 1);
  const mid = Math.min(current + 1, total - 2);

  for (let i = start; i <= mid; i++) pages.push(i);
  if (mid < total - 2) pages.push("...");
  pages.push(total - 1, total);

  return pages;
}

/** Время сообщения в формате ЧЧ:ММ. */
export function parseMessageDate(created: string): string {
  return new Date(created).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function scrollToBottom(container: HTMLElement | null) {
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

/** Открыть внешнюю ссылку; без протокола подставляется https://. */
export function openExternal(link: string) {
  const url = /^https?:\/\//.test(link) ? link : `https://${link}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

/**
 * Скопировать текст в буфер обмена. navigator.clipboard есть только
 * в защищённом контексте (HTTPS или localhost) — на сайте по http://IP
 * его нет, поэтому запасной путь через скрытое поле и execCommand.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // пробуем запасной способ ниже
  }

  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  field.remove();
  return ok;
}

/**
 * Инициалы для заглушки аватара: «Алина Соколова» → «АС», «newbie» → «N».
 * Пустое имя — пустая строка (тогда показывается силуэт).
 */
export function avatarInitials(name?: string | null): string {
  const words = (name ?? "").trim().split(/[\s._-]+/).filter(Boolean);
  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

/**
 * «августа 2025» — для строки «На сайте с …». Полная дата с числом
 * не помещалась в колонку профиля и переносила «г.» на новую строку.
 */
export function memberSince(date: string | Date | undefined | null): string {
  if (!date) return "";
  const d = new Date(date);
  // Месяц в родительном падеже берём из формата «число + месяц».
  const month = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" })
    .formatToParts(d)
    .find((part) => part.type === "month")?.value;
  return `${month} ${d.getFullYear()}`;
}

/** Подпись дня для разделителя в чате: «Сегодня», «Вчера», «25 сентября», «3 марта 2025». */
export function messageDayLabel(created: string | Date): string {
  const date = new Date(created);
  const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((startOf(new Date()) - startOf(date)) / 86_400_000);
  if (days === 0) return "Сегодня";
  if (days === 1) return "Вчера";
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });
}

/** «820 Б», «1,4 МБ». */
export function formatFileSize(bytes: number | undefined): string {
  if (!bytes && bytes !== 0) return "";
  const units = ["Б", "КБ", "МБ", "ГБ"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  const digits = unit === 0 || value >= 10 ? 0 : 1;
  return `${value.toFixed(digits).replace(".", ",")} ${units[unit]}`;
}

export type TextPart = { text: string; href?: string };

const LINK_RE = /(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+)/gi;

/**
 * Разбивает текст сообщения на куски и ссылки. Шаблон рисует ссылки
 * тегом <a>, остальное — обычным текстом: v-html с пользовательским
 * текстом открыл бы дорогу XSS.
 */
export function splitLinks(text: string): TextPart[] {
  const parts: TextPart[] = [];
  let last = 0;
  for (const match of text.matchAll(LINK_RE)) {
    let link = match[0];
    // Знак препинания в конце — скорее часть предложения, чем ссылки.
    const trailing = link.match(/[.,!?;:)»]+$/)?.[0] ?? "";
    link = link.slice(0, link.length - trailing.length);
    const start = match.index ?? 0;
    if (start > last) parts.push({ text: text.slice(last, start) });
    parts.push({ text: link, href: link.startsWith("http") ? link : `https://${link}` });
    last = start + link.length;
  }
  if (last < text.length) parts.push({ text: text.slice(last) });
  return parts;
}

/** «в сети», «был(а) в сети 5 минут назад» — без угадывания рода по имени. */
export function presenceLabel(online: boolean, lastSeen?: string): string {
  if (online) return "в сети";
  if (!lastSeen) return "не в сети";
  const date = new Date(lastSeen);
  const minutes = Math.floor((Date.now() - date.getTime()) / 60_000);
  if (minutes < 1) return "был(а) в сети только что";
  if (minutes < 60) return `был(а) в сети ${minutes} ${plural(minutes, "минуту", "минуты", "минут")} назад`;
  const day = messageDayLabel(date);
  const time = parseMessageDate(date.toISOString());
  return day === "Сегодня" || day === "Вчера"
    ? `был(а) в сети ${day.toLowerCase()} в ${time}`
    : `был(а) в сети ${day}`;
}
