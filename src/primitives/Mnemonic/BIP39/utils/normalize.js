/**
 * Normalizes a string to its canonical form using Unicode normalization.
 * @param {string} str - The string to normalize
 * @returns {string} The normalized string in NFKD form
 * @description
 * This function performs Unicode normalization using NFKD form:
 * - Decomposes characters into their constituent parts
 * - Handles compatibility equivalence (K)
 * - Returns empty string if input is null/undefined
 * @example
 * normalize('héllo') // returns 'hello' with decomposed 'e' and accent
 * normalize(null) // returns ''
 */
export function normalize(str) {
    return (str || '').normalize('NFKD');
}