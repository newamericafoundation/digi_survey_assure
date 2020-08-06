import React from 'react';
import { connect } from 'react-redux';
import { Tr, Td } from 'react-super-responsive-table';
import Api from '../helpers/api';
import { buildConfirmationLink } from '../helpers/blockchain';
import { Link } from 'react-router-dom';

class SurveyFilter extends React.Component {
    state = {
        loaded: false,
        auditData: null,
        answerData: null,
    };

    componentDidMount() {
        new Api(`question/${this.props.questionId}/response/${this.props.auditData.id}`, 'get')
            .secure()
            .call()
            .then((answerData) => {
                this.setState({
                    answerData: answerData,
                    auditData: this.props.auditData,
                    loaded: true,
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
        if (this.state.loaded) {
            const merkleProofView = `/survey/${this.props.surveyId}/audit/${this.props.auditData.id}`;

            if (this.state.answerData) {
                const dateRecordedAt = new Date(this.state.auditData.recorded_at).toISOString().split('T')[0];
                const dateCapturedIntoSA = new Date(this.state.auditData.created_at).toISOString().split('T')[0];
                const dateSentToChain = new Date(this.state.auditData.date_sent_to_chain).toISOString().split('T')[0];

                return (
                    <Tr>
                        <Td className="limitText"><a href={buildConfirmationLink(this.state.auditData.tx_id, this.state.auditData.network)} rel="noopener noreferrer" target="_blank">{this.state.auditData.tx_id}</a></Td>
                        <Td>{dateRecordedAt}</Td>
                        <Td>{dateCapturedIntoSA}</Td>
                        <Td>{dateSentToChain}</Td>
                        <Td>{this.state.answerData.legible_value}</Td>
                        <Td><Link to={merkleProofView}>{this.state.auditData.merkle_root.substr(0, 35)}...</Link></Td>
                    </Tr>
                );
            } else {
                return '';
            }
        } else {
            return '';
        }
    }
}

const mapStateToProps = (state) => {
    return {
        filters: state.filters
    }
};

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SurveyFilter);
