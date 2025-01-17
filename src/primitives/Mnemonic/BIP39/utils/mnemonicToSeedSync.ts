import { pbkdf2 } from '@scintilla-network/hashes/utils';
import { sha512 } from '@scintilla-network/hashes/classic';
import { normalize } from './normalize.js';
import { salt } from './salt.js';

export function mnemonicToSeedSync(mnemonic: string, password: string = ''): Uint8Array {
    const encoder = new TextEncoder();
    const mnemonicBuffer = encoder.encode(normalize(mnemonic));
    const saltBuffer = encoder.encode(salt(normalize(password)));
    const hashFunction = sha512;

    return pbkdf2(hashFunction, mnemonicBuffer, saltBuffer, {
        c: 2048,
        dkLen: 64,
    });
}
