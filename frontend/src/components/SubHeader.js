import React from 'react';
import Api from '../helpers/api';
import SurveyFilter from '../components/SurveyFilter';
import { accessLevelChange, filterChangeSubmit } from '../actions/primaryActions';
import { connect } from 'react-redux';
import { setItem } from '../helpers/storage';
import { translate } from '../helpers/localize';
import { checkMobile } from '../helpers/mobile';

class SubHeader extends React.Component {
    state = {
        aggregating: false,
        surveyId: null,
        availableFilters: 0,
        error: '',
        showFilters: 'hide',
        showPassword: 'hide',
    };

    constructor() {
        super();

        if (!checkMobile()) {
            this.state.showFilters = 'show';
            this.state.showPassword = 'show';
        }
    }

    componentDidMount() {
        const { surveyId, aggregating } = this.props;

        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handlePasswordInput = this.handlePasswordInput.bind(this);
        this.handleFiltering = this.handleFiltering.bind(this);

        if (!aggregating) {
            // TODO: GET /survey/${surveyId}/responseCount
            // Store to ensure this only goes off once.

            new Api(`survey/${surveyId}/filters`, 'get')
                .call()
                .then((surveyFilters) => {
                    const filters = [];

                    surveyFilters.forEach(aFilter => {
                        filters.push(<div key={aFilter.filter.id}><SurveyFilter
                            filterId={aFilter.filter.id}
                            label={aFilter.filter.label}
                            options={aFilter.options}></SurveyFilter></div>);
                    });

                    this.setState({
                        availableFilters: surveyFilters,
                        renderedFilters: filters,
                    });
                })
                .catch((e) => {
                    console.log(e);
                })
                .finally(() => {
                    // ...
                });
        }
    }

    handleFiltering(event) {
        event.preventDefault();

        this.props.submitFilterChanges();
    }

    handlePasswordChange(event) {
        this.setState({ accessWord: event.target.value });
    }

    async handlePasswordInput(event) {
        event.preventDefault();

        this.setState({
            questionGroups: []
        });

        new Api(`survey/${this.props.surveyId}/requestAccess`, 'post')
            .setPayload({
                password: this.state.accessWord
            })
            .call()
            .then((response) => {
                setItem('token', response);

                this.props.handleAccessLevelChange(response);

                this.setState({
                    accessWord: '',
                    error: '',
                });
            })
            .catch((e) => {
                this.setState({
                    error: 'Incorrect password.'
                });

                console.log(e);
            })
            .finally(() => {
                // ...
            });
    }

    showFilters() {
        if (this.state.showFilters === 'show') {
            this.setState({ showFilters: 'hide' });
        } else {
            this.setState({ showFilters: 'show' });
        }
    }

    showPassword() {
        if (this.state.showPassword === 'show') {
            this.setState({ showPassword: 'hide' });
        } else {
            this.setState({ showPassword: 'show' });
        }
    }

    render() {
        const showFilters = `filters ${this.state.showFilters}`;
        // const showPassword = `password-input ${this.state.showPassword}`;

        if (this.state.availableFilters.length < 1) {
            return '';
        }

        return (
            <div>
                <div className="subOptions">
                    <div className="passwordIcon" onClick={this.showPassword.bind(this)}>
                        <i className="step fi-lock size-24"></i>
                    </div>
                    <div className="filterIcon" onClick={this.showFilters.bind(this)}>
                        <i className="step fi-filter size-24"></i>
                    </div>

                    {/* <div className={showPassword}>
                        <form onSubmit={this.handlePasswordInput}>
                            <input
                                type="text"
                                value={this.state.accessWord}
                                placeholder={translate('password_input_placeholder')}
                                onChange={this.handlePasswordChange}
                            /> <button type="submit">{translate('submit')}</button> {this.state.error}
                        </form>
                    </div> */}

                    <form onSubmit={this.handleFiltering}>
                        {this.state.availableFilters.length > 0 && <div className={showFilters}>
                            {this.state.renderedFilters}
                            <div>
                                <button type="submit">{translate('apply')}</button>
                            </div>
                        </div>}
                    </form>

                    <div className="clear"></div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    ...state
});

const mapDispatchToProps = dispatch => ({
    handleAccessLevelChange: (jwt) => dispatch(accessLevelChange(jwt)),
    submitFilterChanges: () => dispatch(filterChangeSubmit())
});

export default connect(mapStateToProps, mapDispatchToProps)(SubHeader);
