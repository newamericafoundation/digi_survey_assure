import React from 'react';
import { translate } from '../../helpers/localize';
import BaseModal from './BaseModal';
import CompositeGroupSelect from './fragments/CompositeGroupSelect';
import CompositeQuestionBox from './fragments/CompositeQuestionBox';
import Api from '../../helpers/api';

export default class ModalComposite extends BaseModal {
    maxSteps = 2;

    fields = {
        name: '',
        description: '',
        survey_composite_group_id: null,
        cutoff: 1,
        // filters: {},
        order: 1,
        formula: 'average', // Please see the plugins filter of the backend to determine which formulas are available.
        composite_items: [],
    };

    constructor(props: any) {
        super(props);

        const selectedQuestionDetails: { [key: string]: any } = {};
        const selectedQuestionIds: string[] = [];

        this.state = {
            ...this.baseState,
            ...this.fields,
            selectedCategoryName: '',
            formulas: [],
            questions: [],
            questionOptionList: [],
            selectedQuestionIds: selectedQuestionIds,
            selectedQuestionDetails: selectedQuestionDetails,
            currentlySelectedQuestion: '',
            totalNumerators: 0,
            loadingThisModal: true,
        };
    }

    async componentDidMount() {
        this.getQuestionsOnSurvey();

        new Api(`setting/plugin/formula`, 'get')
            .call()
            .then(async (pluginData: any[]) => {
                this.setState({
                    formulas: pluginData
                });
            })
            .catch((e) => {
                console.log(e);

                this.setState({
                    loaded: true,
                });
            });
    }

    sendFields() {
        return {
            name: this.state.name,
            description: this.state.description,
            cutoff: +this.state.cutoff,
            survey_composite_group_id: this.state.survey_composite_group_id,
            order: this.state.order,
            formula: this.state.formula,
            composite_items: this.state.selectedQuestionDetails,
        };
    }

    getQuestionsOnSurvey() {
        new Api(`survey/${this.props.subsetId}/questions`, 'get')
            .setPayload(this.state)
            .call()
            .then(async (response: any) => {
                const questionOptions = [];
                for (const question of response) {
                    questionOptions.push(
                        <option key={question.id} value={question.id}>{question.external_source_id}: {question.text}</option>
                    );
                }

                if (this.props.editing) {
                    const data = await this.get();

                    const compositeItems = await this.get(`${this.endpoint()}/${this.props.supersetId}/items`);

                    const selectedQuestionIds: any[] = [];
                    const selectedQuestionDetails: any = {};
                    for (const anItem of compositeItems) {
                        if (!selectedQuestionIds.includes(anItem.question_id)) {
                            selectedQuestionIds.push(anItem.question_id);
                            selectedQuestionDetails[anItem.question_id] = [];
                        }
                        selectedQuestionDetails[anItem.question_id].push(anItem.question_option_id);
                    }

                    this.setState({
                        totalNumerators: compositeItems.length,
                        name: data.name ? data.name : '',
                        description: data.description ? data.description : '',
                        survey_composite_group_id: data.survey_composite_group_id ? data.survey_composite_group_id : '',
                        order: data.order ? data.order : 1,
                        formula: data.formula ? data.formula : 'average',
                        selectedQuestionDetails: selectedQuestionDetails,
                        selectedQuestionIds: selectedQuestionIds,
                        questions: response,
                        questionOptionList: questionOptions,
                        loadingThisModal: false,
                        cutoff: ('cutoff' in data.metadata) ? data.metadata.cutoff : 1,
                    });
                } else {
                    this.setState({
                        questions: response,
                        questionOptionList: questionOptions,
                        loadingThisModal: false,
                    });
                }
            })
            .catch((e: any) => {
                console.log(e);
            });
    }

    validate() {
        if (this.state.formula === 'average' && this.state.totalNumerators < 1) {
            this.setState({
                error: translate('E042')
            });

            return false;
        }
        else if (this.state.formula === 'meanCutoff' && (!this.state.cutoff || this.state.cutoff < 1)) {
            this.setState({
                error: translate('meancutoff_error')
            });

            return false;
        }

        return true;
    }

    endpoint() {
        return `survey/${this.props.subsetId}/composite`;
    }

    /**
     * Adds a question to the numerator list.
     */
    handleQuestionAddition(questionId: string) {
        this.setState({
            currentlySelectedQuestion: '',
        });

        if (this.state.selectedQuestionIds.includes(questionId)) {
            return '';
        }

        const newQuestionIds = [
            ...this.state.selectedQuestionIds,
            +questionId
        ];

        const newSelectedQuestionDetails = {
            ...this.state.selectedQuestionDetails,
        };
        newSelectedQuestionDetails[+questionId] = [];

        this.setState({
            selectedQuestionIds: newQuestionIds,
            selectedQuestionDetails: newSelectedQuestionDetails,
            totalNumerators: this.state.totalNumerators + 1,
        });
    }

    /**
     * Removes a question from the numerator list.
     */
    handleQuestionRemoval = (questionId: number) => {
        if (this.state.selectedQuestionIds.includes(questionId)) {
            const newSelectedIds = this.state.selectedQuestionIds;
            newSelectedIds.splice(newSelectedIds.indexOf(questionId), 1);

            const newQuestionDetails = this.state.selectedQuestionDetails;
            delete newQuestionDetails[questionId];

            this.setState({
                currentlySelectedQuestion: '',
                selectedQuestionIds: newSelectedIds,
                selectedQuestionDetails: newQuestionDetails,
            });
        }
    }

