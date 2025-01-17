import { sha256 } from '@scintilla-network/hashes/classic';
import { bytesToBinary } from './bytesToBinary.js';

export function deriveChecksumBits(entropyBuffer: Uint8Array): string {
    const ENT = entropyBuffer.length * 8;
    const CS = ENT / 32;
    const hash = sha256(Uint8Array.from(entropyBuffer));
    return bytesToBinary(Array.from(hash)).slice(0, CS);
}