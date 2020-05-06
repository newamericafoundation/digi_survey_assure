interface ITimestamps {
    created_at: string;
    updated_at: string;
}

export interface IBcTransction extends ITimestamps {
    id: number;
    tx_id: string;
    options: string;
    merkle_root: string;
    receipt: string;
    network: string;
    nonce: number;
}

export interface ICache {
    id: number;
    key: string;
    value: string;
    created_at: string;
    expires_at: string;
}

export interface ILanguage {
    code: string;
    name: string;
    default: boolean;
}

export interface ILocation extends ITimestamps {
    id: number;
    name: string;
    metadata: any;
    lat: number;
    long: number;
}

export interface IQuestion {
    id: number;
    question_group_id: number;
    question_type_id: number;
    survey_id: number;
    external_source_id: string;
    text: string;
    metadata: {
        spanEntireRow?: boolean;
        localize?: any;
    };
    rawData: any;
    order: number;
    public: boolean;
}

export interface IQuestionLanguage {
    id: number;
    question_id: number;
    language: string;
    text: string;
}

export interface IQuestionGroup extends ITimestamps {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    order: number;
}

export interface IQuestionOption {
    id: number;
    question_id: number;
    raw_value: string | number;
    legible_value: string | number;
    order: number;
    times_selected: number;
}

export interface IQuestionOptionLanguage {
    id: number;
    question_option_id: number;
    language: string;
    text: string;
}

export interface IQuestionType {
    id: number;
    mapping_class: string;
    description: string;
}

export interface ISurvey extends ITimestamps {
    id: number;
    survey_group_id: number;
    name: string; // * move to metadata + languages
    external_source_id: string;
    description: string;
    listener_code: string;
    url: string; // * move to metadata
    metadata: {
        image?: string;
        icon?: string;
        custom_route_url?: string;
        languages?: string[]; // List of available languages for this survey.
        localize?: any; // Localization data for name/description.
    };
    active: boolean;
    start_at: string;
    end_at: string;
}

export interface ISurveyWithSource extends ISurvey {
    source_plugin: string;
}

export interface ISurveyGroup extends ITimestamps {
    id: number;
    name: string; // * move to metadata + languages
    description: string; // * move to metadata + languages
    source_plugin: string;
    metadata: {
        image?: string;
        custom_route_url?: string;
        icon?: string;
        localize?: any;
    };
}

export interface ISurveyGroupItemMapping {
    id: number;
    root_survey_id: number;
    question_id: number;
    mapped_questions: number[];
}

export interface ISurveyQuestion {
    id: number;
    survey_id: number;
    question_id: number;
}

export interface ISurveyAccessGroup {
    id: number;
    survey_id: number;
    user_group_id: number;
    question_access: string;
}

export interface ISurveyComposite extends ITimestamps {
    id: number;
    survey_id: number;
    name: string;
    description: string;
    filters: any;
    formula: string;
    order: number;
    metadata: {
        cutoff?: number; // For MeanCutoff formula: the value at or above which the response is included in the final data set.
        localize?: any;
    };
}

export interface ISurveyCompositeGroup {
    id: number;
    name: string;
    survey_id: number;
    subcategory: number;
    metadata?: {
        description?: string;
        icon?: string;
        bgColor?: string;
        localize?: any;
    };
    order: number;
}

export interface ISurveyCompositeItem {
    id: number;
    survey_composite_id: number;
    question_id: number;
    question_option_id: number;
    weight: number;
}

export interface ISurveyResponse extends ITimestamps {
    id: number;
    survey_id: number;
    user_id: number;
    location_id: number;
    bc_transaction_id: number;
    external_source_id: string;
    confirmation_hash: string;
    raw_response: any;
    recorded_at: string;
    metadata: any;
}

export interface ISurveyQuestionFilter {
    id: number;
    survey_id: number;
    question_id: number;
    label: string;
    order: number;
}

export interface ISurveyResponseAnswer {
    id: number;
    survey_response_id: number;
    question_id: number;
    question_option_id: number;
}

export enum EGender {
    MALE = 1,
    FEMALE
}

export interface IUser extends ITimestamps {
    id: number;
    user_group_id: number;
    location_id: number;
    external_source_id: string;
    username: string;
    password: string;
    email: string;
    age: number;
    gender: EGender;
    language: string;
    metadata: any;
}

export interface IUserGroup extends ITimestamps {
    id: number;
    name: string;
    permissions: string;
}
