import { sha256 } from '@scintilla-network/hashes/classic';
import { bytesToBinary } from './bytesToBinary.js';

/**
 * Derives the checksum bits from the entropy buffer.
 * @param {Uint8Array} entropyBuffer - The entropy buffer to derive the checksum bits from.
 * @returns {string} The checksum bits as a binary string.
 * @description
 * This function calculates checksum bits for BIP39 mnemonic generation:
 * 1. Takes the initial entropy as a byte array
 * 2. Calculates SHA256 hash of the entropy
 * 3. Takes first ENT/32 bits of the hash as checksum
 * where ENT is the length of the initial entropy in bits
 */
export function deriveChecksumBits(entropyBuffer) {
    const ENT = entropyBuffer.length * 8;
    const CS = ENT / 32;
    const hash = sha256(Uint8Array.from(entropyBuffer));
    return bytesToBinary(Array.from(hash)).slice(0, CS);
}