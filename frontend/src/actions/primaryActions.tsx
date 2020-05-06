import {
    ACCESS_LEVEL_CHANGE,
    ACTIVE_SURVEY_CHANGE,
    BUILD_BREADCRUMBS,
    CHANGE_LANGUAGE,
    FILTER_CHANGE,
    FILTER_CHANGE_SUBMIT,
    TOGGLE_MENU
} from './actionTypes';
import { Dispatch } from 'redux';

// When a password is submitted to increased access level
export function accessLevelChange(jwt: string) {
    return (dispatch: Dispatch) => {
        dispatch({
            type: ACCESS_LEVEL_CHANGE,
            jwt: jwt,
        });
    };
}

// Triggered in Header component when we navigate to a new survey
export function buildBreadcrumbs(surveyData: any) {
    return (dispatch: Dispatch) => {
        dispatch({
            type: BUILD_BREADCRUMBS,
            breadcrumbs: (surveyData) ? `${surveyData.surveyGroupName} / ${surveyData.name}` : null,
        });
    };
}

// Change a language setting
export function changeLanguage(language: string) {
    return (dispatch: Dispatch) => {
        dispatch({
            type: CHANGE_LANGUAGE,
            language,
        });
    };
}

// When a filter field is changed.
export function filterChange(filterId: string, filterValue: string) {
    return (dispatch: Dispatch, getState: any) => {
        const currentFilters = getState().primaryReducer.filters;
        currentFilters[filterId] = filterValue;

        dispatch({
            type: FILTER_CHANGE,
            filters: currentFilters,
        });
    };
}

// When filters are submitted.
export function filterChangeSubmit() {
    return (dispatch: Dispatch, getState: any) => {
        const filters = getState().primaryReducer.filters;

        const filterQueryString = Object.keys(filters).map((key) => {
            if (filters[key]) {
                return `filter[${key}]=${filters[key]}`
            }

            return '';
        }).join('&');

        dispatch({
            type: FILTER_CHANGE_SUBMIT,
            filterQueryString
        });
    };
}

export function setActiveSurvey(surveyData: any) {
    return (dispatch: Dispatch) => {
        dispatch({
            type: ACTIVE_SURVEY_CHANGE,
            activeSurvey: surveyData,
        });
    };
}

export function toggleMenu() {
    return (dispatch: Dispatch, getState: any) => {
        const mobileMenuStatus = getState().primaryReducer.mobileMenu;

        dispatch({
            type: TOGGLE_MENU,
            mobileMenu: mobileMenuStatus ? false : true,
        });
    };
}