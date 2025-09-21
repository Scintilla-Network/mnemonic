/**
 * Converts a binary string to a byte number.
 * @param {string} bin - The binary string to convert (e.g. "00101010")
 * @returns {number} The byte value as a number between 0-255
 */
export function binaryToByte(bin) {
    return parseInt(bin, 2);
}