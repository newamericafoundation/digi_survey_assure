import * as Koa from 'koa';
import { config } from '../config';
import { IQuestion, IQuestionOption } from '../interface/db';
import { getQuestionLanguage } from '../model/questionLanguage';
import { getQuestionOptionLanguage } from '../model/questionOptionLanguage';

export function translate(key: string, language: string = config.DEFAULT_LOCALE): string {
    try {
        const languageFile = require(`./../../locales/${language}.json`);

        return (key in languageFile) ? languageFile[key] : "Language key not found.";
    } catch (e) {
        const languageFile = require(`./../localize/${config.DEFAULT_LOCALE}.json`);

        return (key in languageFile) ? languageFile[key] : "Language key not found.";
    }
}

export function getLocale(ctx: Koa.Context): string {
    const locale = ctx.getLocaleFromHeader() ? ctx.getLocaleFromHeader() : config.DEFAULT_LOCALE;

    return locale.toLowerCase();
}

export async function translateQuestion(questionObject: IQuestion, language: string): Promise<IQuestion> {
    const translation = await getQuestionLanguage(questionObject.id, language);
    if (!translation) { return questionObject; }

    questionObject.text = translation.text;

    return questionObject;
}

export async function translateQuestionOption(questionOptionObject: IQuestionOption, language: string): Promise<IQuestionOption> {
    const translation = await getQuestionOptionLanguage(questionOptionObject.id, language);
    if (!translation) { return questionOptionObject; }

    questionOptionObject.legible_value = translation.text;

    return questionOptionObject;
}

/**
 * Localization object can exist in any metadata object under the key "localize".
 * Within that object you can place language codes. Sample localize object:
 * 
 *   const object = {
 *      "localize": {
 *          "name": {
 *              "en": "Name English",
 *              "fr": "Name French",
 *          },
 *          "description": {
 *              "en": "Description English",
 *              "fr": "Description French",
 *          }
 *      }
 *  };
 * 
 * Sample usage: const translated = findLanguageKey(object, 'name', 'en');
 * Sample output: "Name English"
 * 
 * @param {*} metadataObject 
 * @param {*} languageKey 
 * @param {*} languageCode 
 */
export function findLanguageKey(metadataObject: any, languageKey: string, languageCode: string = process.env.DEFAULT_LOCALE): string | null {
    if (!metadataObject) {
        return null;
    }

    if (!('localize' in metadataObject) || !(languageKey in metadataObject.localize) || !(languageCode in metadataObject.localize[languageKey])) {
        return null;
    }

    return metadataObject.localize[languageKey][languageCode];
}
