// Preserve dots inside dates, email addresses and URLs.
export function withoutSentenceStops(text: string) {
  return text.replace(/。|\.(?=\s|$)/g, "");
}
