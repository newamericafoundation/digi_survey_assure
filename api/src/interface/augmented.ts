import {
    IQuestion,
    IQuestionOption,
    ISurveyComposite,
    ISurveyCompositeGroup,
    ISurveyQuestionFilter,
    ISurveyResponse
} from './db';

export interface IQuestionLocalized extends IQuestion {
    localizedText: string;
}

export interface ISurveyFiltersResponse {
    filter: ISurveyQuestionFilter;
    options: IQuestionOption[];
}

export interface ISurveyResponseWithBlockchain extends ISurveyResponse {
    tx_id: string;
    receipt: string;
    network: string;
    date_sent_to_chain: string;
    merkle_root: string;
}

export interface ISurveyCompositeGroupWithComposites extends ISurveyCompositeGroup {
    composites: ISurveyComposite[];
}

export interface ISurveyCompositeGroupWithChildren extends ISurveyCompositeGroup {
    children: ISurveyCompositeGroupWithChildren[];
    composites: ISurveyComposite[];
}
