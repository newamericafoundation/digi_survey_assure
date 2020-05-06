import React from 'react';
import Api from '../helpers/api';
import { translate } from '../helpers/localize'
import Loader from '../components/Loader';
import QuestionGroup from '../components/QuestionGroup';
import Header from '../components/Header';
import TableOfContents from '../components/TableOfContents';

export default class SurveyAggregate extends React.Component {
    state = {
        surveyId: null,
        survey: {
            name: null,
            description: null,
        },
        questionGroups: [],
        foundAggregates: false,
        loading: true,
        accessWord: '',
    };

    componentDidMount() {
        const { surveyId } = this.props.match.params;

        this.getPublicData(surveyId);
    }

    async getPublicData(surveyId) {
        new Api(`survey/${surveyId}/questionGroups`, 'get')
            .secure()
            .call()
            .then((questionGroups) => {
                this.setState({
                    questionGroups,
                    surveyId: surveyId,
                    accessWord: '',
                    loading: false,
                    foundAggregates: true,
                });
            })
            .catch((e) => {
                console.log('ERROR', e);

                this.setState({
                    loading: false,
                    foundAggregates: false,
                });
            })
            .finally(() => {
                // ...
            });
    }

    render() {
        let questionGroups = [];
        this.state.questionGroups.forEach(questionGroup => {
            questionGroups.push(<QuestionGroup
                key={questionGroup.id}
                groupId={questionGroup.id}
                aggregate={true}></QuestionGroup>);
        });

        if (this.state.loading) {
            return <Loader></Loader>
        } else {
            if (this.state.foundAggregates) {
                return (
                    <div>
                        <Header surveyId={this.state.surveyId}></Header>

                        <TableOfContents surveyId={this.state.surveyId}></TableOfContents>

                        <div className="container">
                            {questionGroups}
                        </div>
                    </div>
                );
            } else {
                return (
                    <div>
                        <Header surveyId={this.state.surveyId}></Header>

                        <TableOfContents surveyId={this.state.surveyId}></TableOfContents>

                        <div className="container">
                            {translate('aggregates_not_found')}
                        </div>
                    </div>);
            }
        }
    }
}
