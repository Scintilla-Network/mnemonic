import english from './wordlists/english.js';
import chineseSimplified from './wordlists/chinese_simplified.js';
import chineseTraditional from './wordlists/chinese_traditional.js';
import czech from './wordlists/czech.js';
import french from './wordlists/french.js';
import italian from './wordlists/italian.js';
import japanese from './wordlists/japanese.js';
import korean from './wordlists/korean.js';
import portuguese from './wordlists/portuguese.js';
import spanish from './wordlists/spanish.js';


const _wordlists = {
    english,
    en: english,
    chineseSimplified,
    zh_cn: chineseSimplified,
    chineseTraditional,
    zh_tw: chineseTraditional,
    czech,
    cs: czech,
    french,
    fr: french,
    italian,
    it: italian,
    japanese,
    ja: japanese,
    korean,
    ko: korean,
    portuguese,
    pt: portuguese,
    spanish,
    es: spanish,
};

const DEFAULT_WORDLIST = english;

export { _wordlists, DEFAULT_WORDLIST };
