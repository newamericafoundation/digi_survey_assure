import React from 'react';
import BaseModal from './BaseModal';
import Api from '../../helpers/api';
import { translate } from '../../helpers/localize';

export default class ModalSurveyFilters extends BaseModal {
    maxSteps = 1;

    fields = {
        selectedLabels: {}, // Label inputs for a question
        rawQuestions: [], // Raw API response body
        renderedQuestions: [], // Elements that create the modal contents
        selectedQuestions: [], // IDs of selected questions
    };

    constructor(props: any) {
        super(props);

        this.state = { ...this.baseState, ...this.fields };
    }

    validate() {
        let found = false;

        Object.keys(this.state.selectedLabels).forEach((key: any) => {
            if (this.state.selectedLabels[key].length <= 0) {
                this.setState({
                    error: 'All filters must have a label!'
                });

                found = true;
            }
        });

        return (found) ? false : true;
    }

    sendFields() {
        return this.state.selectedLabels;
    }

    async componentDidMount() {
        const existingFilters = await this.get(this.endpoint());

        const selectedQuestions: any[] = [];
        const selectedLabels: { [key: string]: string } = {};

        if (existingFilters.length > 0) {
            for (const aFilter of existingFilters) {
                selectedQuestions.push(aFilter.filter.question_id);
                selectedLabels[aFilter.filter.question_id] = aFilter.filter.label;
            }
        }

        new Api(`survey/${this.props.subsetId}/questions`, 'get')
            .call()
            .then((response: any) => {
                const renderedQuestionArray: any[] = [];

                for (const aQuestion of response) {
                    renderedQuestionArray.push(
                        <option key={aQuestion.id} value={aQuestion.id}>{aQuestion.text}</option>
                    );
                }

                this.setState({
                    rawQuestions: response,
                    renderedQuestions: renderedQuestionArray,
                    selectedLabels: selectedLabels,
                    selectedQuestions: selectedQuestions,
                });
            })
            .catch((e: any) => {
                console.log(e);
            })
            .finally(() => {
                this.setState({
                    loading: false,
                })
            });
    }

    endpoint() {
        return `survey/${this.props.subsetId}/filters`;
    }

    changeLagel(questionId: string, value: string) {
        const newSelectedLabels = this.state.selectedLabels;

        newSelectedLabels[+questionId] = value;

        this.setState({
            selectedLabels: newSelectedLabels,
        });
    }

    selectQuestion(questionId: string) {
        const newSelectedQuestions = this.state.selectedQuestions;
        const newSelectedLabels = this.state.selectedLabels;

        if (newSelectedQuestions.includes(+questionId)) {
            return;
        }

        newSelectedLabels[+questionId] = '';
        newSelectedQuestions.push(+questionId);

        this.setState({
            selectedQuestions: newSelectedQuestions,
            selectedLabels: newSelectedLabels,
        });
    }

    removeQuestion(questionId: string) {
        const newArray = this.state.selectedQuestions;
        const selectedLabels = this.state.selectedLabels;

        if (newArray.includes(+questionId)) {
            newArray.splice(newArray.indexOf(+questionId), 1);

            delete selectedLabels[+questionId];

            this.setState({
                selectedQuestions: newArray
            });
        }
    }

    step(stepNumber: number) {
        const added: any[] = [];
        for (const aQid of this.state.selectedQuestions) {
            const thisQuestion = this.state.rawQuestions.filter((question: any) => question.id === aQid)[0];

            const key = `qa_${thisQuestion.id}`;
            added.push(
                <div key={key} className="containerBox marginBottom12 compositeGroupSelect">
                    <div className="floatRight">
                        <i className="fi-trash size-24 pointer" onClick={() => this.removeQuestion(thisQuestion.id)}></i>
                    </div>

                    <h2>{thisQuestion.text}</h2>
                    <input
                        className="marginBottomNone"
                        placeholder="Enter a label for this filter"
                        type="text"
                        onChange={(event) => this.changeLagel(thisQuestion.id, event.target.value)}
                        value={this.state.selectedLabels[thisQuestion.id]} />
                </div>
            );
        }

        return (
            <div>
                <p className="leadText">{translate('enter_details')}</p>

                <div className="containerBox marginBottom12 compositeGroupSelect">
                    <select
                        className="marginBottomNone"
                        value=""
                        onChange={(event) => this.selectQuestion(event.target.value)}>

                        <option value=""></option>

                        {this.state.renderedQuestions}
                    </select>
                </div>

                {added}
            </div>
        );
    }

    preview() {
        const previewPoints: any[] = [];
        Object.keys(this.state.selectedLabels).forEach((key: any) => {
            const useKey = `prev_${key}`;
            previewPoints.push(<li key={useKey}>{this.state.selectedLabels[key]}</li>);
        });

        return (
            <div>
                <p className="leadText">{translate('confirm_details')}</p>

                <ul className="previewDataPoints">
                    {previewPoints}
                </ul>
            </div>
        );
    }

    render() {
        return this.renderModal(translate('filters'));
    }
}
