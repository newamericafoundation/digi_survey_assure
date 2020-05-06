import { getItem } from './storage';

export function translate(key: string, plural: boolean = false): string {
    const language = getItem('language') ? getItem('language') : 'en';

    let words = null;
    try {
        words = require(`./../localize/${language}`);
    } catch (e) {
        words = require(`./../localize/${process.env.REACT_APP_DEFAULT_LOCALE}`);
    }

    const word = (key in words && words[key]) ? words[key] : `Language key (${key}) not found.`;

    if (Array.isArray(word)) {
        return (plural && word.length > 1) ? word[1] : word[0];
    } else {
        return word;
    }
}

/**
 * Localization object can exist in any metadata object under the key "localize".
 * Within that object you can place language codes. Sample localize object:
 * 
    const object = {
        "localize": {
            "name": {
                "en": "Name English",
                "fr": "Name French",
            },
            "description": {
                "en": "Description English",
                "fr": "Description French",
            }
        }
    };
 * 
 * Sample usage: const translated = findLanguageKey(object, 'name', 'en');
 * Sample output: "Name English"
 */
export function findLanguageKey(
    metadataObject: any,
    languageKey: string,
    inputLanguageCode: any = ''
): string | null {
    const languageCode = (inputLanguageCode) ? inputLanguageCode : process.env.REACT_APP_DEFAULT_LOCALE;

    if (!metadataObject) {
        return null;
    }

    if (
        !('localize' in metadataObject) ||
        !(languageKey in metadataObject.localize) ||
        !(languageCode in metadataObject.localize[languageKey])
    ) {
        return null;
    }

    return metadataObject.localize[languageKey][languageCode];
}
