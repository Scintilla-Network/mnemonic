/**
 * @fileoverview Type definitions for Mnemonic module
 */

/**
 * @typedef {Object} IMnemonic
 * @description Interface for mnemonic phrase operations
 * @property {string} phrase - The mnemonic phrase (readonly)
 * @property {function(string=): Uint8Array} toSeed - Converts mnemonic to seed with optional password
 */

// Export the typedef for use in other modules
export {};
