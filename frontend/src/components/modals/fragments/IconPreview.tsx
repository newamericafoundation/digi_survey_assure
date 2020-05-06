import React from 'react';

interface IProps {
    bgColor: string;
    icon: string;
}

export default class IconPreview extends React.Component<IProps> {
    render() {
        const primaryCircle = {
            backgroundColor: this.props.bgColor,
        };

        const selectedIconClass = `fi-${this.props.icon} size-48`;

        return (
            <div>
                <div className="iconPreview" style={primaryCircle}>
                    <div className={selectedIconClass}></div>
                </div>
            </div>
        );
    }
}
