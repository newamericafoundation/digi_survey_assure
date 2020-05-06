
export class BaseFormula {
    private __explainer: string;

    /**
     * Used to replace macros in the explainer variable, such as replacing the
     * meanCutoff "cutoff" value with the actual number.
     * 
     * Example input: "average of %cutoff% or above"
     * Example replacements: { "cutoff": 3 }
     * Output: "average of 3 or above"
     * 
     * @param input 
     * @param replacements 
     */
    public macros(input: string, replacements: any): string {
        let output = input;

        Object.keys(replacements).forEach((key: string) => {
            output = output.replace(`%${key}%`, replacements[key]);
        });

        return output;
    }

    get explainer(): string { return this.__explainer; }
    set explainer(explainer: string) { this.__explainer = explainer; }
}
