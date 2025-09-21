/**
 * Left pads a string with a given string until it reaches a specified length.
 * @param {string} str - The string to pad.
 * @param {string} padString - The string to use for padding.
 * @param {number} length - The desired length of the resulting string.
 * @returns {string} The padded string.
 * @example
 * lpad('123', '0', 5) // returns "00123"
 * lpad('abc', 'x', 6) // returns "xxxabc"
 * @description
 * This function repeatedly prepends the padding string to the input string
 * until it reaches the desired length. If the input string is already longer
 * than the specified length, it is returned unchanged.
 */
export function lpad(str, padString, length) {
    while (str.length < length) {
        str = padString + str;
    }
    return str;
}
