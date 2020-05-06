import React from 'react';
import { Redirect } from 'react-router-dom';
import Icon from './Icon';

interface IProps {
    title: string;
    link?: string;
    bgImage?: string;
    linkText?: string;
    icon?: string;
    maxLength?: number;
}

export default class DisplayBox extends React.Component<IProps> {
    state = {
        redirect: false,
    };

    handleClick() {
        this.setState({
            redirect: true,
        });
    }

    render() {
        if (this.state.redirect && this.props.link) {
            return <Redirect to={this.props.link}></Redirect>
        }

        const styles = (this.props.bgImage)
            ? { backgroundImage: `url(${this.props.bgImage})` }
            : { backgroundColor: "#fff" };

        const title = (this.props.maxLength && this.props.title.length > this.props.maxLength)
            ? `${this.props.title.substring(0, this.props.maxLength)}...`
            : this.props.title;

        return (
            <div className="displayBox" onClick={this.handleClick.bind(this)}>
                <div className="dbHeader">
                    {this.props.icon && <div className="dbHeaderIcon">
                        <Icon icon={this.props.icon} className="dbIcon" iconSize={24} bgColor="#fff"></Icon>
                    </div>}
                    <h2 title={this.props.title}>{title}</h2>
                </div>
                <div className="bgImage" style={styles}></div>
                <div className="bottomLink">{this.props.linkText}</div>
            </div>
        );
    }
}
