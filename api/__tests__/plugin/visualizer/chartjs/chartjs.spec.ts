import { questionMock } from '../../../../db/mocks/question';
import { questionOptionMock } from '../../../../db/mocks/questionOption';
import { surveyMock } from '../../../../db/mocks/survey';
import { getPlugin } from '../../../../src/plugin/visualizer/chartjs/chartjs';

const mockData = [{
    "survey": surveyMock[0],
    "question": questionMock[0],
    "options": [
        questionOptionMock[0],
        questionOptionMock[1]
    ]
}];

const expectedOutput = {
    type: 'bar',
    data: {
        labels: ['Male', 'Female'],
        datasets: [{
            label: "Test Survey Group",
            data: [150, 250],
            borderWidth: 1,
            backgroundColor: ["#FF694B", "#A0DBDB", "#FEDC2A", "#2F80ED", "#EB5757", "#FAB0A1", "#219653", "#A391D7", "#47A3A3", "#B1D2FE", "#A0DBDB", "#2D9CDB", "#A3EC8A", "#5CDE2E", "#D0DE2E", "#FF993C", "#DA7C7C", "#708D78", "#699993", "#C0ECE7", "#71A8B9", "#749BFF", "#8774FF", "#BCB7DC", "#B582E9", "#56317B", "#9831FF", "#C931FF", "#E9ABFF", "#D975A5",],
        }],
    },
    options: {
        legend: { display: false, },
        scales: {
            yAxes: [{ ticks: { beginAtZero: true } }],
            xAxes: [{ ticks: { beginAtZero: true } }]
        },
        title: {
            display: true,
            text: 'What is your gender?'
        },
        animation: false,
        tooltips: {
            intersect: false,
        },
    }
};

const expectedPieOutput = {
    type: 'pie',
    data: {
        labels: ['Male', 'Female'],
        datasets: [{
            label: "Test Survey Group",
            data: [150, 250],
            borderWidth: 1,
            backgroundColor: ["#FF694B", "#A0DBDB", "#FEDC2A", "#2F80ED", "#EB5757", "#FAB0A1", "#219653", "#A391D7", "#47A3A3", "#B1D2FE", "#A0DBDB", "#2D9CDB", "#A3EC8A", "#5CDE2E", "#D0DE2E", "#FF993C", "#DA7C7C", "#708D78", "#699993", "#C0ECE7", "#71A8B9", "#749BFF", "#8774FF", "#BCB7DC", "#B582E9", "#56317B", "#9831FF", "#C931FF", "#E9ABFF", "#D975A5",],
        }],
    },
    options: {
        legend: { display: true, },
        title: {
            display: true,
            text: 'What is your gender?'
        },
        animation: false,
        tooltips: {
            intersect: false,
        }
    }
};

describe('ChartJS Plugin', () => {
    test('It should fail if the graph type does not exist', async () => {
        const chartjs = getPlugin();

        const chartData = chartjs.generateChartData('fakeType', mockData);

        expect(chartData).toBeNull();
    });

    test('It should transform an app object into a compatible ChartJS bar chart object', async () => {
        const chartjs = getPlugin();

        const chartData = chartjs.generateChartData('bar', mockData);

        expect(chartData).toEqual(expectedOutput);
    });

    test('It should transform an app object into a compatible ChartJS pie chart object', async () => {
        const chartjs = getPlugin();

        const chartData = chartjs.generateChartData('pie', mockData);

        expect(chartData).toEqual(expectedPieOutput);
    });
});
