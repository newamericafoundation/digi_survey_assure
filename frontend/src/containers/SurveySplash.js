import React from 'react';
import { connect } from 'react-redux';
import { toggleMenu } from '../actions/primaryActions';
import { grabKeyFromMetadata } from '../helpers/metadata';
import Header from '../components/Header';
import TableOfContents from '../components/TableOfContents';
import AdminButton from '../components/AdminButton';
import Loader from '../components/Loader';

class SurveySplash extends React.Component {
    state = {
        survey: null,
        language: process.env.REACT_APP_DEFAULT_LOCALE,
    };

    componentDidUpdate(prevProps) {
        if (this.props.survey !== prevProps.survey) {
            this.setState({
                survey: this.props.survey
            });
        }

        if (this.props.language !== prevProps.language) {
            this.setState({
                language: this.props.language
            });
        }
    }

    componentDidMount() {
        this.setState({
            survey: this.props.survey
        });
    }

    render() {
        if (!this.state.survey) {
            return <Loader></Loader>;
        }

        const { surveyId } = this.props.match.params;

        // Todo: convert this into a more generic localization tool.
        let description = this.state.survey.description;
        if (this.state.language) {
            if (this.state.survey.metadata && 'description' in this.state.survey.metadata) {
                if (this.state.survey.metadata.description[this.state.language]) {
                    description = this.state.survey.metadata.description[this.state.language];
                } else if (typeof this.state.survey.metadata.description === 'object') {
                    description = Object.keys(this.state.survey.metadata.description)[0];
                } else {
                    description = this.state.survey.metadata.description;
                }
            }
        }
        if (description) {
            description = description.split("\n").map((item, i) => { return <p key={i}>{item}</p>; });
        }

        const splashImage = grabKeyFromMetadata('image', this.state.survey.metadata);
        const splashImageStyle = (splashImage) ? { backgroundImage: `url(${splashImage})` } : null;

        return (
            <div>
                <Header surveyId={surveyId}></Header>

                <TableOfContents surveyId={surveyId}></TableOfContents>

                <div className="container">
                    <div className="floatRight">
                        <AdminButton
                            action="survey-filters"
                            icon="filter"
                            secondaryButton={true}
                            subsetId={surveyId}
                            inline={true}></AdminButton>
                        <AdminButton
                            action="survey-edit"
                            secondaryButton={true}
                            subsetId={surveyId}
                            inline={true}></AdminButton>
                    </div>
                    <h1>{this.state.survey && this.state.survey.name}</h1>

                    {description}

                    {splashImageStyle && <div className="splashImage" style={splashImageStyle}></div>}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        mobileMenu: state.primaryReducer.mobileMenu,
        survey: state.primaryReducer.activeSurvey,
        language: state.primaryReducer.language,
    }
};

const mapDispatchToProps = dispatch => ({
    toggleMenu: () => dispatch(toggleMenu()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SurveySplash);
