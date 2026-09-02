/**
 * Deep merge, with one deliberate rule: arrays replace rather than merge.
 *
 * The site's arrays are ordered content — posts, plans, FAQ entries — where
 * position carries meaning and an element-wise merge would be nonsense. When
 * the studio reorders the pricing plans, the override is the new order, whole.
 */

/** A partial of `T` all the way down, except arrays, which are all-or-nothing. */
export type DeepPartial<T> = T extends readonly unknown[]
  ? T
  : T extends object
    ? { readonly [K in keyof T]?: DeepPartial<T[K]> }
    : T;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Returns `base` with `override` laid over it.
 *
 * `undefined` in the override means "not set", not "clear this" — an override
 * row only ever carries what was actually changed, so an absent key is the
 * common case and must fall through to the default.
 */
export function deepMerge<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) return base;
  if (Array.isArray(override)) return override as T;

  if (isPlainObject(base) && isPlainObject(override)) {
    const merged: Record<string, unknown> = { ...base };
    for (const [key, value] of Object.entries(override)) {
      merged[key] = key in base ? deepMerge((base as Record<string, unknown>)[key], value) : value;
    }
    return merged as T;
  }

  return override as T;
}
