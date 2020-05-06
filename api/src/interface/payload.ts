export interface IAuthenticationPayload {
    username: string;
    password: string;
}

export interface IBcTransactionPayload {
    tx_id: string;
    receipt: string;
    network: string;
    merkle_root: string;
    options?: any;
}

export interface ICachePayload {
    key: string;
    value: string;
    expires_at?: string;
}

export type IFilterPayload = { [key: string]: string };

export interface IQuestionPayload {
    question_group_id: number;
    question_type_id: number;
    survey_id: number;
    external_source_id?: string;
    text: string;
    rawData: any;
    metadata?: any;
    order?: number;
}

export interface IQuestionGroupPayload {
    survey_id: number;
    name: string;
    description?: string;
    order: number;
}

export interface IQuestionLanguagePayload {
    question_id: number;
    language: string;
    text: string;
}

export interface IQuestionOptionPayload {
    question_id: number;
    raw_value: string;
    legible_value: string;
    order?: number;
}

export interface IQuestionOptionLanguagePayload {
    question_option_id: number;
    language: string;
    text: string;
}

export interface ISurveyCompositePayload {
    name: string;
    survey_composite_group_id: number;
    description?: string;
    filters?: any;
    order: number;
    formula: string;
    composite_items: any[];
    cutoff?: number;
}

export interface ISurveyCompositeGroupPayload {
    name: string;
    description?: string;
    subcategory?: number;
    icon?: string;
    bgColor?: string;
    order?: number;
}

export interface ISurveyPayload {
    surveyGroupId: number;
    name: string;
    externalSourceId: string;
    active: boolean;
    metadata?: any;
    description?: string;
    icon?: string;
    imageUrl?: string;
    groupUrl?: string;
    startDate?: string;
    endDate?: string;
}

export interface ISurveyGroupPayload {
    title: string;
    description?: string;
    imageUrl?: string;
    groupUrl?: string;
    sourcePlugin?: string;
}

export interface ISurveyResponsePayload {
    survey_id: number;
    external_source_id: string | number;
    raw_response: string;
    confirmation_hash?: string;
    user_id?: number;
    location_id?: number;
    bc_transaction_id?: string;
    recorded_at: string;
}

export interface ISurveyResponseAnswerPayload {
    survey_response_id: number;
    question_id: number;
    question_option_id: number;
}

export interface ISurveyMatchPasswordPayload {
    password: string;
}
