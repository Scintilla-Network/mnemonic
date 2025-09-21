/**
 * @module BIP39
 * @description Implementation of the BIP39 mnemonic code specification
 */

import { randomBytes } from '@scintilla-network/hashes/utils';
import { _wordlists, DEFAULT_WORDLIST } from './_wordlists.js';
import { normalize } from './utils/normalize.js';
import { lpad } from './utils/lpad.js';
import { bytesToBinary } from './utils/bytesToBinary.js';
import { binaryToByte } from './utils/binaryToByte.js';
import { deriveChecksumBits } from './utils/deriveChecksumBits.js';
import { mnemonicToSeedSync } from './utils/mnemonicToSeedSync.js';
import { mnemonicToSeed } from './utils/mnemonicToSeed.js';

/**
 * @typedef {string[]} WordList
 * @description Array of 2048 words for mnemonic generation
 */

/**
 * @typedef {Object.<string, WordList>} Wordlists
 * @description Collection of wordlists indexed by language code
 */

/**
 * @typedef {'EN'|'JA'|'ES'|'FR'|'IT'|'ZH'|'KO'|'PT'|'RU'|'TR'} WordListLanguage
 * @description Supported wordlist language codes
 */

/**
 * @typedef {function(number): Uint8Array} RngFunction
 * @description Random number generator function
 */

/** @type {Wordlists} */
const wordlists = _wordlists;
/** @type {WordList} */
let _DEFAULT_WORDLIST = DEFAULT_WORDLIST;

const INVALID_MNEMONIC = 'Invalid mnemonic';
const INVALID_ENTROPY = 'Invalid entropy';
const INVALID_CHECKSUM = 'Invalid mnemonic checksum';
const WORDLIST_REQUIRED =
    'A wordlist is required but a default could not be found.\n' +
    'Please pass a 2048 word array explicitly.';

/**
 * Converts a mnemonic phrase back to its entropy value
 * @param {string} mnemonic - The mnemonic phrase to convert
 * @param {WordList} [wordlist] - Optional wordlist to use, defaults to English
 * @returns {string} The entropy value as a hex string
 * @throws {Error} If mnemonic is invalid or checksum fails
 */
function mnemonicToEntropy(mnemonic, wordlist) {
    wordlist = wordlist || _DEFAULT_WORDLIST;
    if (!wordlist) {
        throw new Error(WORDLIST_REQUIRED);
    }

    const words = normalize(mnemonic).split(' ');
    if (words.length % 3 !== 0) {
        throw new Error(INVALID_MNEMONIC);
    }

    const bits = words
        .map((word) => {
            const index = wordlist.indexOf(word);
            if (index === -1) {
                throw new Error(INVALID_MNEMONIC);
            }

            return lpad(index.toString(2), '0', 11);
        })
        .join('');

    const dividerIndex = Math.floor(bits.length / 33) * 32;
    const entropyBits = bits.slice(0, dividerIndex);
    const checksumBits = bits.slice(dividerIndex);

    const entropyBytes = entropyBits.match(/(.{1,8})/g).map(binaryToByte);
    if (entropyBytes.length < 16) {
        throw new Error(INVALID_ENTROPY);
    }
    if (entropyBytes.length > 32) {
        throw new Error(INVALID_ENTROPY);
    }
    if (entropyBytes.length % 4 !== 0) {
        throw new Error(INVALID_ENTROPY);
    }

    const entropy = new Uint8Array(entropyBytes);
    const newChecksum = deriveChecksumBits(entropy);
    if (newChecksum !== checksumBits) {
        throw new Error(INVALID_CHECKSUM);
    }

    return Array.from(entropy).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Converts an entropy value to a mnemonic phrase
 * @param {(Uint8Array|string)} entropy - The entropy value as bytes or hex string
 * @param {WordList} [wordlist] - Optional wordlist to use, defaults to English
 * @returns {string} The generated mnemonic phrase
 * @throws {TypeError} If entropy length is invalid
 */
function entropyToMnemonic(entropy, wordlist) {
    if (typeof entropy === 'string') {
        const bytes = new Uint8Array(entropy.length / 2);
        for (let i = 0; i < entropy.length; i += 2) {
            bytes[i/2] = parseInt(entropy.slice(i, i + 2), 16);
        }
        entropy = bytes;
    }
    wordlist = wordlist || _DEFAULT_WORDLIST;
    if (!wordlist) {
        throw new Error(WORDLIST_REQUIRED);
    }

    if (entropy.length < 16) {
        throw new TypeError(INVALID_ENTROPY);
    }
    if (entropy.length > 32) {
        throw new TypeError(INVALID_ENTROPY);
    }
    if (entropy.length % 4 !== 0) {
        throw new TypeError(INVALID_ENTROPY);
    }

    const entropyBits = bytesToBinary(Array.from(entropy));
    const checksumBits = deriveChecksumBits(entropy);

    const bits = entropyBits + checksumBits;
    const chunks = bits.match(/(.{1,11})/g);
    const words = chunks.map((binary) => {
        const index = binaryToByte(binary);
        return wordlist[index];
    });

    return wordlist[0] === '\u3042\u3044\u3053\u304f\u3057\u3093'
        ? words.join('\u3000')
        : words.join(' ');
}

/**
 * Generates a random mnemonic phrase
 * @param {number} [strength=128] - Entropy length in bits (128-256)
 * @param {RngFunction} [rng] - Random number generator function
 * @param {WordList} [wordlist] - Optional wordlist to use
 * @returns {string} The generated mnemonic phrase
 * @throws {TypeError} If strength is invalid
 */
function generateMnemonic(strength, rng, wordlist) {
    strength = strength || 128;
    if (strength % 32 !== 0) {
        throw new TypeError(INVALID_ENTROPY);
    }
    rng = rng || randomBytes;
    return entropyToMnemonic(rng(strength / 8), wordlist);
}

/**
 * Validates a mnemonic phrase
 * @param {string} mnemonic - The mnemonic phrase to validate
 * @param {WordList} [wordlist] - Optional wordlist to use
 * @returns {boolean} True if mnemonic is valid
 */
function validateMnemonic(mnemonic, wordlist) {
    try {
        mnemonicToEntropy(mnemonic, wordlist);
    } catch (e) {
        return false;
    }

    return true;
}

/**
 * Sets the default wordlist
 * @param {string} [language='en'] - Language code for wordlist
 * @throws {Error} If language is not supported
 */
function setDefaultWordlist(language = 'en') {
    const normalizedLanguage = language.toLowerCase();
    const result = wordlists[normalizedLanguage];
    if (result) {
        _DEFAULT_WORDLIST = result;
    } else {
        throw new Error(
            'Could not find wordlist for language "' + normalizedLanguage + '"'
        );
    }
}

/**
 * Gets the current default wordlist language
 * @returns {string} Language code of current wordlist
 * @throws {Error} If no default wordlist is set
 */
function getDefaultWordlist() {
    if (!_DEFAULT_WORDLIST) {
        throw new Error('No Default Wordlist set');
    }
    return Object.keys(wordlists).filter((lang) => {
        if (lang === 'ja' || lang === 'en') {
            return false;
        }
        return wordlists[lang].every(
            (word, index) => word === _DEFAULT_WORDLIST[index]
        );
    })[0];
}

export {
    mnemonicToSeedSync,
    mnemonicToSeed,
    mnemonicToEntropy,
    entropyToMnemonic,
    generateMnemonic,
    validateMnemonic,
    setDefaultWordlist,
    getDefaultWordlist,
    wordlists
};