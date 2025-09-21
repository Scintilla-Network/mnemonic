/**
 * @module BIP39
 * @description TypeScript definitions for BIP39 mnemonic code implementation
 */

export type WordList = string[];

export interface Wordlists {
    [key: string]: WordList;
}

export type WordListLanguage = 'EN' | 'JA' | 'ES' | 'FR' | 'IT' | 'ZH' | 'KO' | 'PT' | 'RU' | 'TR';

export type RngFunction = (size: number) => Uint8Array;

/**
 * Converts a mnemonic phrase back to its entropy value
 * @param mnemonic - The mnemonic phrase to convert
 * @param wordlist - Optional wordlist to use, defaults to English
 * @returns The entropy value as a hex string
 * @throws {Error} If mnemonic is invalid or checksum fails
 */
export function mnemonicToEntropy(mnemonic: string, wordlist?: WordList): string;

/**
 * Converts an entropy value to a mnemonic phrase
 * @param entropy - The entropy value as bytes or hex string
 * @param wordlist - Optional wordlist to use, defaults to English
 * @returns The generated mnemonic phrase
 * @throws {TypeError} If entropy length is invalid
 */
export function entropyToMnemonic(entropy: Uint8Array | string, wordlist?: WordList): string;

/**
 * Generates a random mnemonic phrase
 * @param strength - Entropy length in bits (128-256), defaults to 128
 * @param rng - Random number generator function
 * @param wordlist - Optional wordlist to use
 * @returns The generated mnemonic phrase
 * @throws {TypeError} If strength is invalid
 */
export function generateMnemonic(
    strength?: number,
    rng?: RngFunction,
    wordlist?: WordList
): string;

/**
 * Validates a mnemonic phrase
 * @param mnemonic - The mnemonic phrase to validate
 * @param wordlist - Optional wordlist to use
 * @returns True if mnemonic is valid
 */
export function validateMnemonic(mnemonic: string, wordlist?: WordList): boolean;

/**
 * Sets the default wordlist
 * @param language - Language code for wordlist, defaults to 'en'
 * @throws {Error} If language is not supported
 */
export function setDefaultWordlist(language?: string): void;

/**
 * Gets the current default wordlist language
 * @returns Language code of current wordlist
 * @throws {Error} If no default wordlist is set
 */
export function getDefaultWordlist(): string;

/**
 * Converts a mnemonic phrase to a seed synchronously
 * @param mnemonic - The mnemonic phrase
 * @param passphrase - Optional passphrase
 * @returns The seed as a Buffer/Uint8Array
 */
export function mnemonicToSeedSync(mnemonic: string, passphrase?: string): Uint8Array;

/**
 * Converts a mnemonic phrase to a seed asynchronously
 * @param mnemonic - The mnemonic phrase
 * @param passphrase - Optional passphrase
 * @returns Promise that resolves to the seed as a Buffer/Uint8Array
 */
export function mnemonicToSeed(mnemonic: string, passphrase?: string): Promise<Uint8Array>;

/**
 * Available wordlists for different languages
 */
export const wordlists: Wordlists;
