/**
 * Left pads a string with a given string until it reaches a specified length.
 * @param str - The string to pad.
 * @param padString - The string to use for padding.
 * @param length - The desired length of the resulting string.
 * @returns The padded string.
 */
export function lpad(str: string, padString: string, length: number): string {
    while (str.length < length) {
        str = padString + str;
    }
    return str;
}

