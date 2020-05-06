import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Api from '../helpers/api';
import { checkMobile } from '../helpers/mobile';
import { translate } from '../helpers/localize';
import AdminButton from '../components/AdminButton';
import Icon from '../components/Icon';
import { getItem } from '../helpers/storage';

class TableOfContents extends React.Component {
    state = {
        loaded: false,
        renderedToc: [],
        mobileMenu: false,
    };

    componentDidMount() {
        switch (this.props.level) {
            case 'app':
                this.getSurveyGroups();
                break;
            case 'surveyGroup':
                this.getSurveys();
                break;
            default:
                this.getTableOfContents(this.props.surveyId);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.mobileMenu !== this.props.mobileMenu) {
            this.setState({
                mobileMenu: this.props.mobileMenu
            });
        }

        if (this.props.survey !== prevProps.survey) {
            this.getTableOfContents(this.props.survey.id);
        }
    }

    getSurveys() {
        const toc = [];
        toc.push(this.topLevelHeading());

        new Api(`surveyGroup/${this.props.subsetId}/surveys`, 'get')
            .call()
            .then((tocResponse) => {
                for (const aSurvey of tocResponse) {
                    const surveyLink = `/survey/${aSurvey.id}`;
                    const key = `sur_${aSurvey.id}`;

                    toc.push(<li key={key} className="indentPlus">
                        <Link to={surveyLink}>{aSurvey.name}</Link>
                    </li>);
                }

                if (tocResponse.length > 0) {
                    toc.push(<li key="divide16734" className="divider"></li>);
                }

                if (getItem('adminToken')) {
                    toc.push(<li key="create_survey" className="indentPlus">
                        <AdminButton action="survey-create" subsetId={this.props.subsetId}></AdminButton>
                    </li>);
                }

                this.setState({
                    loaded: true,
                    renderedToc: toc,
                });
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                // ...
            });
    }

    getSurveyGroups() {
        const toc = [];

        toc.push(this.topLevelHeading());

        new Api(`surveyGroup`, 'get')
            .call()
            .then((tocResponse) => {
                for (const aSurveyGroup of tocResponse) {
                    const surveyGroupLink = `/group/${aSurveyGroup.id}`;
                    const key = `sg_${aSurveyGroup.id}`;

                    toc.push(<li key={key} className="indentPlus" >
                        <Link to={surveyGroupLink}>{aSurveyGroup.name}</Link>
                    </li >);
                }

                if (tocResponse.length > 0) {
                    toc.push(<li key="divide13562" className="divider"></li>);
                }

                if (getItem('adminToken')) {
                    toc.push(<li key="create_sg" className="indentPlus">
                        <AdminButton action="surveyGroup-create"></AdminButton>
                    </li>);
                }

                this.setState({
                    loaded: true,
                    renderedToc: toc,
                });
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                // ...
            });
    }

    topLevelHeading() {
        return (<li key="tocheading1" className="heading1">
            <Icon icon="list-thumbnails" bgColor="#424141" iconSize={14}></Icon>Table of Contents
        </li>);
    }

