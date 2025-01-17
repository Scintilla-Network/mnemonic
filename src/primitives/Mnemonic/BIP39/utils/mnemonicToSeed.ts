import { sha512 } from '@scintilla-network/hashes/classic';
import { pbkdf2Async } from '@scintilla-network/hashes/utils';
import { normalize } from './normalize.js';
import { salt } from './salt.js';

export async function mnemonicToSeed(mnemonic: string, password?: string): Promise<Uint8Array> {
    const encoder = new TextEncoder();
    const mnemonicBuffer = encoder.encode(normalize(mnemonic));
    const saltBuffer = encoder.encode(salt(normalize(password || '')));
    const res = await pbkdf2Async(sha512, mnemonicBuffer, saltBuffer, {
        c: 2048,
        dkLen: 64,
    });
    return res;
}
