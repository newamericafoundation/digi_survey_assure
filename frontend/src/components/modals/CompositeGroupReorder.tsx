import React from 'react';
import Api from '../../helpers/api';
import BaseModal from './BaseModal';
import { translate } from '../../helpers/localize';

export default class CompositeGroupReorder extends BaseModal {
    maxSteps = 1;

    fields = {
        composites: [],
    };

    constructor(props: any) {
        super(props);

        this.state = { ...this.baseState, ...this.fields };
    }

    async componentDidMount() {
        new Api(`survey/${this.props.subsetId}/compositeGroup/${this.props.supersetId}/composites`, 'get')
            .setPayload(this.state)
            .call()
            .then(async (response: any) => {
                this.setState({
                    composites: response,
                });
            })
            .catch((e: any) => {
                console.log(e);
            })
            .finally(() => {

            });
    }

    sendFields() {
        return {
            order: this.state.composites.map((aComp: any) => aComp.id),
        };
    }

    moveUp(id: number) {
        const compositeArray = this.state.composites;

        const index = compositeArray.findIndex((comp: any) => comp.id === id);

        if (index === 0) { return; }

        const finalArray = this.swapElements(compositeArray, index, index - 1);

        this.setState({
            composites: finalArray,
        })
    }

    moveDown(id: number) {
        const compositeArray = this.state.composites;

        const index = compositeArray.findIndex((comp: any) => comp.id === id);

        if (index === compositeArray.length - 1) {
            return;
        }

        const finalArray = this.swapElements(compositeArray, index, index + 1);

        this.setState({
            composites: finalArray,
        })
    }

    swapElements(array: any[], indexA: number, indexB: number) {
        const tmp = array[indexA];

        array[indexA] = array[indexB];
        array[indexB] = tmp;

        return array;
    }

    endpoint() {
        return `survey/${this.props.subsetId}/compositeGroup/${this.props.supersetId}/reorder`;
    }

    step(_stepNumber: number) {
        if (this.state.composites.length <= 0) {
            return translate('nothing_to_reorder');
        }

        const style = {
            width: "24px",
        };

        const compositeList: any[] = [];
        for (const aComp of this.state.composites) {
            compositeList.push(<li key={aComp.id} className="containerBox marginBottom12 compositeGroupSelect">
                <div className="floatRight">
                    <div className="inlineBlock marginLeft4" style={style} onClick={() => this.moveUp(aComp.id)}><i className="fi-arrow-up"></i></div>
                    <div className="inlineBlock marginLeft4" style={style} onClick={() => this.moveDown(aComp.id)}><i className="fi-arrow-down"></i></div>
                </div>
                {aComp.name}
            </li>);
        }

        return (
            <ul className="reorderList">
                {compositeList}
            </ul>
        );
    }

    preview() {
        const compositeList: any[] = [];
        for (const aComp of this.state.composites) {
            compositeList.push(<li key={aComp.id} className="containerBox marginBottom12 compositeGroupSelect">
                {aComp.name}
            </li>);
        }

        return (
            <ul className="reorderList">
                {compositeList}
            </ul>
        );
    }

    render() {
        return this.renderModal(translate('composite_group'));
    }
}
