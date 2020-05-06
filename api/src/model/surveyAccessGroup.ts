import { config } from '../config';
import { connection } from '../helper/db';
import { sha256Hex } from '../helper/hashing';
import { ISurveyAccessGroup } from '../interface/db';

const table = 'survey_access_group';

export async function getAccessLevel(surveyId: number, password: string): Promise<ISurveyAccessGroup | null> {
    return connection<ISurveyAccessGroup>(table)
        .where('survey_id', surveyId)
        .where('password', sha256Hex(`${config.APP_SECRET}${password}`))
        .then((rows: any) => {
            return rows[0] ? rows[0] : null;
        })
        .catch((error: any) => {
            console.log(error);

            return null;
        });
}
