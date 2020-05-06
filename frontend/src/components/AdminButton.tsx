import React from 'react';
import { translate } from '../helpers/localize';
import ModalCompositeGroup from './modals/CompositeGroup';
import ModalCompositeGroupReorder from './modals/CompositeGroupReorder';
import ModalComposite from './modals/Composite';
import ModalSurvey from './modals/Survey';
import ModalSurveyFilters from './modals/SurveyFilters';
import ModalSurveyGroup from './modals/SurveyGroup';
import { getItem } from '../helpers/storage';
import { makeQuestionPrivate, makeQuestionSpanEntireRow } from './modals/actions/question';
import { makeQuestionGroupPrivate } from './modals/actions/questionGroup';

interface IProps {
    action: String;
    size?: number;
    icon?: string;
    subsetId?: number;
    supersetId?: number;
    inline?: boolean;
    textOnly?: boolean;
    tooltip?: string;
    secondaryButton?: boolean;
}

/**
 * This tool acts as the "gateway" into the administrative modal
 * system which controls all CRUD functionality. Please ensure that
 * this is used when performing any admin-related tasks throughout
 * the platform.
 */
export default class AdminButton extends React.Component<IProps> {
    state = {
        action: null,
        text: '',
        modal: null,
    };

    componentDidMount() {
        let text;

        const useIcon = this.props.icon ? this.props.icon : 'pencil';
        const useSize = this.props.size ? this.props.size : 16;
        const useClasses = `fi-${useIcon} size-${useSize}`;

        // Controls what is displayed for this button. No business logic.
        switch (this.props.action) {
            case 'composite-create':
                text = `${translate('button_composite_create')} +`;
                break;
            case 'compositeGroup-create':
                text = `${translate('button_composite_group_create')} +`;
                break;
            case 'question-edit':
                text = translate('edit');
                break;
            case 'survey-create':
                text = `${translate('button_survey_create')} +`;
                break;
            case 'surveyGroup-create':
                text = `${translate('button_survey_group_create')} +`;
                break;
            case 'question-public':
                text = `Hide`;
                break;
            case 'question-spanRow':
                text = `Resize`;
                break;
            case 'composite-edit':
            case 'compositeGroup-edit':
            case 'compositeGroup-reorder':
            case 'questionGroup-public':
            case 'survey-edit':
            case 'survey-filters':
            case 'surveyGroup-edit':
                text = (<i className={useClasses}></i>);
                break;
            default:
                text = '';
        }

        this.setState({
            text,
        });
    }

    removeModal() {
        this.setState({ modal: null });
    }

    async showModal() {
        let modal: any;

        switch (this.props.action) {
            case 'composite-create':
                modal = <ModalComposite closeModal={this.removeModal.bind(this)} subsetId={this.props.subsetId}></ModalComposite>;
                break;
            case 'composite-edit':
                modal = <ModalComposite
                    editing={true}
                    closeModal={this.removeModal.bind(this)}
                    supersetId={this.props.supersetId}
                    subsetId={this.props.subsetId}></ModalComposite>;
                break;
            case 'compositeGroup-create':
                modal = <ModalCompositeGroup closeModal={this.removeModal.bind(this)} subsetId={this.props.subsetId}></ModalCompositeGroup>;
                break;
            case 'compositeGroup-edit':
                modal = <ModalCompositeGroup
                    editing={true}
                    closeModal={this.removeModal.bind(this)}
                    supersetId={this.props.supersetId}
                    subsetId={this.props.subsetId}></ModalCompositeGroup>;
                break;
            case 'compositeGroup-reorder':
                modal = <ModalCompositeGroupReorder
                    closeModal={this.removeModal.bind(this)}
                    supersetId={this.props.supersetId}
                    subsetId={this.props.subsetId}></ModalCompositeGroupReorder>;
                break;
            case 'question-public':
                if (this.props.subsetId && window.confirm(translate('make_private'))) {
                    this.processActionResult(await makeQuestionPrivate(this.props.subsetId));
                }
                break;
            case 'question-spanRow':
                if (this.props.subsetId) {
                    this.processActionResult(await makeQuestionSpanEntireRow(this.props.subsetId));
                }
                break;
            case 'questionGroup-public':
                if (this.props.subsetId && window.confirm(translate('make_private'))) {
                    this.processActionResult(await makeQuestionGroupPrivate(this.props.subsetId));
                }
                break;
            case 'survey-filters':
                modal = <ModalSurveyFilters closeModal={this.removeModal.bind(this)} subsetId={this.props.subsetId}></ModalSurveyFilters>;
                break;
            case 'survey-create':
                modal = <ModalSurvey closeModal={this.removeModal.bind(this)} subsetId={this.props.subsetId}></ModalSurvey>;
                break;
            case 'survey-edit':
                modal = <ModalSurvey editing={true} closeModal={this.removeModal.bind(this)} subsetId={this.props.subsetId}></ModalSurvey>;
                break;
            case 'surveyGroup-create':
                modal = <ModalSurveyGroup closeModal={this.removeModal.bind(this)} subsetId={this.props.subsetId}></ModalSurveyGroup>;
                break;
            case 'surveyGroup-edit':
                modal = <ModalSurveyGroup editing={true} closeModal={this.removeModal.bind(this)} subsetId={this.props.subsetId}></ModalSurveyGroup>;
                break;
            default:
                modal = '';
        }

        if (modal) {
            this.setState({
                modal
            });
        }
    }

    private processActionResult(result: boolean) {
        if (result) {
            window.location.reload();
        } else {
            window.alert(translate('action_failed'));
        }
    }

    render() {
        if (!this.state.text) {
            return '';
        }

        if (!getItem('adminToken')) {
            return '';
        }

        const classes = (this.props.inline) ? 'inlineBlock marginLeft4' : '';
        const buttonClass = (this.props.secondaryButton) ? 'grayButton' : 'adminButton';

        return (
            <div className={classes} title={this.props.tooltip}>
                {!this.props.textOnly && <button className={buttonClass} type="button" onClick={this.showModal.bind(this)}>{this.state.text}</button>}
                {this.props.textOnly && <button className="transparentButton" type="button" onClick={this.showModal.bind(this)}>{this.state.text}</button>}

                {this.state.modal}
            </div>
        );
    }
}
