import { IVisualizerInputData } from '../../../../interface/plugin';
import { colors } from '../config';
import { generateDataSet } from '../helpers/dataSet';
import { IBarChartObject } from '../interface';

export function run(questionData: IVisualizerInputData[], filtersApplied: boolean = false): IBarChartObject {
    const aggregating = questionData.length > 1 ? true : false;

    const finalOutput = {
        type: 'bar',
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
            tooltips: {
                intersect: false,
            },
            legend: {
                display: aggregating,
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        },
    };

    const finalDataSets = [];
    for (const aQuestionOption of questionData[0].options) {
        finalOutput.data.labels.push(aQuestionOption.legible_value);
    }

    const runSorting = filtersApplied ? false : true;

    let count = 0;
    for (const aQuestionDataSet of questionData) {
        const colorsToUse = aggregating ? colors[count] : colors;

        finalDataSets.push(generateDataSet(aQuestionDataSet, colorsToUse, runSorting));

        count += 1;
    }

    finalOutput.data.datasets = finalDataSets;

    return finalOutput;
}
