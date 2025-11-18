export type RuleFn = (v: string) => boolean;

export const rules = {
    notEmpty: (v: string) => v.length > 0,
    notZero: (v: string | number) => {
        return typeof v === 'string' ? (Number(v) > 0 && !isNaN(Number(v))) : (v > 0)
    }
}