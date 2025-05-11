import { useEffect, useState } from 'react';
import classnames from 'classnames';
import { getTodayTime, getMonthName } from '../util/index';
import type { Moment } from 'moment';

const ROW = 4;
const COL = 3;

interface Props {
  onSelect: (date: Moment) => void;
  prefixCls: string;
  value: any;
  disabledDate?: (date: any) => boolean;
  cellRender?: (date: any, locale: any) => React.ReactNode;
  contentRender?: (date: any, locale: any) => React.ReactNode;
  locale: any;
}

export default function MonthTable(props: Props) {
  const {
    value,
    onSelect,
    prefixCls,
    disabledDate,
    cellRender,
    contentRender,
    locale,
  } = props;

  const [state, setState] = useState<{ value: Moment }>({ value });

  useEffect(() => {
    if ('value' in props && value !== state.value) {
      setState({ value });
    }
  }, [value, state, props]);

  const setAndSelectValue = (value: Moment) => {
    setState({ value });
    onSelect(value);
  };

  const chooseMonth = (month: number) => {
    const next = state.value.clone();
    next.month(month);
    setAndSelectValue(next);
  };

  const months = () => {
    const value = state.value;
    const current = value.clone();
    const months: { value: number; content: string; title: string }[][] = [];
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
  };

  const today = getTodayTime(state.value);
  const currentMonth = state.value.month();

  const monthsEls = months().map((month, index) => {
    const tds = month.map((monthData) => {
      let disabled = false;
      if (disabledDate) {
        const testValue = state.value.clone();
        testValue.month(monthData.value);
        disabled = disabledDate(testValue);
      }
      const classNameMap = {
        [`${prefixCls}-cell`]: 1,
        [`${prefixCls}-cell-disabled`]: disabled,
        [`${prefixCls}-selected-cell`]: monthData.value === currentMonth,
        [`${prefixCls}-current-cell`]:
          today.year() === state.value.year() &&
          monthData.value === today.month(),
      };
      let cellEl;
      if (cellRender) {
        const currentValue = state.value.clone();
        currentValue.month(monthData.value);
        cellEl = cellRender(currentValue, locale);
      } else {
        let content;
        if (contentRender) {
          const currentValue = state.value.clone();
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
          onClick={disabled ? undefined : () => chooseMonth(monthData.value)}
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
