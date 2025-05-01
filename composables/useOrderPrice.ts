export function useOrderPrice(price_type: 'contract' | 'fixed', price: number): string | number {
    return price_type == "fixed" ? price + ' руб.' : 'Договорная'
}