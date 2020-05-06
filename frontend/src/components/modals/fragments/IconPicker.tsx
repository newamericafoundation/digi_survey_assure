import React from 'react';

interface IProps {
    handleIconSelection: Function;
}

export default class IconPicker extends React.Component<IProps> {
    state = {
        icons: [
            'alert',
            'arrow-up',
            'arrow-down',
            'asterisk',
            'burst',
            'check',
            'clock',
            'comment',
            'compass',
            'contrast',
            'eye',
            'female',
            'male',
            'flag',
            'graph-bar',
            'graph-pie',
            'heart',
            'home',
            'lightbulb',
            'magnifying-glass',
            'male-female',
            'marker',
            'photo',
            'plus',
            'star',
            'target',
            'torsos-all',
            'trees',
            'widget',
            'wrench',
            'x',
        ]
    };

    handleIconPick = (icon: string) => {
        this.props.handleIconSelection(icon);
    }

    render() {
        const icons = [];
        for (const anIcon of this.state.icons) {
            const thisClass = `fi-${anIcon} size-36`;

            icons.push(
                <div key={anIcon} className="entry">
                    <i className={thisClass} onClick={() => this.handleIconPick(anIcon)}></i>
                </div>
            );
        }

        return (
            <div className="iconBox">
                {icons}
            </div>
        );
    }
}
