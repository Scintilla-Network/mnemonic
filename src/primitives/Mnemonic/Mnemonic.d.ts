/**
 * @fileoverview TypeScript definitions for Mnemonic class
 */

import { WordListLanguage, RngFunction } from './BIP39/BIP39.js';
import { IMnemonic } from './types.js';

/**
 * Mnemonic class for handling BIP39 mnemonic phrases
 */
declare class Mnemonic implements IMnemonic {
    readonly phrase: string;

    /**
     * Creates a new Mnemonic instance
     * @param mnemonic - The mnemonic phrase (if empty, generates a new one)
     * @param wordlistLanguage - Language for wordlist
     * @param bytes - Entropy bytes for generation (if mnemonic is empty)
     */
    constructor(mnemonic: string, wordlistLanguage?: WordListLanguage, bytes?: number);

    /**
     * Validates a mnemonic phrase
     * @param mnemonic - The mnemonic phrase to validate
     * @param wordlistLanguage - Language for wordlist
     * @returns True if mnemonic is valid
     */
    static validate(mnemonic: string, wordlistLanguage?: WordListLanguage): boolean;

    /**
     * Generates a new mnemonic phrase
     * @param bytes - Entropy bytes (128, 160, 192, 224, 256)
     * @param wordlistLanguage - Language for wordlist
     * @param rng - Custom random number generator
     * @returns The generated mnemonic phrase
     */
    static generateMnemonic(bytes?: number, wordlistLanguage?: WordListLanguage, rng?: RngFunction): string;

    /**
     * Converts the mnemonic to a seed
     * @param password - Optional password for seed derivation
     * @returns The derived seed
     */
    toSeed(password?: string): Uint8Array;
}

export default Mnemonic;
export * as types from './types.js';
