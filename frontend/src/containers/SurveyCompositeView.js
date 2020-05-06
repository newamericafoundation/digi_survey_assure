import React from 'react';
import Composite from '../components/Composite';
import Header from '../components/Header';
import SubHeader from '../components/SubHeader';
import TableOfContents from '../components/TableOfContents';

export default class QuestionGroup extends React.Component {
    state = {
        compositeId: null,
        surveyId: null,
        filters: '',
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {
        // New filters have been applied
        if (this.props.filterQueryString !== prevProps.filterQueryString) {
            this.setState({
                filters: this.props.filterQueryString
            });
        }
    }

    render() {
        const { surveyId, compositeId } = this.props.match.params;

        return (
            <div>
                <Header surveyId={surveyId}></Header>

                {surveyId && <SubHeader
                    surveyId={surveyId}
                    aggregating={false}></SubHeader>}

                <TableOfContents surveyId={surveyId}></TableOfContents>

                <div className="container">
                    <Composite
                        surveyId={surveyId}
                        id={compositeId}
                        filters={this.state.filters}
                        detailed={true}></Composite>
                </div>
            </div>
        )
    }
}
