import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from "./BIP39/BIP39.js";
import * as types from "./types.js";

class Mnemonic implements types.IMnemonic {
    readonly phrase: string;

    constructor(mnemonic: string = Mnemonic.generateMnemonic()) {
        this.phrase = mnemonic;
    }

    static validate(mnemonic: string): boolean {
        return validateMnemonic(mnemonic);
    }

    static generateMnemonic(bytes: number = 256): string {
        return generateMnemonic(bytes);
    }

    toSeed(password: string = ''): Uint8Array {
        return mnemonicToSeedSync(this.phrase, password);
    }
}

export default Mnemonic;
export { types };
