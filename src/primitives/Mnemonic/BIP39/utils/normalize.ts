/**
 * Normalizes a string to its canonical form using Unicode normalization.
 * @param str - The string to normalize.
 * @returns The normalized string.
 */
export function normalize(str: string): string {
    return (str || '').normalize('NFKD');
}