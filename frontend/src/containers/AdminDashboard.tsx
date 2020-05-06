import React from 'react';
import { Link } from 'react-router-dom';
import Api from '../helpers/api';
import { deleteItem, getItem } from '../helpers/storage';
import { translate } from '../helpers/localize';
import Loader from '../components/Loader';

interface IState {
    error: string;
    success: string;
    loaded: boolean;
    importUnderstand: boolean;
    surveys: any[];
    privateQuestions: any[],
    privateQuestionGroups: any[],
}

export default class App extends React.Component<void, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            loaded: false,
            error: '',
            success: '',
            importUnderstand: false,
            surveys: [],
            privateQuestions: [],
            privateQuestionGroups: [],
        };
    }

    componentDidMount() {
        this.getPrivateData();
        this.getSurveys();
    }

    resetError() {
        this.setState({
            error: '',
        });
    }

    async getPrivateData() {
        this.resetError();

        this.setState({
            loaded: false,
        });

        if (getItem('adminToken')) {
            new Api(`setting/privacy/content`, 'get')
                .secure()
                .call()
                .then((response) => {
                    this.setState({
                        loaded: true,
                        privateQuestions: response.questions,
                        privateQuestionGroups: response.questionGroups,
                    });
                })
                .catch((e) => {
                    console.log(e);

                    this.setState({
                        error: 'Unable to get private content.',
                        loaded: true,
                    });
                });
        }
    }

    async getSurveys() {
        this.resetError();

        new Api(`survey`, 'get')
            .call()
            .then(async (response) => {
                for (const aSurvey of response) {
                    aSurvey.activeImport = await this.checkStatus(aSurvey.id, 'importResponses');
                    aSurvey.activeClose = await this.checkStatus(aSurvey.id, 'close');
                }

                this.setState({
                    surveys: response
                });
            })
            .catch((e) => {
                console.log(e);

                this.setState({
                    error: 'Unable to get surveys.'
                });
            });
    }

    invalidateCache() {
        if (getItem('adminToken')) {
            if (window.confirm('This may have implications on performance, please confirm you understand and want to proceed.')) {
                this.resetError();

                new Api(`setting/cache/invalidate`, 'post')
                    .secure()
                    .call()
                    .then((response) => {
                        this.setSuccess();
                    })
                    .catch((e) => {
                        console.log(e);

                        this.setState({
                            error: 'Unable to invalidate cache.'
                        });
                    });
            }
        } else {
            this.setState({
                error: translate('E031')
            });
        }
    }

    importResponses(surveyId: number) {
        if (window.confirm('Please confirm that you wish to import all responses from the data source for this survey? THIS PROCESS MAY TAKE A LONG TIME!')) {
            this.setSuccess('We have begun your import. This action will occur asynchronously. Responses should being populating shortly.');

            new Api(`survey/${surveyId}/importResponses`, 'post')
                .secure()
                .call()
                .then((_response) => {
                    this.setState({
                        importUnderstand: false,
                    });

                    this.setSuccess();
                })
                .catch((e) => {
                    console.log(e);

                    this.setState({
                        importUnderstand: false,
                        error: 'Unable to import responses.'
                    });
                });
        }
    }

    checkStatus(surveyId: number, statusType: string = 'importResponses') {
        return new Api(`survey/${surveyId}/status/${statusType}`, 'get')
            .secure()
            .call()
            .then((response) => {
                return response;
            })
            .catch((e) => {
                return null;
            });
    }

    closeSurvey(surveyId: number) {
        if (window.confirm('Closing a survey will prevent new responses from being registered. Only do this if you are sure all respondents have completed the survey!')) {
            this.setSuccess('We have begun closing your survey. This process can take some time. Please check back here in several minutes for a status update.');

            new Api(`survey/${surveyId}/close`, 'post')
                .secure()
                .call()
                .then((_response) => {
                    this.setSuccess('We have begun the process. This may take some time. Check back later for details.');

                    this.setState({
                        importUnderstand: false,
                    });
                })
                .catch((e) => {
                    console.log(e);

                    this.setState({
                        error: 'Unable to close survey: is there an active import running?'
                    });
                });
        }
    }

    makePublic(type: string, id: number) {
        const message = (type === 'question')
            ? 'Please confirm that you want to make this question public.'
            : 'Please confirm that you want to make this question group and all questions under it public.';

        if (window.confirm(message)) {
            this.resetError();

            const endpoint = (type === 'question') ? `question/${id}/makePublic` : `questionGroup/${id}/makePublic`;

            new Api(endpoint, 'post')
                .secure()
                .call()
                .then((response) => {
                    this.setSuccess();

                    this.getPrivateData();
                })
                .catch((e) => {
                    console.log(e);

                    this.setState({
                        error: 'Unable to make item public.'
                    });
                });
        }
    }

    setSuccess(msg = 'Success!') {
        this.setState({
            success: msg,
            error: '',
        });

        setTimeout(() => { this.removeSuccess() }, 2000);
    }

    removeSuccess() {
        this.setState({
            success: '',
        });
    }

    logout() {
        deleteItem('adminToken');

        window.location.assign('/');
    }

    renderSurveys() {
        if (this.state.importUnderstand) {
            const surveys: any[] = [];
            if (this.state.surveys.length > 0) {
                for (const aSurvey of this.state.surveys) {

                    let status;
                    if (aSurvey.activeClose) {
                        status = <span className="textRed">{translate('close_active')}</span>;
                    } else if (aSurvey.activeImport) {
                        status = <span className="textRed">{translate('responses_import')}</span>;
                    } else if (!aSurvey.active) {
                        status = <span className="textGray">{translate('concluded')}</span>;
                    } else {
                        status = <span className="textGreen">{translate('active')}</span>;;
                    }

                    const key = `sur_${aSurvey.id}`;

                    const listenerEndpoint = `${process.env.REACT_APP_API_URL}/listener/${aSurvey.id}/${aSurvey.listener_code}`;

                    surveys.push(<li key={key}>
                        <>
                            {aSurvey.activeClose && aSurvey.active && <button
                                className="floatRight marginLeft8"
                                disabled={true}
                                onClick={() => { this.closeSurvey(aSurvey.id) }}>{translate('close_active')}</button>}
                            {!aSurvey.activeClose && aSurvey.active && <button
                                className="floatRight marginLeft8"
                                onClick={() => { this.closeSurvey(aSurvey.id) }}>{translate('survey_close')}</button>}
                            {!aSurvey.activeImport && <button
                                className="floatRight marginLeft8"
                                onClick={() => { this.importResponses(aSurvey.id) }}>{translate('responses_import')}</button>}
                            {aSurvey.activeImport && <button
                                className="floatRight marginLeft8"
                                disabled={true}>{translate('import_active')}</button>}

                            <b>{translate('name')}:</b> {aSurvey.name}<br />
                            {aSurvey.description && <><b>Description:</b> {aSurvey.description}<br /></>}
                            <b>{translate('source_id')}: </b> {aSurvey.external_source_id}<br />
                            <b>{translate('listener_url')}:</b> {listenerEndpoint}<br />
                            <b>{translate('status')}:</b> {status}
                        </>
                    </li>);
                }
            }

            return (
                <>
                    <p>{translate('warning')}: {translate('survey_import_warning')}</p>
                    {surveys.length > 0 && <ul> {surveys} </ul>}
                    {surveys.length <= 0 && <p className="textGray textSmall textItalic marginBottom24">{translate('none')}</p>}
                </>
            );
        } else {
            return (<>
                <p className="textSmall">{translate('warning')}: {translate('survey_import_warning')}</p>

                <button onClick={() => { this.understandSurveys() }}>{translate('agree_and_continue')}</button>
            </>);
        }
    }

    understandSurveys() {
        this.setState({
            importUnderstand: true,
        });
    }

    render() {
        if (!getItem('adminToken')) {
            this.logout();
        }

        if (!this.state.loaded) {
            return <Loader></Loader>;
        }

        const privateQuestionGroups: any[] = [];
        let lastSurveyId = null;
        for (const aQuestionGroup of this.state.privateQuestionGroups) {
            if (lastSurveyId !== aQuestionGroup.survey_id) {
                const surveyKey = `qg_s_${aQuestionGroup.survey_id}`;
                privateQuestionGroups.push(<li key={surveyKey} className="divider"><h3>{translate('survey')} #{aQuestionGroup.survey_id}</h3></li>);
            }

            const key = `qg_${aQuestionGroup.id}`;
            privateQuestionGroups.push(<li key={key}>
                <button className="floatRight" onClick={() => { this.makePublic('questionGroup', aQuestionGroup.id) }}>{translate('make_public')}</button>
                {aQuestionGroup.name}
            </li>);

            lastSurveyId = aQuestionGroup.survey_id;
        }

        const privateQuestions: any[] = [];
        lastSurveyId = null;
        for (const aQuestion of this.state.privateQuestions) {
            if (lastSurveyId !== aQuestion.survey_id) {
                const surveyKey = `q_s_${aQuestion.survey_id}`;
                privateQuestions.push(<li key={surveyKey} className="divider"><h3>{translate('survey')} #{aQuestion.survey_id}</h3></li>);
            }

            const key = `q_${aQuestion.id}`;
            privateQuestions.push(<li key={key}>
                <button className="floatRight marginLeft12" onClick={() => { this.makePublic('question', aQuestion.id) }}>{translate('make_public')}</button>
                {aQuestion.external_source_id}: {aQuestion.text}
            </li>);

            lastSurveyId = aQuestion.survey_id;
        }

        return (
            <div className="subPage">
                {this.state.error && <div className="errorBubble">{this.state.error}</div>}
                {this.state.success && <div className="successBubble">{this.state.success}</div>}
                <div className="loginHeader">
                    <button className="adminButton floatRight" onClick={this.logout}>{translate('logout')}</button>
                    <Link to="/">{translate('back_to_app')}</Link>
                </div>
                <div className="loginBox form">
                    <h1>{translate('survey', true)}</h1>
                    <div className="loginForm">
                        {this.renderSurveys()}
                    </div>

                    <h1>{translate('privacy')}</h1>
                    <div className="loginForm innerWeaker">
                        <p>{translate('private_content')}</p>

                        <h2>{translate('question_group', true)}</h2>
                        {privateQuestionGroups.length > 0 &&
                            <ul>
                                {privateQuestionGroups}
                            </ul>}
                        {privateQuestionGroups.length <= 0 && <p className="textGray textSmall textItalic marginBottom24">{translate('none')}</p>}

                        <h2>{translate('question', true)}</h2>
                        {privateQuestions.length > 0 && <ul>
                            {privateQuestions}
                        </ul>}
                        {privateQuestions.length <= 0 && <p className="textGray textSmall textItalic">{translate('none')}</p>}
                    </div>

                    <h1>{translate('misc')}</h1>
                    <div className="loginForm innerWeaker">
                        <h2>{translate('cache')}</h2>
                        <p>{translate('cache_warning')}</p>
                        <button className="adminButton" onClick={() => { this.invalidateCache() }}>{translate('invalidate')}</button>
                    </div>
                </div>
                <div className="loginFooter">
                    <Link to="/">{translate('back_to_app')}</Link>
                </div>
            </div>
        );
    }
}
