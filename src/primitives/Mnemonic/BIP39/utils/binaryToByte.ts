/**
 * Converts a binary string to a byte array.
 * @param bin - The binary string to convert.
 * @returns The byte array.
 */
export function binaryToByte(bin: string): number {
    return parseInt(bin, 2);
}