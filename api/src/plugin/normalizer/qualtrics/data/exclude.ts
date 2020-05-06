/**
 * Run any custom logic here for cleaning data before
 * it is inputted into the database.
 */

export function runExclusionRules(rawQualtricsData: any): any {
    if (rawQualtricsData.values.finished !== 1) {
        return null;
    }

    // Input any custom exclusion rules here...

    return rawQualtricsData;
}
