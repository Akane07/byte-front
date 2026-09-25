export type RuleFn = (v: string) => boolean;

export const rules = {
  notEmpty: (v: string) => String(v ?? "").trim().length > 0,
  notZero: (v: string | number) => {
    const n = Number(v);
    return !Number.isNaN(n) && n > 0;
  },
} satisfies Record<string, RuleFn | ((v: string | number) => boolean)>;
