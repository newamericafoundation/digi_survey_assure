import * as zip from 'adm-zip';
import * as request from 'superagent';

interface IGetResponses {
    surveyId: string;
}

let timeout;

/**
 * @link https://api.qualtrics.com/reference#create-response-export-new
 */
export async function run(pluginConfig: any, body: IGetResponses): Promise<string[] | null> {
    try {
        const qualtricsFileExportRequest: request.Response = await request
            .post(`${pluginConfig.apiUrl}/surveys/${body.surveyId}/export-responses`)
            .send({ "format": "json" })
            .set('Content-type', 'application/json')
            .set('X-API-Token', pluginConfig.apiSecretKey);

        if (!qualtricsFileExportRequest || (qualtricsFileExportRequest.body && "error" in qualtricsFileExportRequest.body.meta)) {
            console.log('There was an error exporting survey responses:', qualtricsFileExportRequest.body.meta.error.errorMessage);

            return null;
        }

        return new Promise((resolve: any, reject: any) => {
            let timesRun = 0;
            timeout = setInterval(async () => {
                if (timesRun === 5) {
                    clearInterval(timeout);

                    reject();
                }

                const fileExportId = await checkStatus(pluginConfig, body.surveyId, qualtricsFileExportRequest.body.result.progressId);
                if (!fileExportId) {
                    timesRun += 1;

                    reject();
                } else {
                    clearInterval(timeout);

                    const finalIds: string[] = [];

                    const responseIdsAsJson = await getExportFile(pluginConfig, body.surveyId, fileExportId);
                    if (!responseIdsAsJson) {
                        return null;
                    }

                    for (const aResponse of responseIdsAsJson.responses) {
                        finalIds.push(aResponse.responseId);
                    }

                    resolve(finalIds.length > 0 ? finalIds : null);
                }
            }, 10000);
        });
    } catch (e) {
        console.log('--- Error A ------->', e);

        return null;
    }
}

async function checkStatus(pluginConfig: any, surveyId: string, progressId: string): Promise<string | null> {
    try {
        const qualtricsFileExportStatus: request.Response = await request
            .get(`${pluginConfig.apiUrl}/surveys/${surveyId}/export-responses/${progressId}`)
            .set('Content-type', 'application/json')
            .set('X-API-Token', pluginConfig.apiSecretKey);

        if (!qualtricsFileExportStatus || (qualtricsFileExportStatus.body && "error" in qualtricsFileExportStatus.body.meta)) {
            return null;
        }

        if (qualtricsFileExportStatus.body.result.status !== 'complete') {
            return null;
        }

        return qualtricsFileExportStatus.body.result.fileId;
    } catch (e) {
        console.log('--- Error B ------->', e);

        return null;
    }
}

async function getExportFile(pluginConfig: any, surveyId: string, fileExportId: string): Promise<any> {
    return request
        .get(`${pluginConfig.apiUrl}/surveys/${surveyId}/export-responses/${fileExportId}/file`)
        .set('Content-type', 'application/json')
        .set('X-API-Token', pluginConfig.apiSecretKey)
        .on('progress', (event: any) => {
            console.log('Event:', event.percent);
        })
        .then((qualtricsFileExportZip: any) => {
            const zipData = new zip(qualtricsFileExportZip.body);
            const zipEntries = zipData.getEntries();

            if (!zipEntries[0]) {
                return null;
            }

            return JSON.parse(zipEntries[0].getData().toString('utf8'));
        })
        .catch((e: any) => {
            console.log('--- Error C ------->', e);

            return null;
        });
}
