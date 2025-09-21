import { describe, it, expect, beforeEach } from '@scintilla-network/litest';
import Mnemonic from "./Mnemonic.js";
import { validateMnemonic, setDefaultWordlist } from './BIP39/BIP39.js';

describe('Mnemonic', () => {
    const validPhrase = 'shrimp various silver merge kidney kitten winter pluck smooth kidney enemy bulb script plug private margin leader repair enact clever duck woman luxury muscle';

    describe('constructor', () => {
        it('should create instance with provided mnemonic', () => {
            const mnemonic = new Mnemonic(validPhrase);
            expect(mnemonic.phrase).toBe(validPhrase);
        });

        it('should generate new mnemonic if none provided', () => {
            const mnemonic = new Mnemonic();
            expect(mnemonic.phrase).toBeDefined();
            expect(validateMnemonic(mnemonic.phrase)).toBe(true);
        });
    });

    describe('generateMnemonic', () => {
        it('should generate valid mnemonic with default strength', () => {
            const phrase = Mnemonic.generateMnemonic();
            expect(validateMnemonic(phrase)).toBe(true);
            expect(phrase.split(' ').length).toBe(24); // 256 bits = 24 words
        });

        it('should generate valid mnemonic with custom strength', () => {
            const phrase = Mnemonic.generateMnemonic(128);
            expect(validateMnemonic(phrase)).toBe(true);
            expect(phrase.split(' ').length).toBe(12); // 128 bits = 12 words
        });
    });

    describe('validate', () => {
        it('should validate valid mnemonic', () => {
            expect(Mnemonic.validate(validPhrase)).toBe(true);
        });

        it('should validate invalid mnemonic', () => {
            expect(Mnemonic.validate('invalid mnemonic')).toBe(false);
        });
    });

    describe('toSeed', () => {
        it('should generate correct seed without password', () => {
            const mnemonic = new Mnemonic(validPhrase);
            const seed = mnemonic.toSeed();
            expect(seed instanceof Uint8Array).toBe(true);
            expect(seed.length).toBe(64);
        });

        it('should generate different seed with password', () => {
            const mnemonic = new Mnemonic(validPhrase);
            const seed1 = mnemonic.toSeed();
            const seed2 = mnemonic.toSeed('password');
            expect(seed1).not.toEqual(seed2);
            const expectedSeed1 = 'd65a0fa6d553f280d671fbbd722617a4f08498932b50d70d3189814b232bcc1ba900eee1c235e6c6ab33c2cf7e23a037a6f805c696eceaa00b24984dd918be0e';
            const expectedSeed2 = '088eb7da417e45345c5117ce5152f4b0d3e4f31d2ca940f83eea89ea1a33dbdf9a8785db58e53fa181c6c7ec40ab2b7b9c2a901a6977eb533a0981d082d85e65'
            expect(seed1).toEqual(Uint8Array.from(Buffer.from(expectedSeed1, 'hex')));
            expect(seed2).toEqual(Uint8Array.from(Buffer.from(expectedSeed2, 'hex')));
        });
    });
});

describe('Language Support', () => {
    beforeEach(() => {
        // Reset to English default before each test
        setDefaultWordlist('EN');
    });

    it('should generate valid Japanese mnemonic', () => {
        setDefaultWordlist('JA');
        const mnemonic = new Mnemonic();
        expect(validateMnemonic(mnemonic.phrase)).toBe(true);
        expect(mnemonic.phrase.includes('　')).toBe(true); // Japanese uses ideographic space
    });

    it('should generate valid Spanish mnemonic', () => {
        setDefaultWordlist('ES');
        const mnemonic = new Mnemonic();
        expect(validateMnemonic(mnemonic.phrase)).toBe(true);
    });

    it('should generate valid French mnemonic', () => {
        setDefaultWordlist('FR');
        const mnemonic = new Mnemonic();
        expect(validateMnemonic(mnemonic.phrase)).toBe(true);
    });

    it('should handle invalid language code', () => {
        expect(() => setDefaultWordlist('INVALID')).toThrow();
    });

    it('should validate mnemonics across different languages', () => {
        const languages = ['EN', 'JA', 'ES', 'FR', 'IT', 'KO', 'CS', 'PT', 'ZH_CN', 'ZH_TW'];
        
        for (const lang of languages) {
            setDefaultWordlist(lang);
            const mnemonic = new Mnemonic();
            expect(validateMnemonic(mnemonic.phrase)).toBe(true);
        }
    });

    it('should generate different seeds for same words in different languages', () => {
        setDefaultWordlist('EN');
        const englishMnemonic = new Mnemonic();
        const englishSeed = englishMnemonic.toSeed();

        setDefaultWordlist('ES');
        const spanishMnemonic = new Mnemonic();
        const spanishSeed = spanishMnemonic.toSeed();

        expect(englishSeed).not.toEqual(spanishSeed);
    });
});

