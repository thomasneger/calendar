import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { polyfill } from 'react-lifecycles-compat';
import { getTodayTime, getMonthName } from '../util/index';

const ROW = 4;
const COL = 3;

function noop() {}

class MonthTable extends Component {
  state = {};

  static getDerivedStateFromProps(props) {
    if ('value' in props) {
      return { value: props.value };
    }
    return null;
  }

  setAndSelectValue(value) {
    this.setState({
      value,
    });
    this.props.onSelect(value);
  }

  chooseMonth(month) {
    const next = this.state.value.clone();
    next.month(month);
    this.setAndSelectValue(next);
  }

  months() {
    const value = this.state.value;
    const current = value.clone();
    const months = [];
    let index = 0;
    for (let rowIndex = 0; rowIndex < ROW; rowIndex++) {
      months[rowIndex] = [];
      for (let colIndex = 0; colIndex < COL; colIndex++) {
        current.month(index);
        const content = getMonthName(current);
        months[rowIndex][colIndex] = {
          value: index,
          content,
          title: content,
        };
        index++;
      }
    }
    return months;
  }

  render() {
    const props = this.props;
    const value = this.state.value;
    const today = getTodayTime(value);
    const months = this.months();
    const currentMonth = value.month();
    const { prefixCls, locale, contentRender, cellRender } = props;
    const monthsEls = months.map((month, index) => {
      const tds = month.map((monthData) => {
        let disabled = false;
        if (props.disabledDate) {
          const testValue = value.clone();
          testValue.month(monthData.value);
          disabled = props.disabledDate(testValue);
        }
        const classNameMap = {
          [`${prefixCls}-cell`]: 1,
          [`${prefixCls}-cell-disabled`]: disabled,
          [`${prefixCls}-selected-cell`]: monthData.value === currentMonth,
          [`${prefixCls}-current-cell`]:
            today.year() === value.year() && monthData.value === today.month(),
        };
        let cellEl;
        if (cellRender) {
          const currentValue = value.clone();
          currentValue.month(monthData.value);
          cellEl = cellRender(currentValue, locale);
        } else {
          let content;
          if (contentRender) {
            const currentValue = value.clone();
            currentValue.month(monthData.value);
            content = contentRender(currentValue, locale);
          } else {
            content = monthData.content;
          }
          cellEl = <a className={`${prefixCls}-month`}>{content}</a>;
        }
        return (
          <td
            role="gridcell"
            key={monthData.value}
            onClick={disabled ? null : () => this.chooseMonth(monthData.value)}
            title={monthData.title}
            className={classnames(classNameMap)}
          >
            {cellEl}
          </td>
        );
      });
      return (
        <tr key={index} role="row">
          {tds}
        </tr>
      );
    });

    return (
      <table className={`${prefixCls}-table`} cellSpacing="0" role="grid">
        <tbody className={`${prefixCls}-tbody`}>{monthsEls}</tbody>
      </table>
    );
  }
}

MonthTable.defaultProps = {
  onSelect: noop,
};

MonthTable.propTypes = {
  onSelect: PropTypes.func,
  cellRender: PropTypes.func,
  prefixCls: PropTypes.string,
  value: PropTypes.object,
};

polyfill(MonthTable);

export default MonthTable;
