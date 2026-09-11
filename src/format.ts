/** ₹1,800,000 -> "₹18L". Indian lakh notation, trailing .0 trimmed. */
export function formatSalary(min: number, max: number): string {
  const lakh = (value: number) => {
    const inLakhs = value / 100000;
    // Decide precision on the *rounded* value, so 99.99L does not render as
    // "100.0" through the one-decimal branch and disagree with a true 100L.
    const text =
      inLakhs >= 99.95 ? String(Math.round(inLakhs)) : inLakhs.toFixed(1).replace(/\.0$/, '');
    return `₹${text}L`;
  };
  // A degenerate band should read as a single figure, not "₹18L – ₹18L".
  return min === max ? lakh(min) : `${lakh(min)} – ${lakh(max)}`;
}

export function formatPostedDate(iso: string): string {
  const posted = new Date(iso);
  const days = Math.floor((Date.now() - posted.getTime()) / 86400000);
  if (days <= 0) return 'Posted today';
  if (days === 1) return 'Posted yesterday';
  if (days < 30) return `Posted ${days} days ago`;
  const months = Math.floor(days / 30);
  return `Posted ${months} month${months > 1 ? 's' : ''} ago`;
}

/** "full-time" -> "Full-time", "entry" -> "Entry" */
export function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
