import React from 'react';
// @ts-ignore
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import Api from '../../../helpers/api';
import { translate } from '../../../helpers/localize';

interface IProps {
    handleQuestionOptionSelect: Function;
    handleQuestionRemoval: Function;
    questionId: number;
    currentSelections: any[];
}

export default class CompositeQuestionBox extends React.Component<IProps> {
    state = {
        loading: true,
        question: {
            id: null,
            question_group_id: null,
            question_type_id: null,
            survey_id: null,
            external_source_id: null,
            text: null,
            metadata: null,
            order: null,
            public: null,
        },
        questionOptions: [],
        selectedOptions: [],
    };

    componentDidMount() {
        this.fetchQuestionOptions();
    }

    fetchQuestionOptions() {
        new Api(`question/${this.props.questionId}/options`, 'get')
            .setPayload(this.state)
            .call()
            .then((response: any) => {
                this.setState({
                    question: response.question,
                    questionOptions: response.options,
                    selectedOptions: this.props.currentSelections,
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

    handleQuestionOptionSelection(selectedValue: any) {
        const currentValues: any[] = this.state.selectedOptions;
        if (currentValues.includes(selectedValue)) {
            const index = currentValues.indexOf(selectedValue);
            if (index > -1) {
                currentValues.splice(index, 1);
            }
        } else {
            currentValues.push(selectedValue);
        }

        this.setState({
            selectedOptions: currentValues,
        });

        this.props.handleQuestionOptionSelect(currentValues, this.state.question.id);
    }

    handleQuestionRemoval() {
        this.props.handleQuestionRemoval(this.state.question.id);
    }

    checkSelected(optionId: any) {
        const selectedOptions: any[] = this.state.selectedOptions;

        return (selectedOptions.includes(optionId)) ? true : false;
    }

    render() {
        if (this.state.loading) {
            return translate('loading');
        }

        const options: any[] = [];
        for (const anOption of this.state.questionOptions) {
            options.push(<Tr key={anOption['id']}>
                <Td><span className="textGray">{anOption['legible_value']}</span></Td>
                <Td><input
                    type="checkbox"
                    checked={this.checkSelected(anOption['id'])}
                    onChange={() => this.handleQuestionOptionSelection(anOption['id'])} /> {translate('numerator')}</Td>
            </Tr>);
        }

        return (
            <div className="containerBox marginBottom12 compositeGroupSelect">
                <div className="floatRight">
                    <i className="fi-trash size-24 pointer" onClick={() => this.handleQuestionRemoval()}></i>
                </div>
                <h2>{this.state.question.text}</h2>

                <Table>
                    <Thead>
                        <Tr>
                            <Th>{translate('answer_label')}</Th>
                            <Th>{translate('include_in_numerator_set')}</Th>
                        </Tr>
                    </Thead>
                    <Tbody>{options}</Tbody>
                </Table>
            </div>
        );
    }
}
