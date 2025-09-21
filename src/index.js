/**
 * @fileoverview Main entry point for ts-mnemonic library
 * @description Exports all BIP39 functionality and Mnemonic class
 */

import Mnemonic from './primitives/Mnemonic/Mnemonic.js';
import {
    mnemonicToSeedSync,
    mnemonicToSeed,
    mnemonicToEntropy,
    entropyToMnemonic,
    generateMnemonic,
    validateMnemonic,
    setDefaultWordlist,
    getDefaultWordlist,
    wordlists
} from './primitives/Mnemonic/BIP39/BIP39.js';

/**
 * @typedef {import('./primitives/Mnemonic/BIP39/BIP39.js').WordList} WordList
 * @typedef {import('./primitives/Mnemonic/BIP39/BIP39.js').Wordlists} Wordlists
 * @typedef {import('./primitives/Mnemonic/BIP39/BIP39.js').WordListLanguage} WordListLanguage
 * @typedef {import('./primitives/Mnemonic/BIP39/BIP39.js').RngFunction} RngFunction
 */

export { 
    Mnemonic,
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
