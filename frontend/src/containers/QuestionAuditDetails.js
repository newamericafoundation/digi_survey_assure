import React from 'react';
import { connect } from 'react-redux';
import Api from '../helpers/api';
import { buildConfirmationLink } from '../helpers/blockchain';
import Header from '../components/Header';

class QuestionAuditDetails extends React.Component {
    state = {
        loaded: false,
        proof: null,
    };

    componentDidMount() {
        const { responseId } = this.props.match.params;

        this.getProofData(responseId);
    }

    getProofData(responseId) {
        new Api(`survey/response/${responseId}/proof`, 'get')
            .secure()
            .call()
            .then((proofData) => {
                this.setState({
                    loaded: true,
                    proof: proofData,
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
        if (!this.state.loaded) {
            return 'Loading...';
        }

        const merkleRootRecordedToChain = this.state.proof.blockchain ? this.state.proof.blockchain.merkle_root : 'Not recorded to chain.';

        return (
            <div>
                <Header surveyId={null}></Header>

                <div className="container noToc">
                    <p className="floatRight">
                        <a href={buildConfirmationLink(this.state.proof.blockchain.tx_id, this.state.proof.blockchain.network)} rel="noopener noreferrer" target="_blank">View Transaction on {this.state.proof.blockchain.network}</a>
                    </p>

                    <h2>Transaction Details</h2>
                    <div>
                        <pre>
                            {JSON.stringify(this.state.proof.blockchain, null, 2)}
                        </pre>
                    </div>

                    <h2>Merkle Proof</h2>
                    <p>Each element in the "Legible Hashed Data Array" below is individually hashed and then added to the merkle tree as a tree leaf (see "Merkle Tree Structure"). Hashing methodology used is SHA256. Once hashed, the merkle root is sent to the blockchain and can then be used to ensure that no leafs were tampered with at a later time.</p>

                    <p className="highlight"><span className="textBold">Merkle Root Sent to Chain:</span> <span className="code">{merkleRootRecordedToChain}</span></p>

                    <div className="auditLeft">
                        <h3>Legible Hashed Data Array</h3>
                        <pre>
                            {JSON.stringify(this.state.proof.surveyResponseAnswer, null, 2)}
                        </pre>
                    </div>
                    <div className="auditRight">
                        <h3>Merkle Tree Structure</h3>
                        <pre>
                            {this.state.proof.merkleTreeString}
                        </pre>
                    </div>
                    <div className="clear"></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(QuestionAuditDetails);
