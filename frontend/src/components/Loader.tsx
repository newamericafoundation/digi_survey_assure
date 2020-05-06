import React from 'react';

interface IProps {
    dimension?: number;
    inline?: boolean;
}

export default class Loader extends React.Component<IProps> {
    render() {
        const style = (this.props.dimension)
            ? { height: `${this.props.dimension}px`, width: `${this.props.dimension}px`, display: (this.props.inline) ? 'inline-block' : 'block' }
            : { height: "60px", width: "60px", display: (this.props.inline) ? 'inline' : 'block' };

        return (
            <div className="loaderContainer" style={style}>
                <div className="loader" style={style}></div>
            </div>
        );
    }
}
