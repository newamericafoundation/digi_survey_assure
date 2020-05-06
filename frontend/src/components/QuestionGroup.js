import React from 'react';
import Question from './Question';
import Api from '../helpers/api';
import Loader from './Loader';
import AdminButton from './AdminButton';

export default class QuestionGroup extends React.Component {
    state = {
        questionGroup: null,
        questions: [],
        filters: '',
        aggregate: false,
    }

    componentDidMount() {
        this.getQuestionGroup(this.props.groupId);
    }

    async getQuestionGroup(questionGroupId) {
        new Api(`questionGroup/${questionGroupId}`, 'get')
            .secure()
            .call()
            .then((questionGroup) => {
                new Api(`questionGroup/${questionGroupId}/questions`, 'get')
                    .secure()
                    .call()
                    .then((questions) => {
                        this.setState({
                            questions,
                            questionGroup,
                            aggregate: (this.props.aggregate) ? true : false,
                        });
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            })
            .catch((e) => {
                console.log(e);
            });
    }

    render() {
        if (!this.state.questionGroup || !this.state.questions) {
            return <Loader></Loader>;
        }

        let formattedQuestions = [];
        let index = 0;
        let current = 0;
        for (const question of this.state.questions) {
            current += 1;

            // I'm sure there's a better CSS way to do this but for now this
            // gets the job done. We're basically making sure there isn't a
            // empty whitespace if the 2nd element in a row is "spanEntireRow".
            // In those situations we make sure the 1st and 2nd graphs take
            // up the entire row.
            let spanEntireRow = false;
            if (current % 2 !== 0) {
                const nextItem = this.state.questions[index + 1];
                if ((question.metadata && 'spanEntireRow' in question.metadata && question.metadata.spanEntireRow)) {
                    spanEntireRow = true;
                } else if (nextItem) {
                    spanEntireRow = (nextItem.metadata && 'spanEntireRow' in nextItem.metadata && nextItem.metadata.spanEntireRow) ? true : false;
                }
            } else {
                spanEntireRow = (question.metadata && 'spanEntireRow' in question.metadata && question.metadata.spanEntireRow) ? true : false;
            }

            formattedQuestions.push(<Question
                filters={this.props.filters}
                key={question.id}
                questionId={question.id}
                spanEntireRow={spanEntireRow}
                surveyId={question.survey_id}
                aggregate={this.state.aggregate}></Question>);

            index += 1;
        }

        return (
            <div>
                <div className="question-group">
                    <div className="floatRight">
                        <AdminButton
                            action="questionGroup-public"
                            secondaryButton={true}
                            size={12}
                            icon="eye"
                            subsetId={this.props.groupId}></AdminButton>
                    </div>
                    <h2>{this.state.questionGroup.name}</h2>

                    <div className="gridLayout">
                        {formattedQuestions}
                    </div>
                </div>
            </div >
        );
    }
}
