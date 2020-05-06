import React from 'react';
import BaseModal from './BaseModal';
import Api from '../../helpers/api';
import { translate } from '../../helpers/localize';

export default class ModalSurveyGroup extends BaseModal {
    maxSteps = 2;

    fields = {
        title: '',
        description: '',
        imageUrl: '',
        groupUrl: '',
        sourcePlugin: '',
    };

    public deleteText: string = 'Deleting a survey group is irreversible and will also delete all surveys, composite groups, and composites below it. Note that this will NOT delete the survey(s) within your data source.';

    constructor(props: any) {
        super(props);

        this.state = {
            loaded: false,
            normalizers: [],
            ...this.baseState,
            ...this.fields
        };
    }

    completeDelete() {
        window.location.assign('/');
    }

    async componentDidMount() {
        new Api(`setting/plugin/normalizer`, 'get')
            .call()
            .then(async (pluginData: any[]) => {
                if (this.props.editing) {
                    const data = await this.get();

                    this.setState({
                        loaded: true,
                        normalizers: pluginData,
                        title: data.name ? data.name : '',
                        description: data.description ? data.description : '',
                        sourcePlugin: data.source_plugin ? data.source_plugin : '',
                        groupUrl: (data.metadata && 'custom_route_url' in data.metadata) ? data.metadata.custom_route_url : '',
                        imageUrl: (data.metadata && 'image' in data.metadata) ? data.metadata.image : '',
                    });
                } else {
                    this.setState({
                        loaded: true,
                        normalizers: pluginData
                    });
                }
            })
            .catch((e) => {
                console.log(e);

                this.setState({
                    loaded: true,
                });
            });
    }

    endpoint() {
        return 'surveyGroup';
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
                            value={this.state.title}
                            maxLength={100}
                            onChange={(event) => this.handleInputChange('title', event.target.value)} />

                        <label>{translate('description')}</label>
                        <textarea
                            value={this.state.description}
                            onChange={(event) => this.handleInputChange('description', event.target.value)}></textarea>
                    </div>
                );
            case 2:
                const normalizers: any[] = [];
                for (const aPlugin of this.state.normalizers) {
                    const key = `plg_${aPlugin}`;
                    normalizers.push(<option value={aPlugin} key={key}>{aPlugin}</option>);
                }

                return (
                    <div>
                        <p className="leadText">{translate('details_additional')}</p>

                        <label>{translate('source_plugin')} *</label>
                        <select value={this.state.sourcePlugin} onChange={(event) => this.handleInputChange('sourcePlugin', event.target.value)}>
                            <option key="none" value=""></option>
                            {normalizers}
                        </select>

                        <label>{translate('landing_image')}</label>
                        <input
                            value={this.state.imageUrl}
                            type="text"
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

                <label className="previewLabel">{translate('title')}</label>
                <p className="previewValue">{this.state.title ? this.state.title : 'N/A'}</p>

                <label className="previewLabel">{translate('description')}</label>
                <p className="previewValue">{this.state.description ? this.state.description : 'N/A'}</p>

                <label className="previewLabel">{translate('source_plugin')}</label>
                <p className="previewValue">{this.state.sourcePlugin ? this.state.sourcePlugin : 'N/A'}</p>

                <label className="previewLabel">{translate('landing_image')}</label>
                {previewImage && <div className="imagePreview" style={previewImage}></div>}
                {!previewImage && <p className="previewValue">N/A</p>}

                {/* <label className="previewLabel">{translate('custom_url')}</label>
                <p className="previewValue">{this.state.groupUrl ? `http://yoursite.com/${this.state.groupUrl}` : 'N/A'}</p> */}
            </div>
        );
    }

    render() {
        if (!this.state.loaded) {
            return '';
        }

        return this.renderModal(translate('survey_group'));
    }
}
