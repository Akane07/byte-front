import { baseURL } from "../api";

export function makeURL(url: string | undefined) {
    return baseURL + url;
}

export function generatePagination(current: number, total: number): (number | string)[] {
    const pages: (number | string)[] = [];

    if (total <= 6) {
        for (let i = 1; i <= total; i++) {
            pages.push(i);
        }
        return pages;
    }

    if (current >= total - 2) {
        for (let i = total - 3; i <= total; i++) {
            if (i > 0) pages.push(i);
        }
        return pages;
    }

    const start = Math.max(1, current - 1);
    const mid = Math.min(current + 1, total - 2);

    for (let i = start; i <= mid; i++) {
        pages.push(i);
    }

    if (mid < total - 2) {
        pages.push('...');
    }

    pages.push(total - 1);
    pages.push(total);

    return pages;
}