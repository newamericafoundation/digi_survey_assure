import React from 'react';
import Api from '../helpers/api';
import Header from '../components/Header';
import { translate } from '../helpers/localize';
import { grabKeyFromMetadata } from '../helpers/metadata';
import DisplayBox from '../components/DisplayBox';
import Loader from '../components/Loader';
import TableOfContents from '../components/TableOfContents';
import AdminButton from '../components/AdminButton';

/**
 * List of surveys in a survey group
 */
export default class SurveyGroup extends React.Component {
    state = {
        groupId: null,
        surveyGroup: {},
        surveys: [],
        loading: true,
    }

    componentDidMount() {
        const { groupId } = this.props.match.params;

        this.getSurveysInGroup(groupId);
    }

    getSurveysInGroup(groupId) {
        new Api(`surveyGroup/${groupId}`, 'get')
            .call()
            .then((surveyGroup) => {
                new Api(`surveyGroup/${groupId}/surveys`, 'get')
                    .call()
                    .then((surveys) => {
                        this.setState({
                            surveys,
                            surveyGroup,
                            loading: false,
                        });
                    })
                    .catch((e) => {
                        console.log(e);
                    })
                    .finally(() => {
                        // ...
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
        if (this.state.loading) {
            return <Loader></Loader>;
        }

        let formattedSurveys = [];

        this.state.surveys.forEach(survey => {
            const link = `/survey/${survey.id}`;
            const bgImage = (survey.metadata && 'image' in survey.metadata) ? survey.metadata.image : null;
            const icon = (survey.metadata && 'icon' in survey.metadata) ? survey.metadata.icon : null;

            formattedSurveys.push(<DisplayBox
                key={survey.id}
                title={survey.name}
                icon={icon}
                maxLength={35}
                linkText={translate('view_survey')}
                bgImage={bgImage}
                link={link}></DisplayBox>);
        });

        const splashImage = grabKeyFromMetadata('image', this.state.surveyGroup.metadata);
        const splashImageStyle = (splashImage) ? { backgroundImage: `url(${splashImage})` } : null;

        // Todo: use the same localization checker as survey splash for this.
        const description = this.state.surveyGroup.description.split("\n").map((item, i) => { return <p key={i}>{item}</p>; });

        const { groupId } = this.props.match.params;

        return (
            <div>
                <Header page="surveyGroup"></Header>

                <TableOfContents level="surveyGroup" subsetId={groupId}></TableOfContents>

                <div className="container">
                    <div className="floatRight">
                        <AdminButton
                            action="surveyGroup-edit"
                            secondaryButton={true}
                            subsetId={groupId}></AdminButton>
                    </div>
                    <h1>{this.state.surveyGroup.name}</h1>
                    {description}

                    {splashImageStyle && <div className="splashImage" style={splashImageStyle}></div>}

                    <h2 className="marginTop24">{translate('survey_recent')}</h2>
                    <div className="grid3Wrapper">
                        {formattedSurveys}
                    </div>
                </div>
            </div>
        );
    }
}
