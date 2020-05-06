export interface IBarChartObject {
    type: string;
    data: {
        labels: string[];
        datasets: IBarChartDatasetObject[];
    };
    options: {
        legend?: any;
        title: {
            display: boolean;
            text: string;
        };
    }
}

export interface IBarChartDatasetObject {
    label?: string;
    backgroundColor?: string[] | string;
    data: number[];
}
