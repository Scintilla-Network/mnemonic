/**
 * Generates a salt for the BIP39 mnemonic seed generation.
 * @param {string} [password=''] - Optional password to append to the salt
 * @returns {string} The generated salt string prefixed with 'mnemonic'
 * @description
 * This function implements the BIP39 salt generation:
 * - Prepends 'mnemonic' to the password
 * - Handles empty/undefined password by using empty string
 * @example
 * salt('mypass') // returns 'mnemonicmypass'
 * salt() // returns 'mnemonic'
 */
export function salt(password) {
    return 'mnemonic' + (password || '');
}