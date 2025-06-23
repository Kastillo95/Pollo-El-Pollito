export function calculateAge(entryDate: Date | string): number {
  const entry = typeof entryDate === 'string' ? new Date(entryDate) : entryDate;
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - entry.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function getAgeCategory(days: number): 'young' | 'medium' | 'old' {
  if (days <= 21) return 'young';
  if (days <= 35) return 'medium';
  return 'old';
}

export function formatAge(days: number): string {
  if (days === 1) return '1 día';
  return `${days} días`;
}
