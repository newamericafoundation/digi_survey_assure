import React from 'react';
import { connect } from 'react-redux';
import Api from '../helpers/api';
import Composite from '../components/Composite';
import CompositeGroupHeader from '../components/CompositeGroupHeader';
import Header from '../components/Header';
import SubHeader from '../components/SubHeader';
import TableOfContents from '../components/TableOfContents';
import Loader from '../components/Loader';

class SurveyCompositeGroup extends React.Component {
    state = {
        filterQueryString: null,
        loaded: false,
        compositeGroup: null,
        compositesInGroup: null,
    };

    componentDidUpdate(prevProps) {
        if (this.props.match.params.compositeGroupId !== prevProps.match.params.compositeGroupId) {
            this.getComponentGroup(this.props.match.params.compositeGroupId);
        }
    }

    componentDidMount() {
        const { compositeGroupId } = this.props.match.params;

        this.getComponentGroup(compositeGroupId);
    }

    getComponentGroup(compositeGroupId) {
        const { surveyId } = this.props.match.params;

        new Api(`survey/${surveyId}/compositeGroup/${compositeGroupId}/tree`, 'get')
            .secure()
            .call()
            .then((compositeGroup) => {
                this.setState({
                    loaded: true,
                    compositeGroup: compositeGroup,
                });
            })
            .catch((e) => {
                console.log('ERROR', e);
            })
            .finally(() => {
                // ...
            });
    }

    renderGroup(aComposite, baseLevel = false) {
        const { surveyId } = this.props.match.params;

        // Todo: convert this and the other instance where this happens to a translation helper function.
        // description: { "en": "...", "pl": "..." }
        const description = (aComposite.metadata && 'description' in aComposite.metadata)
            ? aComposite.metadata.description
            : null;

        const groupKey = `cg_${aComposite.id}`;

        const group = [];
        group.push(<CompositeGroupHeader
            key={groupKey}
            id={aComposite.id}
            surveyId={aComposite.survey_id}
            name={aComposite.name}
            description={description}
            baseLevel={baseLevel}></CompositeGroupHeader>);

        for (const compositeData of aComposite.composites) {
            const key = `comp_${compositeData.id}`;

            group.push(<Composite
                key={key}
                id={compositeData.id}
                surveyId={surveyId}
                filters={this.state.filterQueryString}></Composite>);
        }

        if (aComposite.children.length > 0) {
            for (const childComposite of aComposite.children) {
                group.push(this.renderGroup(childComposite));
            }
        }

        return group;
    }

    render() {
        if (!this.state.loaded) {
            return <Loader></Loader>;
        }

        const { surveyId } = this.props.match.params;

        const composites = [];
        for (const aComposite of this.state.compositeGroup) {
            composites.push(this.renderGroup(aComposite, true));
        }

        return (
            <div>
                <Header surveyId={surveyId}></Header>

                <SubHeader surveyId={surveyId}></SubHeader>

                <TableOfContents surveyId={surveyId}></TableOfContents>

                <div className="container">
                    {composites}
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

export default connect(mapStateToProps, mapDispatchToProps)(SurveyCompositeGroup);
