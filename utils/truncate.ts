export function truncate(text: string, maxLength = 2000): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '…';
}
