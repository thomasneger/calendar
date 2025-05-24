import { type ReactNode } from 'react';
import { getMonthName } from '../util';
import type { Moment } from 'moment';
import type { Locale } from '../types';
import Select, { Option } from './Select';

interface CalendarHeaderProps {
  value: Moment;
  locale: Locale;
  yearSelectOffset?: number;
  yearSelectTotal?: number;
  onValueChange?: (value: Moment) => void;
  onTypeChange?: (type: 'date' | 'month') => void;
  prefixCls: string;
  type: string;
  showTypeSwitch?: boolean;
  headerComponents?: ReactNode[];
}

export default function CalendarHeader(props: CalendarHeaderProps) {
  const {
    yearSelectOffset = 10,
    yearSelectTotal = 20,
    onValueChange = () => {},
    onTypeChange = () => {},
    prefixCls,
    value,
    locale,
    type,
    showTypeSwitch,
    headerComponents,
  } = props;

  const onYearChange = (year: string) => {
    const newValue = value.clone();
    newValue.year(parseInt(year, 10));
    onValueChange(newValue);
  };

  const onMonthChange = (month: string) => {
    const newValue = value.clone();
    newValue.month(month);
    onValueChange(newValue);
  };

  const yearSelectElement = (year: number) => {
    const start = year - yearSelectOffset;
    const end = start + yearSelectTotal;

    const options = [];
    for (let index = start; index < end; index++) {
      options.push(<Option key={index}>{index}</Option>);
    }

    return (
      <Select
        className={`${prefixCls}-header-year-select`}
        onChange={onYearChange}
        value={year}
      >
        {options}
      </Select>
    );
  };

  const monthSelectElement = (month: number) => {
    const t = value.clone();
    const { prefixCls } = props;
    const options = [];

    for (let index = 0; index < 12; index++) {
      t.month(index);
      options.push(
        <Option key={index} value={index}>
          {getMonthName(t)}
        </Option>,
      );
    }

    return (
      <Select
        className={`${prefixCls}-header-month-select`}
        value={month}
        onChange={onMonthChange}
      >
        {options}
      </Select>
    );
  };

  const changeTypeToDate = () => {
    onTypeChange('date');
  };

  const changeTypeToMonth = () => {
    onTypeChange('month');
  };

  const year = value.year();
  const month = value.month();
  const yearSelect = yearSelectElement(year);
  const monthSelect = type === 'month' ? null : monthSelectElement(month);
  const switchCls = `${prefixCls}-header-switcher`;
  const typeSwitcher = showTypeSwitch ? (
    <span className={switchCls}>
      {type === 'date' ? (
        <span className={`${switchCls}-focus`}>{locale.month}</span>
      ) : (
        <span onClick={changeTypeToDate} className={`${switchCls}-normal`}>
          {locale.month}
        </span>
      )}
      {type === 'month' ? (
        <span className={`${switchCls}-focus`}>{locale.year}</span>
      ) : (
        <span onClick={changeTypeToMonth} className={`${switchCls}-normal`}>
          {locale.year}
        </span>
      )}
    </span>
  ) : null;

  return (
    <div className={`${prefixCls}-header`}>
      {typeSwitcher}
      {monthSelect}
      {yearSelect}
      {headerComponents}
    </div>
  );
}
