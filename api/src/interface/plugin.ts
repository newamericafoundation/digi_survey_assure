import { IQuestion, IQuestionOption, ISurvey } from './db';

export interface INormalizerClass {
    runHook(name: string, action: string, data: any): any;
    normalizeData(data: any): Promise<IRegisterResponse[]>;
    simulateResponseBody(surveyId: number | string, responseId: number | string): any;
}

export interface IVisualizerClass {
    generateChartData(chartType: string, surveyQuestionData: IVisualizerInputData[]): Promise<any>;
}

/**
 * questionId = question.id in the database.
 * questionOptionId = question_option.id in the database.
 */
export interface IRegisterResponse {
    questionId: number;
    questionOptionId: number;
}

/**
 * Data coming into a visualizer plugin maps directly to
 * the database structure.
 */
export interface IVisualizerInputData {
    survey: ISurvey;
    question: IQuestion;
    options: IQuestionOption[];
}
