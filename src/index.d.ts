/**
 * @fileoverview TypeScript definitions for ts-mnemonic library main exports
 */

import Mnemonic from './primitives/Mnemonic/Mnemonic.js';
import {
    WordList,
    Wordlists,
    WordListLanguage,
    RngFunction,
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

export { 
    Mnemonic,
    WordList,
    Wordlists,
    WordListLanguage,
    RngFunction,
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
