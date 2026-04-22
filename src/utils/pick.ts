export const pick = <T extends object, K extends keyof T>(source: T, keys: readonly K[]) =>
  keys.reduce((result, key) => {
    if (source[key] !== undefined) result[key] = source[key];
    return result;
  }, {} as Partial<Pick<T, K>>);
