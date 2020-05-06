import React from 'react';
import Api from '../../../helpers/api';
import { translate } from '../../../helpers/localize';

interface IProps {
    handleCategorySelect: Function;
    surveyId?: number;
    excludedId?: number;
    selectedId?: number;
}

export default class CompositeGroupSelect extends React.Component<IProps> {
    state = {
        loading: true,
        category: '',
        categoryRaw: '',
        selectData: '',
        rawCompositeGroups: [],
    };

    componentDidMount() {
        this.fetchCompositeGroups();
    }

    fetchCompositeGroups() {
        new Api(`survey/${this.props.surveyId}/compositeGroup`, 'get')
            .call()
            .then((response: any) => {
                let categoryRaw = '';

                if (this.props.selectedId) {
                    const found = response.filter((entry: any) => entry.id === this.props.selectedId);

                    if (found.length > 0) {
                        categoryRaw = `${found[0].id},${found[0].name}`;
                    }
                }

                this.setState({
                    selectData: this.buildDropdown(response),
                    rawCompositeGroups: response,
                    categoryRaw: categoryRaw,
                });
            })
            .catch((e: any) => {
                console.log(e);
            })
            .finally(() => {
                this.setState({
                    loading: false,
                })
            });
    }

    buildDropdown(categories: any[], level = 0): any[] {
        let tree: any[] = [];

        for (const anItem of categories) {
            if (this.props.excludedId && anItem.id === this.props.excludedId) {
                continue;
            }

            let tempLevel = level;
            let dashes = ''
            while (tempLevel > 0) {
                dashes = '-' + dashes;
                tempLevel--;
            }

            const name = (dashes) ? `${dashes} ${anItem.name}` : anItem.name;
            const value = `${anItem.id},${anItem.name}`;
            tree.push(<option key={anItem.id} value={value}>{name}</option>);

            if ('children' in anItem && anItem.children.length > 0) {
                const nextLevel = level + 2;

                const children = this.buildDropdown(anItem.children, nextLevel);

                tree = [...tree, ...children];
            }
        }

        return tree;
    }

    handleCategoryChange(selectedValue: string) {
        const split = selectedValue.split(',');

        const value = split[0];
        split.shift();
        const name = split.join(',');

        this.setState({
            categoryRaw: selectedValue,
        });

        this.props.handleCategorySelect(value, name);
    }

    render() {
        if (this.state.loading) {
            return translate('loading');
        }

        return (
            <select value={this.state.categoryRaw} onChange={(event) => this.handleCategoryChange(event.target.value)}>
                <option value=""></option>
                {this.state.selectData}
            </select>
        );
    }
}
