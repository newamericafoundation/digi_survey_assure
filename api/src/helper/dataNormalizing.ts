import * as humanReadable from 'he';

/**
 * Remove HTML tags from a string to return clean alpha-numeric content.
 * 
 * Example Input: <p><span>Hello world!</span></p>
 * Example Output: Hello world!
 * 
 * @param input 
 */
export function removeHtml(input: string): string {
    return humanReadable.decode(input.replace(/<[^>]+>/g, ''));
}

/**
 * Used for normalizing language codes used throughout the platform.
 * 
 * @param input 
 */
export function cleanLanguageCode(input: string): string {
    return input.toLowerCase().trim();
}
