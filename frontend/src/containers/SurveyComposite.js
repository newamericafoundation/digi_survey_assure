import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Api from '../helpers/api';
import Composite from '../components/Composite';
import SubHeader from '../components/SubHeader';
import Header from '../components/Header';
import TableOfContents from '../components/TableOfContents';
import { translate } from '../helpers/localize';

/**
 * Displays custom graphs, unrelated to the auditable data, which follow
 * specific equations/rules for generating the graphs.
 */
class Composites extends React.Component {
    state = {
        surveyId: null,
        composites: []
    };

    componentDidMount() {
        const { surveyId } = this.props.match.params;

        this.getCompositeData(surveyId, this.props.filterQueryString);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.filterQueryString !== prevProps.filterQueryString) {
            this.getCompositeData(this.state.surveyId, this.props.filterQueryString);
        }
    }

    getCompositeData(surveyId, filters = '') {
        new Api(`survey/${surveyId}/composite`, 'get')
            .call()
            .then((composites) => {
                this.setState({
                    composites,
                    filters,
                    surveyId
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
        const { surveyId } = this.props.match.params;

        const composites = [];
        this.state.composites.forEach(aComposite => {
            composites.push(<Composite
                key={aComposite.id}
                filters={this.state.filters}
                surveyId={aComposite.survey_id}
                detailed={false}
                id={aComposite.id}></Composite>);
        });

        const linkSurvey = `/survey/${this.state.surveyId}/questions`;

        return (
            <div>
                <Header surveyId={surveyId}></Header>

                <SubHeader surveyId={surveyId} aggregating={false}></SubHeader>

                <TableOfContents surveyId={surveyId}></TableOfContents>

                <div className="compositeList container">
                    <p className="fullSurveyLink"><Link to={linkSurvey}>{translate('view_full_survey')}</Link></p>

                    <h1>{translate('composite', true)}</h1>

                    {composites}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    filterQueryString: state.primaryReducer.filterQueryString,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Composites);
