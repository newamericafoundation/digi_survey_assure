import React from 'react';
import Api from '../helpers/api';
import { Link, Redirect } from 'react-router-dom';
import { translate } from '../helpers/localize';
import { setItem } from '../helpers/storage';

export default class Authentication extends React.Component {
    state = {
        username: '',
        password: '',
        loggedIn: false,
        error: null,
    };

    constructor() {
        super();

        this.performLogin = this.performLogin.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    performLogin(event) {
        event.preventDefault();

        if (!this.state.username || !this.state.password) {
            this.setState({
                error: 'Username and password are required!',
            });

            return;
        }

        new Api(`auth`, 'post')
            .setPayload({
                username: this.state.username,
                password: this.state.password,
            })
            .call()
            .then((response) => {
                setItem('adminToken', response);

                this.setState({
                    error: null,
                    loggedIn: true,
                });
            })
            .catch((e) => {
                this.setState({
                    error: 'Incorrect credentials.'
                });

                console.log(e);
            })
            .finally(() => {
                // ...
            });
    }

    handleUsernameChange(event) {
        this.setState({ username: event.target.value });
    }

    handlePasswordChange(event) {
        this.setState({ password: event.target.value });
    }

    render() {
        if (this.state.loggedIn) {
            return <Redirect to='/' />
        }

        return (
            <div className="subPage">
                {this.state.error && <div className="errorBubble">
                    {this.state.error}
                </div>}
                <div className="loginBox form">
                    <h1>{translate('login')}</h1>

                    <form onSubmit={this.performLogin}>
                        <div className="loginForm">
                            <label>Username</label>
                            <input
                                type="text"
                                value={this.state.username}
                                onChange={this.handleUsernameChange}
                                autoCorrect="off"
                                autoCapitalize="none"
                            />

                            <label>Password</label>
                            <input
                                type="password"
                                value={this.state.password}
                                onChange={this.handlePasswordChange}
                            />

                            <div>
                                <button className="adminButton" type="submit">{translate('login')}</button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="loginFooter">
                    <Link to="/">{translate('back_to_app')}</Link>
                </div>

            </div>
        );
    }
}
