import React from 'react';
import { connect } from 'react-redux';
import { filterChange } from '../actions/primaryActions';

class SurveyFilter extends React.Component {
    handleFilterChange(event) {
        this.props.handleFilterChange(event.target.name, event.target.value);
    }

    render() {
        let optionItems = this.props.options.map((anOption) =>
            <option key={anOption.id} value={anOption.id}>{anOption.legible_value}</option>
        );

        const selectName = `f${this.props.filterId}`;

        return (
            <div className="filterEntry">
                <select name={selectName} onChange={this.handleFilterChange.bind(this)}>
                    <option key="none" value="">{this.props.label}</option>
                    {optionItems}
                </select>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        filters: state.filters
    }
};

const mapDispatchToProps = dispatch => ({
    handleFilterChange: (filterId, filterValue) => dispatch(filterChange(filterId, filterValue))
});

export default connect(mapStateToProps, mapDispatchToProps)(SurveyFilter);
