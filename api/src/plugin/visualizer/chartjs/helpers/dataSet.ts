// import { IQuestionOption } from '../../../../interface/db';
import { IVisualizerInputData } from '../../../../interface/plugin';
import { IBarChartDatasetObject } from '../interface';

export function generateDataSet(questionData: IVisualizerInputData, bgColor: string | string[], _sort: boolean = true): IBarChartDatasetObject {
    const dataSet = {
        label: null,
        data: [],
        borderWidth: 1,
        backgroundColor: bgColor
    };

    // Commented out as it causes re-render bugs, but was intended
    // to display data from highest to lowest.
    // const sortedData = sort ? questionData.options.sort((a: IQuestionOption, b: IQuestionOption) => {
    //     return b.times_selected - a.times_selected;
    // }) : questionData.options;

    const dataValues = [];
    // for (const aQuestionOption of sortedData) {
    for (const aQuestionOption of questionData.options) {
        dataSet.label = questionData.survey.name;

        dataValues.push(aQuestionOption.times_selected);
    }

    dataSet.data = dataValues;

    return dataSet;
}
