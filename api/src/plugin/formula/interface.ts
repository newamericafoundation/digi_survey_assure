import { IQuestion, IQuestionOption, ISurveyComposite, ISurveyCompositeItem } from '../../interface/db';

export interface IFormulaReturn {
    total: number;
    questions: IFormulaReturnQuestion[];
    totalResponsesFactoredByQuestion: {};
    explainer: string;
    metadata?: any;
}

interface IFormulaReturnQuestion {
    composite: number;
    question: IQuestion;
    questionOptions: IQuestionOption[];
}

export interface IFormula {
    explainer: string;

    calculate(composite: ISurveyComposite, compositeItems: ISurveyCompositeItem[], useFilters: any): Promise<IFormulaReturn>;
}
