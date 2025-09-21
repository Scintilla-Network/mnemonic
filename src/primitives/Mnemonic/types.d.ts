/**
 * @fileoverview TypeScript definitions for Mnemonic module types
 */

export interface IMnemonic {
    readonly phrase: string;
    toSeed(password?: string): Uint8Array;
}
