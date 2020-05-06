import React from 'react';
import Question from './Question';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Api from '../helpers/api';
import { translate } from '../helpers/localize';
import Loader from './Loader';
import AdminButton from '../components/AdminButton';
import { getItem } from '../helpers/storage'

class Composite extends React.Component {
    state = {
        surveyId: null,
        loaded: false,
        filters: '',
        timeout: 0,
        compositeData: {
            total: null,
            questions: [],
        },
        compositeId: null,
        name: null,
        description: null
    }

    componentDidMount() {
        const { id, surveyId, filters } = this.props;

        this.getCompositeTotal(id, surveyId, filters);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.filterQueryString !== prevProps.filterQueryString) {
            this.getCompositeTotal(this.props.id, this.props.surveyId, this.props.filterQueryString);
        }

        if (prevProps.language !== this.props.language) {
            this.getCompositeTotal(this.props.id, this.props.surveyId, this.props.filters);
        }
    }

    // Value is a number from 0 to 1
    getColor(value) {
        let normalizeValue = 0;
        if (value >= 50) {
            normalizeValue = 100 - (value / 100);
        } else {
            normalizeValue = ((value / 100) - 100) * -1;
        }

        const hue = ((1 - normalizeValue) * 120).toString(10);

        return ["hsl(", hue, ", 100%, 50%)"].join("");
    }

    async getCompositeTotal(compositeId, surveyId, filters) {
        this.setState({
            loaded: false,
        });

        new Api(`survey/${surveyId}/composite/${compositeId}/calculate?${filters}`, 'get')
            .call()
            .then((compositeData) => {
                // Auto re-build this component if the survey is still active.
                // Sprinkle some randomness to stagger the requests a little.
                const surveyData = getItem('activeSurvey');
                let timeout = 0;
                if (surveyData && surveyData.active) {
                    timeout = 60000 + Math.floor(Math.random() * Math.floor(500));
                    setTimeout(() => { this.getCompositeTotal(compositeId, surveyId, filters) }, timeout);
                }

                this.setState({
                    loaded: true,
                    timeout: timeout,
                    compositeId,
                    surveyId,
                    compositeData
                });
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                // ...
            });
    }

    render() {
        const { detailed } = this.props;
        const linkCompositeView = `/survey/${this.state.surveyId}/composite/${this.state.compositeId}`;

        if (this.state.loaded) {
            let formattedQuestions = [];
            let formattedEntires = [];
            this.state.compositeData.questions.forEach(question => {
                let greenLabels = [];

                const applicableAnswers = question.questionOptions.map((anOption) => {
                    greenLabels.push(anOption.legible_value);

                    return `"${anOption.legible_value}"`;
                }).join(' or ');

                if (detailed) {
                    let filters = '';
                    if (!this.props.filterQueryString) {
                        const rawFilters = this.state.compositeData.overview.filters;
                        filters = rawFilters ? Object.keys(rawFilters).map(key => `filter[f${key}]=${rawFilters[key]}`).join('&') : '';
                    } else {
                        filters = this.props.filterQueryString;
                    }

                    formattedQuestions.push(<Question
                        filterQueryString={filters}
                        surveyId={question.question.survey_id}
                        key={question.question.id}
                        redGreenMode={greenLabels}
                        questionId={question.question.id}
                        aggregate={false}></Question >);
                }

                formattedEntires.push(
                    <React.Fragment key={question.question.id}>
                        <div className="compositeBoxInnerLeft">
                            <p className="textBold">{question.question.text}</p>
                        </div>
                        {question.composite && <div className="compositeBoxInnerRight" style={{ backgroundColor: this.getColor(question.composite) }}>
                            <p className="textBold">{question.composite}%</p>
                            <p className="applicableAnswers">{translate('answered')} {applicableAnswers}</p>
                        </div>}
                        {!question.composite && <div className="compositeBoxInnerRight">N/A</div>}
                    </React.Fragment >
                );
            });

            return (
                <div>
                    <div className="compositeHeader">
                        <div className="floatRight">
                            <AdminButton
                                action="composite-edit"
                                size={12}
                                secondaryButton={true}
                                supersetId={this.state.compositeData.overview.id}
                                subsetId={this.state.compositeData.overview.survey_id}></AdminButton>
                        </div>
                        <h3><Link to={linkCompositeView}>{this.state.compositeData.overview.name} - {translate('composite')}</Link></h3>
                    </div>
                    <div className="compositeBlock">
                        <div className="compositeBox primaryComposite">
                            <div className="primaryCompositeTotal" style={{ backgroundColor: this.getColor(this.state.compositeData.total) }}>
                                <h3 className="textBold textUppercase">{translate('composite_overall_score')}:</h3>
                                <h1>{this.state.compositeData.total}%</h1>
                                {this.state.compositeData.explainer && <p className="explainer">{this.state.compositeData.explainer}</p>}
                            </div>
                        </div>
                        <div className="compositeBlockInner">
                            {formattedEntires}
                        </div>
                    </div>
                    <div className="gridLayout">
                        {formattedQuestions.length > 0 && formattedQuestions}
                    </div>
                    {this.state.timeout > 0 && <div className="textGray textSmall textRight">
                        Refreshes every {Math.floor((this.state.timeout / 1000))} seconds.
                    </div>}
                </div>
            );
        } else {
            return (
                <div className="placeholderBox">
                    <Loader></Loader>

                    <p>{translate('calculate_composite')}</p>
                </div >
            );
        }
    }
}

const mapStateToProps = (state) => {
    return {
        filterQueryString: state.primaryReducer.filterQueryString,
        language: state.primaryReducer.language,
    }
};

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Composite);
