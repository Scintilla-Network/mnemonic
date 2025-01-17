import { randomBytes } from '@scintilla-network/hashes/utils';
import { _wordlists, DEFAULT_WORDLIST } from './_wordlists.js';
import { normalize } from './utils/normalize.js';
import { lpad } from './utils/lpad.js';
import { bytesToBinary } from './utils/bytesToBinary.js';
import { binaryToByte } from './utils/binaryToByte.js';
import { deriveChecksumBits } from './utils/deriveChecksumBits.js';
import { mnemonicToSeedSync } from './utils/mnemonicToSeedSync.js';
import { mnemonicToSeed } from './utils/mnemonicToSeed.js';

type WordList = string[];
interface Wordlists {
    [key: string]: WordList;
}

const wordlists: Wordlists = _wordlists;
let _DEFAULT_WORDLIST: WordList = DEFAULT_WORDLIST;

const INVALID_MNEMONIC = 'Invalid mnemonic';
const INVALID_ENTROPY = 'Invalid entropy';
const INVALID_CHECKSUM = 'Invalid mnemonic checksum';
const WORDLIST_REQUIRED =
    'A wordlist is required but a default could not be found.\n' +
    'Please pass a 2048 word array explicitly.';

    
function mnemonicToEntropy(mnemonic: string, wordlist?: WordList): string {
    wordlist = wordlist || _DEFAULT_WORDLIST;
    if (!wordlist) {
        throw new Error(WORDLIST_REQUIRED);
    }

    const words = normalize(mnemonic).split(' ');
    if (words.length % 3 !== 0) {
        throw new Error(INVALID_MNEMONIC);
    }

    const bits = words
        .map((word) => {
            const index = wordlist!.indexOf(word);
            if (index === -1) {
                throw new Error(INVALID_MNEMONIC);
            }

            return lpad(index.toString(2), '0', 11);
        })
        .join('');

    const dividerIndex = Math.floor(bits.length / 33) * 32;
    const entropyBits = bits.slice(0, dividerIndex);
    const checksumBits = bits.slice(dividerIndex);

    const entropyBytes = entropyBits.match(/(.{1,8})/g)!.map(binaryToByte);
    if (entropyBytes.length < 16) {
        throw new Error(INVALID_ENTROPY);
    }
    if (entropyBytes.length > 32) {
        throw new Error(INVALID_ENTROPY);
    }
    if (entropyBytes.length % 4 !== 0) {
        throw new Error(INVALID_ENTROPY);
    }

    const entropy = new Uint8Array(entropyBytes);
    const newChecksum = deriveChecksumBits(entropy);
    if (newChecksum !== checksumBits) {
        throw new Error(INVALID_CHECKSUM);
    }

    return Array.from(entropy).map(b => b.toString(16).padStart(2, '0')).join('');
}

function entropyToMnemonic(entropy: Uint8Array | string, wordlist?: WordList): string {
    if (typeof entropy === 'string') {
        const bytes = new Uint8Array(entropy.length / 2);
        for (let i = 0; i < entropy.length; i += 2) {
            bytes[i/2] = parseInt(entropy.slice(i, i + 2), 16);
        }
        entropy = bytes;
    }
    wordlist = wordlist || _DEFAULT_WORDLIST;
    if (!wordlist) {
        throw new Error(WORDLIST_REQUIRED);
    }

    if (entropy.length < 16) {
        throw new TypeError(INVALID_ENTROPY);
    }
    if (entropy.length > 32) {
        throw new TypeError(INVALID_ENTROPY);
    }
    if (entropy.length % 4 !== 0) {
        throw new TypeError(INVALID_ENTROPY);
    }

    const entropyBits = bytesToBinary(Array.from(entropy));
    const checksumBits = deriveChecksumBits(entropy);

    const bits = entropyBits + checksumBits;
    const chunks = bits.match(/(.{1,11})/g)!;
    const words = chunks.map((binary) => {
        const index = binaryToByte(binary);
        return wordlist![index];
    });

    return wordlist[0] === '\u3042\u3044\u3053\u304f\u3057\u3093'
        ? words.join('\u3000')
        : words.join(' ');
}

type RngFunction = (size: number) => Uint8Array;

function generateMnemonic(
    strength?: number,
    rng?: RngFunction,
    wordlist?: WordList
): string {
    strength = strength || 128;
    if (strength % 32 !== 0) {
        throw new TypeError(INVALID_ENTROPY);
    }
    rng = rng || randomBytes;
    return entropyToMnemonic(rng(strength / 8), wordlist);
}

function validateMnemonic(mnemonic: string, wordlist?: WordList): boolean {
    try {
        mnemonicToEntropy(mnemonic, wordlist);
    } catch (e) {
        return false;
    }

    return true;
}

function setDefaultWordlist(language: string = 'en'): void {
    const normalizedLanguage = language.toLowerCase();
    const result = wordlists[normalizedLanguage];
    if (result) {
        _DEFAULT_WORDLIST = result;
    } else {
        throw new Error(
            'Could not find wordlist for language "' + normalizedLanguage + '"'
        );
    }
}

function getDefaultWordlist(): string {
    if (!_DEFAULT_WORDLIST) {
        throw new Error('No Default Wordlist set');
    }
    return Object.keys(wordlists).filter((lang) => {
        if (lang === 'ja' || lang === 'en') {
            return false;
        }
        return wordlists[lang].every(
            (word, index) => word === _DEFAULT_WORDLIST[index]
        );
    })[0];
}

export {
    mnemonicToSeedSync,
    mnemonicToSeed,
    mnemonicToEntropy,
    entropyToMnemonic,
    generateMnemonic,
    validateMnemonic,
    setDefaultWordlist,
    getDefaultWordlist,
    wordlists,
    WordList,
    Wordlists,
};