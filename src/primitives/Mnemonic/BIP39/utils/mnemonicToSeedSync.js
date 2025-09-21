import { pbkdf2 } from '@scintilla-network/hashes/utils';
import { sha512 } from '@scintilla-network/hashes/classic';
import { normalize } from './normalize.js';
import { salt } from './salt.js';

/**
 * Synchronously converts a BIP39 mnemonic phrase to a seed using PBKDF2.
 * @param {string} mnemonic - The mnemonic phrase to convert
 * @param {string} [password=''] - Optional password for additional security
 * @returns {Uint8Array} The derived seed as a byte array
 * @description
 * This function implements the BIP39 seed generation process:
 * 1. Normalizes the mnemonic and password using NFKD
 * 2. Creates a salt from the normalized password
 * 3. Uses PBKDF2-HMAC-SHA512 with 2048 iterations to derive a 64-byte seed
 * @example
 * const seed = mnemonicToSeedSync('abandon abandon abandon', 'TREZOR');
 * // Returns seed as Uint8Array
 */
export function mnemonicToSeedSync(mnemonic, password = '') {
    const encoder = new TextEncoder();
    const mnemonicBuffer = encoder.encode(normalize(mnemonic));
    const saltBuffer = encoder.encode(salt(normalize(password)));
    const hashFunction = sha512;

    return pbkdf2(hashFunction, mnemonicBuffer, saltBuffer, {
        c: 2048,
        dkLen: 64,
    });
}