    getTableOfContents(surveyId) {
        this.setState({
            loaded: false,
            renderedToc: [],
        });

        const surveyData = getItem('activeSurvey');

        const toc = [];

        toc.push(this.topLevelHeading());

        if (surveyData && 'surveyGroupName' in surveyData) {
            const surveyGroupLink = `/group/${surveyData.survey_group_id}`;
            toc.push(<li key="tocheading2" className="heading2">
                <Icon icon="eye" bgColor="#A2A2A2" iconSize={14}></Icon><Link to={surveyGroupLink}>{surveyData.surveyGroupName}</Link>
            </li>);

            const surveyLink = `/survey/${surveyData.id}`;
            toc.push(<li key="tocheading3" className="heading3">
                <Icon icon="graph-bar" bgColor="#828282" iconSize={14}></Icon><Link to={surveyLink}>{surveyData.name}</Link>
            </li>);
        }

        new Api(`survey/${surveyId}/toc`, 'get')
            .call()
            .then((tocResponse) => {
                const allView = `/survey/${this.props.surveyId}/questions`;

                if (tocResponse.compositeGroups.length > 0) {
                    for (const compositeGroup of tocResponse.compositeGroups) {
                        const qgLink = `/survey/${this.props.surveyId}/compositeGroup/${compositeGroup.id}`;

                        let icon = null;
                        if ('icon' in compositeGroup.metadata) {
                            const bgColor = (compositeGroup.metadata && 'bgColor' in compositeGroup.metadata)
                                ? compositeGroup.metadata.bgColor
                                : null;

                            icon = (
                                <Icon icon={compositeGroup.metadata.icon} iconSize={14} bgColor={bgColor}></Icon>
                            );
                        }

                        const compGroupKey = `comp_group_${compositeGroup.id}`;
                        toc.push(<li key={compGroupKey}>
                            <Link to={qgLink}>{icon}{compositeGroup.name}</Link>
                        </li>);
                    }
                }

                // Composite Admin Functionality
                if (getItem('adminToken')) {
                    toc.push(<li key="create_comp_group" className="indentPlus">
                        <div className="marginBottom8">
                            <AdminButton action="compositeGroup-create" subsetId={this.props.surveyId}></AdminButton>
                        </div>
                        <AdminButton action="composite-create" subsetId={this.props.surveyId}></AdminButton>
                    </li>);
                }

                toc.push(<li key="divide1" className="divider"></li>);

                // Has Composites?
                if (tocResponse.hasComposites) {
                    const compLink = `/survey/${this.props.surveyId}/composites`;

                    toc.push(<li key="allComps">
                        <Link to={compLink}><Icon icon="layout" iconSize={14} bgColor="#C4C4C4"></Icon>{translate('composites_all')}</Link>
                    </li>);
                }

                // Link to all questions on the survey on one page
                toc.push(<li key="all">
                    <Icon icon="thumbnails" bgColor="#C4C4C4" iconSize={14}></Icon><Link to={allView}>{translate('questions_all')}</Link>
                </li>);

                // Question Groups on Survey
                if (tocResponse.questionGroups.length > 0) {
                    for (const questionGroup of tocResponse.questionGroups) {
                        const qgLink = `/survey/${this.props.surveyId}/questionGroup/${questionGroup.id}`;
                        toc.push(<li className="indentSmall" key={questionGroup.id}>
                            <Link to={qgLink}>{questionGroup.name}</Link>
                        </li>);
                    }
                }

                // Surveys In Survey Group
                if (tocResponse.surveysInGroup.length > 1) {
                    toc.push(<li key="divide2" className="divider"></li>);

                    // TODO: Disabled for initial release until question mapping becomes possible.
                    // const aggLink = `/survey/${this.props.surveyId}/aggregates`;
                    // toc.push(<li key="aggs"><Link to={aggLink}>{translate('aggregates')}</Link></li>);

                    for (const survey of tocResponse.surveysInGroup) {
                        if (survey.id === surveyData.id) {
                            continue;
                        }

                        const surveyLink = `/survey/${survey.id}`;
                        const key = `survey_${survey.id}`;

                        toc.push(<li key={key} className="heading3">
                            <Icon icon="graph-bar" bgColor="#828282" iconSize={14}></Icon><Link to={surveyLink}>{survey.name}</Link>
                        </li>);
                    }
                }

                this.setState({
                    loaded: true,
                    renderedToc: toc,
                });
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                // ...
            });
    }

    render() {
        // Todo: update since this is always >0 due to admin buttons.
        if (this.state.loaded && this.state.renderedToc.length > 0) {
            const menuStyles = (!checkMobile())
                ? { display: "block" }
                : this.state.mobileMenu ? { display: "block" } : { display: "none" };

            return (
                <div className="tableOfContents" style={menuStyles}>
                    <ul>
                        {this.state.renderedToc}
                    </ul>
                </div>
            );
        } else {
            return '';
        }
    }
}

const mapStateToProps = (state) => {
    return {
        mobileMenu: state.primaryReducer.mobileMenu,
        survey: state.primaryReducer.activeSurvey,
    }
};

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TableOfContents);
