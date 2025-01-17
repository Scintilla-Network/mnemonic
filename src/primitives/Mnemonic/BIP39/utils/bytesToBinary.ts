
import { lpad } from './lpad.js';

/**
 * Converts a byte array to a binary string.
 * @param bytes - The byte array to convert.
 * @returns The binary string.
 */
export function bytesToBinary(bytes: number[]): string {
    return bytes.map((x) => lpad(x.toString(2), '0', 8)).join('');
}