/**
 * @link https://api.qualtrics.com/docs/events
 */
export interface IQualtricsListenerPayload {
    SurveyID: string;
    ResponseID: string;
    Status?: string;
    RecipientID?: string;
    ResponseEventContext?: string;
    CompletedDate?: string;
    BrandID?: string;
    Topic?: string;
}
