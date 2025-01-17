/**
 * Generates a salt for the BIP39 mnemonic.
 * @param password - The password to use for the salt.
 * @returns The generated salt.
 */
export function salt(password: string): string {
    return 'mnemonic' + (password || '');
}