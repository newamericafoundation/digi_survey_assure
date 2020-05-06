import { IVisualizerInputData } from '../../../../interface/plugin';
import { colors } from '../config';
import { generateDataSet } from '../helpers/dataSet';
import { IBarChartObject } from '../interface';

export function run(questionData: IVisualizerInputData[], _filtersApplied: boolean = false): IBarChartObject {
    const aggregating = questionData.length > 1 ? true : false;

    const finalOutput = {
        type: 'pie',
        data: {
            labels: [],
            datasets: [],
        },
        options: {
            animation: false,
            'title': {
                display: true,
                text: questionData[0].question.text,
            },
            legend: {
                display: true
            },
            tooltips: {
                intersect: false,
            }
        }
    };

    const finalDataSets = [];
    for (const aQuestionOption of questionData[0].options) {
        finalOutput.data.labels.push(aQuestionOption.legible_value);
    }

    let count = 0;
    for (const aQuestionDataSet of questionData) {
        const colorsToUse = aggregating ? colors[count] : colors;

        finalDataSets.push(generateDataSet(aQuestionDataSet, colorsToUse, false));

        count += 1;
    }

    finalOutput.data.datasets = finalDataSets;

    return finalOutput;
}
