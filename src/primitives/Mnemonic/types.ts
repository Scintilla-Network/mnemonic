export interface IMnemonic {
    readonly phrase: string;
    toSeed(password?: string): Uint8Array;
}
    