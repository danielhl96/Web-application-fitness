/** Converts decimal min/km to "mm:ss /km" display string. */
export function formatPace(minPerKm: number): string {
  if (!minPerKm || minPerKm <= 0) return '–';
  const mins = Math.floor(minPerKm);
  const secs = Math.round((minPerKm - mins) * 60);
  return `${mins}:${secs.toString().padStart(2, '0')} /km`;
}

/** Converts total minutes to "Xh Ymin" or "Y min". */
export function formatDuration(totalMin: number): string {
  if (!totalMin) return '–';
  const h = Math.floor(totalMin / 60);
  const m = Math.round(totalMin % 60);
  return h > 0 ? `${h}h ${m}min` : `${m} min`;
}

/** Formats an ISO date string to "DD.MM.YYYY, HH:mm". */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '–';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();

  return `${day}.${month}.${year} `;
}