    /**
     * Passed in from CompositeQuestionBox as a prop. That component handles
     * all of the logic behind what is/isn't selected, this just registers it.
     */
    handleQuestionOptionSelect = (selectedOptions: any[], questionId: string) => {
        const newSelections = this.state.selectedQuestionDetails;
        newSelections[questionId] = selectedOptions;

        this.setState({
            selectedQuestionDetails: newSelections,
        });
    }

    handleCategorySelect = (selectedCategoryId: string, selectedCategoryName: any) => {
        this.setState({
            survey_composite_group_id: +selectedCategoryId,
            selectedCategoryName: selectedCategoryName,
        });
    }

    step(stepNumber: number) {
        switch (stepNumber) {
            case 1:
                if (this.state.loadingThisModal) {
                    return '';
                }

                const additionalFields: any[] = [];
                if (this.state.formula === 'meanCutoff') {
                    additionalFields.push(<div key="mc_num">
                        <label>{translate('cutoff')}</label>
                        <input
                            type="number"
                            step="0.25"
                            value={this.state.cutoff}
                            onChange={(event) => this.handleInputChange('cutoff', event.target.value)} />
                    </div >);
                }

                const formulas: any[] = [];
                for (const aPlugin of this.state.formulas) {
                    const key = `plg_${aPlugin}`;
                    formulas.push(<option value={aPlugin} key={key}>{aPlugin}</option>);
                }

                return (
                    <div>
                        <p className="leadText">{translate('enter_details')}</p>

                        <label>{translate('title')}</label>
                        <input
                            autoFocus={true}
                            type="text"
                            value={this.state.name}
                            maxLength={100}
                            onChange={(event) => this.handleInputChange('name', event.target.value)} />

                        <label>{translate('description')}</label>
                        <textarea
                            value={this.state.description}
                            onChange={(event) => this.handleInputChange('description', event.target.value)}></textarea>

                        <div className="grid2Wrapper">
                            <div>
                                <label>{translate('composite_group')}</label>
                                <CompositeGroupSelect
                                    surveyId={this.props.subsetId}
                                    selectedId={this.state.survey_composite_group_id}
                                    handleCategorySelect={this.handleCategorySelect}></CompositeGroupSelect>
                            </div>
                            <div>
                                <label>{translate('formula')}</label>
                                <select value={this.state.formula} onChange={(event) => this.handleInputChange('formula', event.target.value)}>
                                    {formulas}
                                </select>

                                {additionalFields}
                            </div>
                        </div>
                    </div>
                );
            case 2:
                const compositeQuestions: any[] = [];
                for (const aQuestion of this.state.selectedQuestionIds) {
                    const selections = (aQuestion in this.state.selectedQuestionDetails) ? this.state.selectedQuestionDetails[aQuestion] : [];

                    compositeQuestions.push(<CompositeQuestionBox
                        key={aQuestion}
                        questionId={aQuestion}
                        currentSelections={selections}
                        handleQuestionOptionSelect={this.handleQuestionOptionSelect}
                        handleQuestionRemoval={this.handleQuestionRemoval}
                    ></CompositeQuestionBox>);
                }

                return (
                    <div>
                        <p className="leadText">{translate('data_point', true)}</p>

                        <div>
                            <div className="containerBox marginBottom12 compositeGroupSelect">
                                <select
                                    className="marginBottomNone"
                                    value={this.state.currentlySelectedQuestion}
                                    onChange={(event) => this.handleQuestionAddition(event.target.value)}>
                                    <option value="">{translate('select_data_point_to_add')}</option>
                                    {this.state.questionOptionList}
                                </select>
                            </div>

                            {compositeQuestions}
                        </div>
                    </div>
                );
        }
    }

    preview() {
        const previewPoints: any[] = [];
        for (const selectedQuestion of this.state.selectedQuestionIds) {
            const questionText = this.state.questions.map((aQuestion: any) => {
                return (+aQuestion.id === +selectedQuestion) ? aQuestion.text : null;
            });
            previewPoints.push(<li key={selectedQuestion}>{questionText}</li>);
        }

        return (
            <div>
                <p className="leadText">{translate('confirm_details')}</p>

                <div className="grid2Wrapper">
                    <div>
                        <label className="previewLabel">{translate('title')}</label>
                        <p className="previewValue">{this.state.name ? this.state.name : 'N/A'}</p>

                        <label className="previewLabel">{translate('description')}</label>
                        <p className="previewValue">{this.state.description ? this.state.description : 'N/A'}</p>
                    </div>
                    <div>
                        <label className="previewLabel">{translate('composite_group')}</label>
                        <p className="previewValue">{this.state.selectedCategoryName ? this.state.selectedCategoryName : 'N/A'}</p>

                        <label className="previewLabel">{translate('formula')}</label>
                        <p className="previewValue">{this.state.formula}</p>

                        {this.state.formula === 'meanCutoff' && <div>
                            <label className="previewLabel">{translate('cutoff')}</label>
                            <p className="previewValue">{this.state.cutoff}</p>
                        </div>}
                    </div>
                </div>
                <div>
                    <label className="previewLabel">{translate('data_point', true)}</label>
                    <ul className="previewDataPoints">
                        {previewPoints}
                    </ul>
                </div>
            </div>
        );
    }

    render() {
        return this.renderModal(translate('composite'));
    }
}
