import React from 'react';

interface IProps {
    icon: string;
    bgColor?: string;
    iconSize?: number;
    className?: string;
}

export default class Icon extends React.Component<IProps> {
    render() {
        if (!this.props.icon) { return ''; }

        const iconStyles = (this.props.bgColor)
            ? { backgroundColor: this.props.bgColor }
            : { backgroundColor: "#a2a2a2" };

        const iconSize = (this.props.iconSize)
            ? `size-${this.props.iconSize}`
            : `size-16`;

        const iconClass = `fi-${this.props.icon} ${iconSize}`;

        const className = (this.props.className) ? `icon ${this.props.className}` : 'icon';

        return (
            <div className={className} style={iconStyles}>
                <i className={iconClass}></i>
            </div>
        );
    }
}
