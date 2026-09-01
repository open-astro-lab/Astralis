export function dayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / 86400000);
}

export function todayISO(date = new Date()) {
  return date.toISOString().slice(0, 10);
}
