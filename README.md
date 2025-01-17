# @scintilla-network/mnemonic

Advanced BIP39 mnemonic generation and management library with comprehensive multi-language support.

[![npm version](https://badge.fury.io/js/@scintilla-network%2Fmnemonic.svg)](https://www.npmjs.com/package/@scintilla-network/mnemonic)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🌍 **Multi-Language Support**
  - English (default)
  - Japanese (日本語)
  - Spanish (Español)
  - French (Français)
  - Italian (Italiano)
  - Korean (한국어)
  - Czech (Čeština)
  - Portuguese (Português)
  - Chinese (Simplified & Traditional)
- 🔑 **Key Management**
  - BIP39 mnemonic generation
  - Seed generation
  - Master key derivation
  - Password protection
- 🔒 **Security**
  - Built on Noble Hashes
  - PBKDF2 with 2048 iterations
  - Optional password protection
  - BIP39 specification compliant

## Installation

```bash
npm install @scintilla-network/mnemonic
```

### Browser

```html
  <script type="module">
    import { Mnemonic } from 'https://unpkg.com/@scintilla-network/mnemonic'
</script>
```



## Quick Start

```javascript
import Mnemonic from '@scintilla-network/mnemonic';

// Generate new mnemonic (24 words by default)
const mnemonic = new Mnemonic();
console.log(mnemonic.phrase);

// Generate seed and master key
const seed = mnemonic.toSeed();
const masterKey = mnemonic.toMasterDerivableKey();

// Derive child keys (BIP44)
const childKey = masterKey.derive("m/44'/8888'/0'/0/0");
const address = childKey.toAddress('sct');
```

## Usage Guide

### Mnemonic Generation

```javascript
import Mnemonic from '@scintilla-network/mnemonic';
import { setDefaultWordlist, wordlists } from '@scintilla-network/mnemonic/BIP39';

// Default 24 words (256-bit entropy)
const mnemonic = new Mnemonic();

// Custom entropy (12 words = 128 bits)
const shortMnemonic = new Mnemonic(Mnemonic.generateMnemonic(128));

// From existing phrase
const phrase = 'shrimp various silver merge kidney kitten winter pluck smooth kidney enemy bulb';
const imported = new Mnemonic(phrase);
```

### Multi-Language Support

```javascript
// Change default language
setDefaultWordlist('japanese');
const japaneseMnemonic = new Mnemonic();

// Generate in specific language
setDefaultWordlist('spanish');
const spanishMnemonic = new Mnemonic();

// Available languages
console.log(Object.keys(wordlists));
// ['EN', 'JA', 'ES', 'FR', 'IT', 'KO', 'CS', 'PT', 'ZH_CN', 'ZH_TW']
```

### Seed Generation

```javascript
const mnemonic = new Mnemonic();

// Without password
const seed = mnemonic.toSeed();

// With password protection
const protectedSeed = mnemonic.toSeed('mypassword');
```

### Key Derivation

```javascript
const mnemonic = new Mnemonic();

// Generate master key
const masterKey = mnemonic.toMasterDerivableKey();

// With password protection
const protectedMasterKey = mnemonic.toMasterDerivableKey('mypassword');

// Derive child keys (BIP44)
const childKey = masterKey.derive("m/44'/8888'/0'/0/0");
const address = childKey.toAddress('sct');
```

## API Reference

### `Mnemonic`

#### Constructor
```typescript
new Mnemonic(mnemonic?: string)
```
- `mnemonic`: Optional existing phrase. Generates new if omitted

#### Static Methods
```typescript
Mnemonic.generateMnemonic(bytes?: number): string
```
- `bytes`: Entropy (128-256, multiple of 32). Default: 256

#### Instance Methods
```typescript
toSeed(password?: string): Uint8Array
toMasterDerivableKey(password?: string): DerivableKey
```

### BIP39 Utilities

```typescript
setDefaultWordlist(language: string): void
getDefaultWordlist(): string[]
validateMnemonic(mnemonic: string, wordlist?: string[]): boolean
```

## Security Considerations

- Never store mnemonics in plaintext
- Use password protection for sensitive keys
- Validate entropy sources
- Keep seeds and master keys secure
- Follow BIP39 specifications

## License

MIT License - see the [LICENSE](LICENSE) file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
