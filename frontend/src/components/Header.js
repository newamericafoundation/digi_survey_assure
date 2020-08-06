import React from 'react';
import { connect } from 'react-redux';
import Api from '../helpers/api';
import { Link } from 'react-router-dom';
import { changeLanguage, setActiveSurvey, toggleMenu } from '../actions/primaryActions';
import { translate } from '../helpers/localize';
import { getItem, setItem } from '../helpers/storage';

/*
interface IProps {
    page?: string;
    language?: string;
    activeSurvey?: any;
    surveyId?: number;
}
*/

class Header extends React.Component {
    state = {
        language: 'en',
        surveyData: null,
    };

    componentDidMount() {
        let currentLanguage = getItem('language');
        if (!currentLanguage) {
            currentLanguage = (this.props.language) ? this.props.language : this.state.language;
        }

        const activeSurvey = getItem('activeSurvey');
        if (activeSurvey) {
            this.setState({
                language: currentLanguage,
                surveyData: activeSurvey
            });
        } else {
            this.setState({
                language: currentLanguage
            });
        }
    }

    componentDidUpdate() {
        if (this.props.activeSurvey && +this.props.surveyId !== this.props.activeSurvey.id) {
            this.getSurveyMetadata(+this.props.surveyId);
        }
    }

    getSurveyMetadata(surveyId) {
        if (surveyId) {
            new Api(`survey/${surveyId}`, 'get')
                .call()
                .then((surveyData) => {
                    setItem('activeSurvey', surveyData);

                    this.props.setActiveSurvey(surveyData);

                    this.setState({
                        surveyData,
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

    handleClick() {
        this.props.toggleMenu();
    }

    handleLanguageChange(event) {
        setItem('language', event.target.value);

        this.setState({
            language: event.target.value
        });

        this.props.handleLanguageChange(event.target.value);
    }

    render() {
        let foundLanguages = false;
        let optionItems = '';
        if (this.state.surveyData && this.state.surveyData.metadata && "languages" in this.state.surveyData.metadata) {
            const languages = this.state.surveyData.metadata.languages;

            optionItems = languages.map((aLanguage) =>
                <option key={aLanguage} value={aLanguage}>{aLanguage}</option>
            );

            foundLanguages = true;
        }

        const breadcrumbs = [];
        if (this.state.surveyData && this.props.page !== 'surveyGroup') {
            if (this.props.page !== 'listSurveyGroups') {
                const groupLink = `/group/${this.state.surveyData.survey_group_id}`;
                const surveyLink = `/survey/${this.state.surveyData.id}`;

                breadcrumbs.push(<Link key="bc_group" to={groupLink}><b>{this.state.surveyData.surveyGroupName}</b></Link>);
                breadcrumbs.push(' / ');
                breadcrumbs.push(<Link key="bc_survey" to={surveyLink}>{this.state.surveyData.name}</Link>);
            }
        }

        const adminToken = getItem('adminToken');

        return (
            <div>
                <div className="header">
                    <div className="floatRight">
                        {foundLanguages && <select
                            value={this.state.language}
                            name="language"
                            onChange={this.handleLanguageChange.bind(this)}>
                            {optionItems}
                        </select>}
                    </div>
                    <Link key="home_link" to="/">{process.env.REACT_APP_NAME}</Link>
                </div>
                <div className="subHeader">
                    {adminToken && <div className="floatRight">
                        <span><Link to="/admin">{translate('setting', true)}</Link></span>
                    </div>}
                    {!adminToken && <div className="floatRight">
                        <span><Link to="/auth">{translate('login')}</Link></span>
                    </div>}

                    <div className="menuIcon" onClick={this.handleClick.bind(this)}>
                        <i className="step fi-list size-24"></i>
                    </div>

                    {this.state.surveyData && <div className="totalSurveyed">
                        {this.state.surveyData.responses} {translate('responses')}</div>}
                    {breadcrumbs.length > 0 && <div className="breadcrumbs">
                        {breadcrumbs}
                    </div>}
                    <div className="clear"></div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    language: state.primaryReducer.language,
    activeSurvey: state.primaryReducer.activeSurvey,
});

const mapDispatchToProps = dispatch => ({
    handleLanguageChange: (languageValue) => dispatch(changeLanguage(languageValue)),
    toggleMenu: () => dispatch(toggleMenu()),
    setActiveSurvey: (surveyData) => dispatch(setActiveSurvey(surveyData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
