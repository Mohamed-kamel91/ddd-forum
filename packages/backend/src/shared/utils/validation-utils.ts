export function getMissingKeys(
  data: any,
  keysToCheckFor: string[],
): string[] {
  return keysToCheckFor.filter((key) => data[key] === undefined);
}

export const isObject = <T extends Record<string, any>>(
  val: any,
): val is T => {
  return (
    val !== null && typeof val === 'object' && !Array.isArray(val)
  );
};

export const isMissingKeys = (
  data: any,
  keysToCheckFor: string[],
) => {
  for (let key of keysToCheckFor) {
    if (data[key] === undefined) return true;
  }
  return false;
};

export function isBetweenLength(
  str: string,
  min: number,
  max: number,
) {
  return str.length >= min && str.length <= max;
}
