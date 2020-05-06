import {
    ACCESS_LEVEL_CHANGE,
    ACTIVE_SURVEY_CHANGE,
    BUILD_BREADCRUMBS,
    CHANGE_LANGUAGE,
    FILTER_CHANGE,
    FILTER_CHANGE_SUBMIT,
    TOGGLE_MENU
} from '../actions/actionTypes';

const initialState = {
    filters: {},
    filterQueryString: null,
    accessToken: null,
    language: 'en',
    breadcrumbs: null,
    activeSurvey: {},
    mobileMenu: false,
    survey: {
        id: null,
        responses: 0,
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ACCESS_LEVEL_CHANGE:
            return {
                ...state,
                accessToken: action.jwt
            };
        case ACTIVE_SURVEY_CHANGE:
            return {
                ...state,
                activeSurvey: action.activeSurvey
            };
        case BUILD_BREADCRUMBS:
            return {
                ...state,
                breadcrumbs: action.breadcrumbs
            };
        case CHANGE_LANGUAGE:
            return {
                ...state,
                language: action.language
            };
        case FILTER_CHANGE:
            return {
                ...state,
                filters: action.filters
            };
        case FILTER_CHANGE_SUBMIT:
            return {
                ...state,
                filterQueryString: action.filterQueryString
            };
        case TOGGLE_MENU:
            return {
                ...state,
                mobileMenu: action.mobileMenu
            }
        default:
            return state
    }
}
