export function formatIsoDate(value: string | undefined): string {
  if (!value) return '';
  try {
    const d = new Date(value);
    return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(d);
  } catch {
    return value;
  }
}
