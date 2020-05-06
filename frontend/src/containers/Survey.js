import React from 'react';
import { connect } from 'react-redux';
import Api from '../helpers/api';
import QuestionGroup from '../components/QuestionGroup';
import SubHeader from '../components/SubHeader';
import Header from '../components/Header';
import Loader from '../components/Loader';
import TableOfContents from '../components/TableOfContents';

class Survey extends React.Component {
    state = {
        accessToken: null,
        displayName: '',
        displayDescription: '',
        aggregate: false,
        loaded: false,
        filters: '',
        surveyId: null,
        survey: {
            name: null,
            description: null,
        },
        questionGroups: [],
    };

    componentDidMount() {
        const { surveyId } = this.props.match.params;

        if (this.props.aggregate) {
            this.setState({
                aggregate: true
            });
        }

        this.getPublicData(surveyId);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.accessToken !== prevProps.accessToken) {
            this.getPublicData(this.state.surveyId, this.props.filterQueryString);
        }
    }

    async getPublicData(surveyId, filters) {
        this.setState({
            surveyId: surveyId,
            filters: filters,
            accessToken: null,
            loaded: false,
        });

        new Api(`survey/${surveyId}?${filters}`, 'get')
            .call()
            .then((surveyData) => {
                if (this.state.aggregate) {
                    this.setState({
                        displayName: surveyData.surveyGroupName,
                        displayDescription: surveyData.surveyGroupDescription,
                    });
                } else {
                    this.setState({
                        displayName: surveyData.name,
                        displayDescription: surveyData.description,
                    });
                }

                new Api(`survey/${surveyId}/questionGroups`, 'get')
                    .secure()
                    .call()
                    .then((questionGroups) => {
                        this.setState({
                            loaded: true,
                            survey: surveyData,
                            questionGroups
                        });
                    })
                    .catch((e) => {
                        console.log('ERROR B', e);
                    })
                    .finally(() => {
                        // ...
                    });
            })
            .catch((e) => {
                console.log('ERROR A', e);
            })
            .finally(() => {
                // ...
            });
    }

    render() {
        let questionGroups = [];
        if (this.state.loaded) {
            this.state.questionGroups.forEach(questionGroup => {
                questionGroups.push(<QuestionGroup
                    key={questionGroup.id}
                    groupId={questionGroup.id}
                    aggregate={this.state.aggregate}
                    filters={this.state.filters}></QuestionGroup>);
            });
        }

        if (!this.state.surveyId) {
            return <Loader></Loader>
        }

        return (
            <div>
                <Header surveyId={this.state.surveyId}></Header>

                <SubHeader
                    surveyId={this.state.surveyId}
                    aggregating={this.state.aggregate}></SubHeader>

                <TableOfContents surveyId={this.state.surveyId}></TableOfContents>

                <div className="container">
                    {questionGroups}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        filterQueryString: state.primaryReducer.filterQueryString,
        accessToken: state.primaryReducer.accessToken,
    }
};

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Survey);
