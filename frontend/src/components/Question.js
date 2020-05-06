import Chart from "chart.js";
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Api from '../helpers/api';
import { translate } from '../helpers/localize';
import { checkMobile } from '../helpers/mobile';
import Loader from './Loader';
import AdminButton from './AdminButton';
import { getItem } from '../helpers/storage'

class Question extends React.Component {
    chartRef = React.createRef();

    plugin = 'chartjs';

    url = '';

    state = {
        surveyId: null,
        question: {},
        questionId: null,
        chart: null,
        loading: true,
        timeout: 0,
        filters: '',
        language: null,
        filterQueryString: null,
        aggregate: false,
    }

    componentDidUpdate(prevProps) {
        if (prevProps.filterQueryString !== this.props.filterQueryString) {
            this.getQuestionDataForPlugin(this.props.filterQueryString);
        }

        if (prevProps.language !== this.props.language) {
            this.getQuestionDataForPlugin(this.props.filterQueryString);
        }
    }

    componentDidMount() {
        const { questionId, surveyId } = this.props;

        if (this.props.aggregate) {
            this.setState({
                aggregate: true,
                questionId: questionId,
                surveyId: surveyId,
            });

            this.url = `question/${questionId}/aggregate/${this.plugin}`;
        } else {
            this.url = `question/${questionId}/data/${this.plugin}`;

            this.setState({
                questionId: questionId,
                surveyId: surveyId,
            });
        }

        this.getQuestionDataForPlugin(this.props.filterQueryString);
    }

    async getQuestionDataForPlugin(filters = '') {
        new Api(`${this.url}?${filters}`, 'get')
            .secure()
            .call()
            .then((questionResponseData) => {
                // ------------------------------
                // Todo: This is all ChartJS specific -- needs to be a service!
                const currentRef = this.chartRef.current.getContext("2d");
                if (this.state.chart) {
                    this.state.chart.destroy();
                }

                // When showing composites, we change default colors to red/green
                // to reflect answers that are in the applicable dataset (green) and
                // those that are not (red).
                if (this.props.redGreenMode) {
                    let currentLabelIndex = 0;
                    for (const aLabel of questionResponseData.data.labels) {
                        questionResponseData.data.datasets[0].backgroundColor[currentLabelIndex] =
                            (this.props.redGreenMode.includes(aLabel))
                                ? '#AAF486'
                                : '#FAB0A1';

                        currentLabelIndex += 1;
                    }
                }

                questionResponseData.options.responsive = true;
                questionResponseData.options.maintainAspectRatio = false;

                const chart = new Chart(currentRef, questionResponseData);

                // Limit the length of labels on x-axis
                Chart.scaleService.updateScaleDefaults('category', {
                    ticks: {
                        callback: (tick) => {
                            const characterLimit = 15;
                            return (tick.length >= characterLimit)
                                ? tick.slice(0, tick.length).substring(0, characterLimit - 1).trim() + '...'
                                : tick;
                        }
                    }
                });
                // ------------------------------

                // Auto re-build this component if the survey is still active.
                // Sprinkle some randomness to stagger the requests a little.
                const surveyData = getItem('activeSurvey');
                let timeout = 0;
                if (surveyData && surveyData.active) {
                    timeout = 60000 + Math.floor(Math.random() * Math.floor(500));
                    setTimeout(() => { this.getQuestionDataForPlugin() }, timeout);
                }

                this.setState({
                    chart,
                    timeout: timeout,
                    question: questionResponseData,
                    loading: false,
                });
            })
            .catch((e) => {
                console.log("ERROR", e);
            })
            .finally(() => {
                // ...
            });
    }

    render() {
        if (!this.state.question) {
            return <Loader></Loader>;
        }

        const innerStyle = (checkMobile()) ? {
            "width": "100%",
            "overflowX": "scroll",
            "overflowY": "hidden",
        } : {
                "width": "100%"
            };

        const styles = (checkMobile())
            ? (this.props.spanEntireRow)
                ? { "width": "1200px", "height": "400px" }
                : { "height": "400px" }
            : (this.props.spanEntireRow)
                ? { "height": "420px" }
                : { "height": "300px" }

        const refQuestionId = `qc_${this.props.questionId}`;

        const link = `/survey/${this.state.surveyId}/question/${this.props.questionId}?aggregate=${this.props.aggregate}&${this.props.filterQueryString}`;

        let classes = 'gridItem';
        let spanIcon = 'arrows-out';
        if (this.props.spanEntireRow) {
            classes = 'gridItem fullLength';
            spanIcon = 'arrows-in';
        }

        return (
            <div className={classes} style={innerStyle}>
                {this.state.timeout > 0 && <div className="floatLeft textGray textSmall">
                    Refreshes every {Math.floor((this.state.timeout / 1000))} seconds.
                </div>}
                {!this.props.hideAudit && <div className="graphAudit">
                    <Link to={link}>{translate('audit')}</Link>
                    <AdminButton
                        action="question-public"
                        textOnly={true}
                        inline={true}
                        secondaryButton={true}
                        icon="eye"
                        subsetId={this.props.questionId}></AdminButton>
                    <AdminButton
                        action="question-spanRow"
                        textOnly={true}
                        inline={true}
                        secondaryButton={true}
                        icon={spanIcon}
                        subsetId={this.props.questionId}></AdminButton>
                </div>}

                <div>
                    <div className="positionRelative" style={styles}>
                        <canvas id={refQuestionId} ref={this.chartRef} />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        filterQueryString: state.primaryReducer.filterQueryString,
        language: state.primaryReducer.language,
    }
};

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Question);
