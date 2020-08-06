// import queryString from 'query-string';
import React from 'react';
import { connect } from 'react-redux';
import Api from '../helpers/api';
import AuditTableEntry from '../components/AuditTableEntry';
import Header from '../components/Header';
import SubHeader from '../components/SubHeader';
import Question from '../components/Question';
import { Table, Thead, Tbody, Tr, Th } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { translate } from '../helpers/localize';
import Loader from '../components/Loader';
import TableOfContents from '../components/TableOfContents';
import { checkMobile } from '../helpers/mobile';

class QuestionAudit extends React.Component {
    state = {
        loaded: false,
        question: {},
        audit: {},
        surveyGroup: {},
        survey: {},
        totalResponses: 0,
        isMobile: false,
    };

    constructor(props) {
        super(props);

        this.goBack = this.goBack.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.language !== this.props.language) {
            this.getQuestionData(this.getQuestionId());
        }
    }

    getQuestionId() {
        return 'match' in this.props ? this.props.match.params.questionId : null;
    }

    componentDidMount() {
        if (checkMobile()) {
            this.setState({
                isMobile: true,
                loaded: true,
            });
        } else {
            const questionId = this.getQuestionId();
            if (!questionId) {
                // Todo: make this work...
                console.log('ENTERED FROM OUTSIDE REACT ROUTE');
            }

            this.getQuestionData(questionId);
        }
    }

    getQuestionData(questionId) {
        this.setState({
            loaded: false,
        });

        new Api(`question/${questionId}/audit`, 'get')
            .secure()
            .call()
            .then((auditData) => {
                this.setState({
                    loaded: true,
                    question: auditData.question,
                    audit: auditData.responses,
                    survey: auditData.survey,
                    surveyGroup: auditData.group,
                    totalResponses: auditData.responses.length,
                });
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                // ...
            });
    }

    goBack() {
        this.props.history.goBack();
    }

    render() {
        if (this.state.isMobile) {
            return (
                <div>
                    <Header surveyId={this.state.survey.id}></Header>

                    <TableOfContents surveyId={this.state.survey.id}></TableOfContents>

                    <div className="container">
                        <p>{translate('audit_desktop_only')}</p>

                        <button onClick={this.goBack}>Go Back</button>
                    </div>
                </div>
            );
        }

        const auditableData = [];
        if (this.state.loaded) {
            this.state.audit.forEach(auditEntry => {
                auditableData.push(
                    <AuditTableEntry
                        key={auditEntry.id}
                        surveyId={this.state.survey.id}
                        questionId={this.state.question.id}
                        auditData={auditEntry}></AuditTableEntry>
                );
            });
        }

        if (!this.state.loaded) {
            return (
                <div className="placeholderBox">
                    <Loader></Loader>
                </div >
            );
        }

        return (
            <div>
                <Header surveyId={this.state.survey.id}></Header>

                {this.state.question.survey_id && <SubHeader
                    surveyId={this.state.question.survey_id}
                    aggregating={this.state.aggregate}></SubHeader>}

                <TableOfContents surveyId={this.state.survey.id}></TableOfContents>

                <div className="container">
                    {this.state.question && <Question
                        filters={this.props.filterQueryString}
                        key={this.state.question.id}
                        surveyId={this.state.survey.id}
                        hideAudit={true}
                        questionId={this.state.question.id}
                        aggregate={this.state.aggregate}></Question>}
                </div>

                <div className="container">
                    <div className="surveyOverviewData">
                        <span>{translate('source')}: {this.state.surveyGroup.source_plugin}</span>
                        <span>{translate('source_id')}: {this.state.survey.external_source_id}</span>
                    </div>

                    <h2 className="marginBottomNone">{translate('blockchain_hash_summary')}</h2>

                    <Table>
                        <Thead>
                            <Tr>
                                <Th>{translate('transaction')}</Th>
                                <Th>{translate('date_recorded')}</Th>
                                <Th>{translate('answer')}</Th>
                                <Th>{translate('merkle_root')}</Th>
                            </Tr>
                        </Thead>
                        <Tbody>{auditableData}</Tbody>
                    </Table>
                </div>

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        filterQueryString: state.primaryReducer.filterQueryString,
        language: state.primaryReducer.language
    }
};

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(QuestionAudit);
