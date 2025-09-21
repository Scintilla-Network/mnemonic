import { lpad } from './lpad.js';

/**
 * Converts a byte array to a binary string.
 * @param {number[]} bytes - The array of bytes (numbers between 0-255) to convert.
 * @returns {string} A binary string representation where each byte is represented by 8 bits.
 * @example
 * bytesToBinary([255, 0, 128]) // returns "111111110000000010000000"
 * bytesToBinary([1, 2]) // returns "0000000100000010"
 * @description
 * This function takes an array of bytes and converts each byte to its 8-bit binary representation.
 * Each byte is padded with leading zeros if necessary to ensure it's 8 bits long.
 * The resulting binary strings are concatenated together into a single string.
 */
export function bytesToBinary(bytes) {
    return bytes.map((x) => lpad(x.toString(2), '0', 8)).join('');
}