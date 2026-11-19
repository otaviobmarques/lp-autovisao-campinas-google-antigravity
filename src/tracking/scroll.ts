export const SCROLL_MARKS = [25, 50, 75, 90] as const;

export function scrollPercent(scrollY: number, scrollHeight: number, innerHeight: number): number {
  const max = scrollHeight - innerHeight;
  if (max <= 0) return 0;
  return Math.min(100, Math.max(0, (scrollY / max) * 100));
}

export function crossedScrollMarks(percent: number, seen: Set<number>): number[] {
  return SCROLL_MARKS.filter((mark) => percent >= mark && !seen.has(mark));
}
