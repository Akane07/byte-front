export function useOrderPrice(price_type: "contract" | "fixed" | "hourly", price: number | { from: number; to: number; }): string {
    if (price_type === 'fixed') {
        return price + ' руб.';
    } else if (price_type === 'hourly' && typeof price === 'object') {
        return `${price.from} - ${price.to} руб/час`;
    } else {
        return 'Договорная';
    }
}