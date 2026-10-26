export function positiveInteger(value) {
  const text = String(value).trim();
  if (!/^\d+$/.test(text)) return null;
  const number = Number(text);
  return Number.isSafeInteger(number) && number >= 1 ? number : null;
}

// Integer arithmetic avoids rounding at the safe-integer boundary.
export const suggestedLimit = current => current - Math.floor(current / 4);
export const warningThreshold = limit => limit - Math.floor(limit / 3);
export const visualBand = (count, limit) => count > limit ? 'over' : count >= warningThreshold(limit) ? 'near' : 'steady';
export const circleFill = (count, limit) => Math.min(1, Math.max(0, count / limit));
export function adjustCount(count, delta) {
  return Math.min(Number.MAX_SAFE_INTEGER, Math.max(0, count + delta));
}
