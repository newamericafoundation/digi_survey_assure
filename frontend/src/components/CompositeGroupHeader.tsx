import React from 'react';
import AdminButton from './AdminButton';

interface IProps {
    id: number;
    surveyId: number;
    name: string;
    description?: string;
    baseLevel?: boolean;
}

export default class CompositeGroupHeader extends React.Component<IProps> {
    render() {
        return (
            <div>
                <div className="floatRight">
                    <AdminButton
                        action="compositeGroup-reorder"
                        size={12}
                        inline={true}
                        secondaryButton={true}
                        icon="list-thumbnails"
                        tooltip="Re-order composites within this composite group"
                        supersetId={this.props.id}
                        subsetId={this.props.surveyId}></AdminButton>
                    <AdminButton
                        action="compositeGroup-edit"
                        size={12}
                        secondaryButton={true}
                        inline={true}
                        supersetId={this.props.id}
                        subsetId={this.props.surveyId}></AdminButton>
                </div>
                {this.props.baseLevel && <h1>{this.props.name}</h1>}

                {!this.props.baseLevel && <h2>{this.props.name}</h2>}

                {this.props.description && <p>{this.props.description}</p>}
            </div>
        );
    }
}
