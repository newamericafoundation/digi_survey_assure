import { IVisualizerClass, IVisualizerInputData } from '../../../interface/plugin';
import { BaseVisualizerClass } from '../BaseVisualizer';

class Chartjs extends BaseVisualizerClass implements IVisualizerClass {
    public constructor() {
        super();
    }

    /**
     * @param filtersApplied Because of the way sorting works, when filters are applied we need
     *                       to prevent sorting from happening.
     */
    public generateChartData(chartType: string, surveyQuestionData: IVisualizerInputData[], filtersApplied: boolean = false): any {
        try {
            const hook = require(`${__dirname}/charts/${chartType}`);

            return hook.run(surveyQuestionData, filtersApplied);
        } catch (e) {
            console.log(e);

            return null;
        }
    }
}

export function getPlugin(): Chartjs {
    return new Chartjs();
}
