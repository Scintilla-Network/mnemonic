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
     */
    constructor(mnemonic, wordlistLanguage = 'EN', bytes = 256) {
        if (!mnemonic) {
            mnemonic = Mnemonic.generateMnemonic(bytes, wordlistLanguage);
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
     * @returns {Uint8Array} The derived seed
     */
    toSeed(password = '') {
        return mnemonicToSeedSync(this.phrase, password);
    }
}

export default Mnemonic;
export * as types from "./types.js";
