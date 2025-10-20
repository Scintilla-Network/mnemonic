/**
 * @fileoverview Mnemonic class implementation for BIP39 mnemonic phrases
 */

import { generateMnemonic, mnemonicToSeedSync, validateMnemonic, wordlists } from "./BIP39/BIP39.js";
import "./types.js";

/**
 * @typedef {import('./BIP39/BIP39.js').WordListLanguage} WordListLanguage
 * @typedef {import('./BIP39/BIP39.js').RngFunction} RngFunction
 * @typedef {import('./types.js').IMnemonic} IMnemonic
 */

/**
 * Mnemonic class for handling BIP39 mnemonic phrases
 * @implements {IMnemonic}
 */
class Mnemonic {
    /**
     * @readonly
     * @type {string}
     */
    phrase;

    /**
     * Creates a new Mnemonic instance
     * @param {string} mnemonic - The mnemonic phrase (if empty, generates a new one)
     * @param {WordListLanguage} [wordlistLanguage='EN'] - Language for wordlist
     * @param {number} [bytes=256] - Entropy bytes for generation (if mnemonic is empty)
     * @param {boolean} [skipValidation=false] - Skip validation of mnemonic
     */
    constructor(mnemonic, wordlistLanguage = 'EN', bytes = 256, skipValidation = false) {
        if (!mnemonic) {
            mnemonic = Mnemonic.generateMnemonic(bytes, wordlistLanguage);
        }
        if (!skipValidation && !Mnemonic.validate(mnemonic, wordlistLanguage)) {
            throw new Error('Invalid mnemonic');
        }
        this.phrase = mnemonic;
    }

    /**
     * Validates a mnemonic phrase
     * @param {string} mnemonic - The mnemonic phrase to validate
     * @param {WordListLanguage} [wordlistLanguage='EN'] - Language for wordlist
     * @returns {boolean} True if mnemonic is valid
     */
    static validate(mnemonic, wordlistLanguage = 'EN') {
        return validateMnemonic(mnemonic, wordlists[wordlistLanguage]);
    }

    /**
     * Generates a new mnemonic phrase
     * @param {number} [bytes=256] - Entropy bytes (128, 160, 192, 224, 256)
     * @param {WordListLanguage} [wordlistLanguage='EN'] - Language for wordlist
     * @param {RngFunction} [rng] - Custom random number generator
     * @returns {string} The generated mnemonic phrase
     */
    static generateMnemonic(bytes = 256, wordlistLanguage = 'EN', rng) {
        return generateMnemonic(bytes, rng, wordlists[wordlistLanguage]);
    }

    /**
     * Converts the mnemonic to a seed
     * @param {string} [password=''] - Optional password for seed derivation
     * @param {string} [encoding='uint8array'] - Encoding of the seed (uint8array, hex)
     * @returns {Uint8Array} The derived seed
     */
    toSeed(password = '', encoding = 'uint8array') {
        const seed = mnemonicToSeedSync(this.phrase, password);
        if (encoding === 'uint8array') {
            return seed;
        } else if (encoding === 'hex') {
            return Array.from(seed).map(b => b.toString(16).padStart(2, '0')).join('');
        }
        throw new Error('Invalid encoding');
    }
}

export default Mnemonic;
export * as types from "./types.js";
