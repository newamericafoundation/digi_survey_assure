import React from 'react';
import { Redirect } from 'react-router-dom';
import { ChromePicker } from 'react-color';
import { translate } from '../../helpers/localize';
import BaseModal from './BaseModal';
import CompositeGroupSelect from './fragments/CompositeGroupSelect';
import IconPicker from './fragments/IconPicker';
import IconPreview from './fragments/IconPreview';

export default class ModalCompositeGroup extends BaseModal {
    maxSteps = 1;

    fields = {
        name: '',
        description: '',
        subcategory: '',
        icon: '',
        bgColor: '',
    };

    constructor(props: any) {
        super(props);

        this.state = {
            ...this.baseState,
            ...this.fields,
            selectedCategoryName: '',
            loaded: false,
        };
    }

    async componentDidMount() {
        if (this.props.editing) {
            const data = await this.get();

            this.setState({
                name: data.name ? data.name : '',
                description: (data.metadata && 'description' in data.metadata && data.metadata.description) ? data.metadata.description : '',
                subcategory: data.subcategory ? data.subcategory : '',
                icon: (data.metadata && 'icon' in data.metadata) ? data.metadata.icon : '',
                bgColor: (data.metadata && 'bgColor' in data.metadata) ? data.metadata.bgColor : '',
                loaded: true,
            });
        }
    }

    completeDelete() {
        this.setState({ redirect: `/survey/${this.props.subsetId}` });
    }

    endpoint() {
        return `survey/${this.props.subsetId}/compositeGroup`;
    }

    handleChangeComplete = (color: any) => {
        this.setState({ bgColor: color.hex });
    };

    handleIconSelection = (icon: string) => {
        this.setState({
            icon: icon,
            bgColor: (!this.state.bgColor) ? '#000' : this.state.bgColor,
        });
    }

    handleCategorySelect = (selectedCategoryId: string, selectedCategoryName: any) => {
        this.setState({
            subcategory: selectedCategoryId,
            selectedCategoryName: selectedCategoryName,
        });
    }

    step(stepNumber: number) {
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

                <label>{translate('composite_group')}</label>
                <CompositeGroupSelect
                    surveyId={this.props.subsetId}
                    excludedId={this.props.supersetId}
                    selectedId={this.state.subcategory}
                    handleCategorySelect={this.handleCategorySelect}></CompositeGroupSelect>

                <div className="grid2Wrapper">
                    <div>
                        <label>{translate('icon')}</label>
                        <IconPicker handleIconSelection={this.handleIconSelection}></IconPicker>

                        <div className="clear"></div>

                        <IconPreview bgColor={this.state.bgColor} icon={this.state.icon}></IconPreview>
                    </div>
                    <div>
                        <label>{translate('background_color')}</label>
                        <ChromePicker
                            color={this.state.bgColor}
                            onChange={this.handleChangeComplete}></ChromePicker>
                    </div>
                </div>
            </div>
        );
    }

    preview() {
        return (
            <div>
                <p className="leadText">{translate('confirm_details')}</p>

                <label className="previewLabel">{translate('title')}</label>
                <p className="previewValue">{this.state.name ? this.state.name : 'N/A'}</p>

                <label className="previewLabel">{translate('description')}</label>
                <p className="previewValue">{this.state.description ? this.state.description : 'N/A'}</p>

                <label className="previewLabel">{translate('composite_group')}</label>
                <p className="previewValue">{this.state.selectedCategoryName}</p>

                <label className="previewLabel">{translate('icon')}</label>
                <IconPreview bgColor={this.state.bgColor} icon={this.state.icon}></IconPreview>
            </div>
        );
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect}></Redirect>
        }

        return this.renderModal(translate('composite_group'));
    }
}
