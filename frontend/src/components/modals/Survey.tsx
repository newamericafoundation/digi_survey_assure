import React from 'react';
import { Redirect } from 'react-router-dom';
import { formatDataForInput } from '../../helpers/date';
import { translate } from '../../helpers/localize';
import BaseModal from './BaseModal';

export default class ModalSurvey extends BaseModal {
    maxSteps = 2;

    fields = {
        name: '',
        description: '',
        imageUrl: '',
        groupUrl: '',
        startDate: '',
        endDate: '',
        surveyGroupId: null,
        externalSourceId: '',
        active: 'true',
    };

    public deleteText: string = 'Deleting a survey is irreversible and will also delete all composite groups and composites within it. Note that this will NOT delete the survey within your data source.';

    constructor(props: any) {
        super(props);

        this.state = { ...this.baseState, ...this.fields, surveyGroupId: this.props.subsetId };
    }

    completeDelete() {
        this.setState({ redirect: '/' });
    }

    async componentDidMount() {
        if (this.props.editing) {
            const data = await this.get();

            this.setState({
                name: data.name ? data.name : '',
                description: data.description ? data.description : '',
                surveyGroupId: data.survey_group_id,
                active: data.active,
                externalSourceId: data.external_source_id,
                startDate: formatDataForInput(data.start_at),
                endDate: formatDataForInput(data.end_at),
                groupUrl: (data.metadata && 'custom_route_url' in data.metadata) ? data.metadata.custom_route_url : '',
                imageUrl: (data.metadata && 'image' in data.metadata) ? data.metadata.image : '',
            });
        }
    }

    sendFields() {
        return {
            name: this.state.name,
            description: this.state.description,
            surveyGroupId: this.state.surveyGroupId,
            active: (this.state.active === 'true') ? true : false,
            externalSourceId: this.state.externalSourceId,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            groupUrl: this.state.groupUrl,
            imageUrl: this.state.imageUrl,
        };
    }

    endpoint() {
        return "survey";
    }

    step(stepNumber: number) {
        switch (stepNumber) {
            case 1:
                return (
                    <div>
                        <p className="leadText">{translate('enter_details')}</p>

                        <label>{translate('title')} *</label>
                        <input
                            autoFocus={true}
                            type="text"
                            value={this.state.name}
                            maxLength={100}
                            onChange={(event) => this.handleInputChange('name', event.target.value)} />

                        <label>{translate('description')}</label>
                        <textarea value={this.state.description} onChange={(event) => this.handleInputChange('description', event.target.value)}></textarea>

                        <label>{translate('data_source_id')} *</label>
                        <input
                            type="text"
                            disabled={this.props.editing ? true : false}
                            value={this.state.externalSourceId}
                            onChange={(event) => this.handleInputChange('externalSourceId', event.target.value)} />
                    </div>
                );
            case 2:
                return (
                    <div>
                        <p className="leadText">{translate('details_additional')}</p>

                        <label>{translate('landing_image')}</label>
                        <input
                            type="text"
                            value={this.state.imageUrl}
                            placeholder="https://www.somewebsite.com/path/to/my/image.jpg"
                            onChange={(event) => this.handleInputChange('imageUrl', event.target.value)} />
                        <p className="description">{translate('landing_image_description')}</p>

                        {/* <label>{translate('custom_url')}</label>
                        http://yoursite.com/<input
                            type="text"
                            value={this.state.groupUrl}
                            placeholder="mySurveyGroupEndpoint"
                            onChange={(event) => this.handleInputChange('groupUrl', event.target.value)} />
                        <p className="description">{translate('unique_url_name')}</p> */}

                        <label>{translate('accept_responses')}</label>
                        <select value={this.state.active} onChange={(event) => this.handleInputChange('active', event.target.value)}>
                            <option key="active_yes" value="true">{translate('yes')}</option>
                            <option key="active_no" value="false">{translate('no')}</option>
                        </select>

                        <div className="grid2Wrapper">
                            <div>
                                <label>{translate('date_start')}</label>
                                <input
                                    value={this.state.startDate}
                                    type="date"
                                    onChange={(event) => this.handleInputChange('startDate', event.target.value)} />
                            </div>
                            <div>
                                <label>{translate('date_end')}</label>
                                <input
                                    value={this.state.endDate}
                                    type="date"
                                    onChange={(event) => this.handleInputChange('endDate', event.target.value)} />
                            </div>
                        </div>
                        <p className="description">{translate('date_range_description')}</p>
                    </div>
                );
            default:
                return null;
        }
    }

    preview() {
        const previewImage = (this.state.imageUrl) ? { backgroundImage: `url(${this.state.imageUrl})` } : null;

        return (
            <div>
                <p className="leadText">{translate('confirm_details')}</p>
                <div className="grid2Wrapper">
                    <div>
                        <label className="previewLabel">{translate('title')}</label>
                        <p className="previewValue">{this.state.name ? this.state.name : 'N/A'}</p>

                        <label className="previewLabel">{translate('description')}</label>
                        <p className="previewValue">{this.state.description ? this.state.description : 'N/A'}</p>

                        <label className="previewLabel">{translate('landing_image')}</label>
                        {previewImage && <div className="imagePreview" style={previewImage}></div>}
                        {!previewImage && <p className="previewValue">N/A</p>}

                        {/* <label className="previewLabel">{translate('custom_url')}</label>
                        <p className="previewValue">{this.state.groupUrl ? `http://yoursite.com/${this.state.groupUrl}` : 'N/A'}</p> */}
                    </div>
                    <div>
                        <label className="previewLabel">{translate('accept_responses')}</label>
                        <p className="previewValue">{(this.state.active === 'true') ? translate('yes') : translate('no')}</p>

                        <label className="previewLabel">{translate('date_start')} - {translate('date_end')}</label>
                        <p className="previewValue">{this.state.startDate ? this.state.startDate : 'N/A'} - {this.state.endDate ? this.state.endDate : 'N/A'}</p>

                        <label className="previewLabel">{translate('data_source_id')}</label>
                        <p className="previewValue">{this.state.externalSourceId ? this.state.externalSourceId : 'N/A'}</p>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect}></Redirect>
        }

        return this.renderModal(translate('survey_add_new'));
    }
}
