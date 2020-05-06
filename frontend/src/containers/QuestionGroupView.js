import React from 'react';
import { connect } from 'react-redux';
import QuestionGroup from '../components/QuestionGroup';
import Header from '../components/Header';
import SubHeader from '../components/SubHeader';
import TableOfContents from '../components/TableOfContents';

class QuestionGroupView extends React.Component {
    render() {
        const { questionGroupId, surveyId } = this.props.match.params;

        return (
            <div>
                <Header surveyId={surveyId}></Header>

                <SubHeader surveyId={surveyId}></SubHeader>

                <TableOfContents surveyId={surveyId}></TableOfContents>

                <div className="container">
                    <QuestionGroup
                        key={questionGroupId}
                        groupId={questionGroupId}
                        filters={this.props.filterQueryString}></QuestionGroup>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        filterQueryString: state.primaryReducer.filterQueryString,
    }
};

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(QuestionGroupView);
