import React, { useState } from 'react';
import MonthPanel from '../month/MonthPanel';
import YearPanel from '../year/YearPanel';
import DecadePanel from '../decade/DecadePanel';
import type { Moment } from 'moment';
import type { Locale, Mode } from '../types';

interface Props {
  prefixCls: string;
  value: Moment;
  onValueChange: (value: Moment) => void;
  showTimePicker?: boolean;
  onPanelChange: (value: Moment | null, mode: Mode) => void;
  locale: Locale;
  enablePrev?: boolean;
  enableNext?: boolean;
  disabledMonth?: (date: Moment) => boolean;
  renderFooter?: () => React.ReactNode;
  onMonthSelect?: (value: Moment) => void;
  monthCellRender?: (date: Moment) => React.ReactNode;
  monthCellContentRender?: (date: Moment) => React.ReactNode;
  mode: Mode | null;
}

type Referer = { yearPanelReferer: Mode | null };

export default function CalendarHeader(props: Props) {
  const {
    prefixCls,
    locale,
    mode,
    value,
    showTimePicker,
    enableNext = 1,
    enablePrev = 1,
    onPanelChange = () => {},
    onValueChange = () => {},
    onMonthSelect,
    disabledMonth,
    renderFooter,
  } = props;

  const [state, setState] = useState<Referer>({ yearPanelReferer: null });

  const goMonth = (direction: number) => {
    const next = value.clone();
    next.add(direction, 'months');
    onValueChange(next);
  };

  const goYear = (direction: number) => {
    const next = value.clone();
    next.add(direction, 'years');
    onValueChange(next);
  };

  const nextMonth = () => goMonth(1);
  const previousMonth = () => goMonth(-1);
  const nextYear = () => goYear(1);
  const previousYear = () => goYear(-1);

  const handleMonthSelect = (value: Moment) => {
    onPanelChange(value, 'date');

    if (onMonthSelect) {
      onMonthSelect(value);
    } else {
      onValueChange(value);
    }
  };

  const handleYearSelect = (value: Moment) => {
    const referer = state.yearPanelReferer as Mode;
    setState({ yearPanelReferer: null });
    onPanelChange(value, referer);
    onValueChange(value);
  };

  const handleDecadeSelect = (value: Moment) => {
    onPanelChange(value, 'year');
    onValueChange(value);
  };

  const changeYear = (direction: number) => {
    if (direction > 0) {
      nextYear();
    } else {
      previousYear();
    }
  };

  const monthYearElement = (showTimePicker: boolean | undefined) => {
    const localeData = value.localeData();
    const monthBeforeYear = locale.monthBeforeYear;
    const selectClassName = `${prefixCls}-${
      monthBeforeYear ? 'my-select' : 'ym-select'
    }`;
    const timeClassName = showTimePicker ? ` ${prefixCls}-time-status` : '';
    const year = (
      <a
        className={`${prefixCls}-year-select${timeClassName}`}
        role="button"
        onClick={showTimePicker ? undefined : () => showYearPanel('date')}
        title={showTimePicker ? undefined : locale.yearSelect}
      >
        {value.format(locale.yearFormat)}
      </a>
    );
    const month = (
      <a
        className={`${prefixCls}-month-select${timeClassName}`}
        role="button"
        onClick={showTimePicker ? undefined : showMonthPanel}
        title={showTimePicker ? undefined : locale.monthSelect}
      >
        {locale.monthFormat
          ? value.format(locale.monthFormat)
          : localeData.monthsShort(value)}
      </a>
    );
    let day;
    if (showTimePicker) {
      day = (
        <a className={`${prefixCls}-day-select${timeClassName}`} role="button">
          {value.format(locale.dayFormat)}
        </a>
      );
    }
    const my = monthBeforeYear ? (
      <>
        {month} {day} {year}
      </>
    ) : (
      <>
        {year}, {month}, {day}
      </>
    );

    return <span className={selectClassName}>{my}</span>;
  };

  const showMonthPanel = () => {
    // null means that users' interaction doesn't change value
    onPanelChange(null, 'month');
  };

  const showYearPanel = (referer: Mode) => {
    setState({ yearPanelReferer: referer });
    onPanelChange(null, 'year');
  };

  const showDecadePanel = () => {
    onPanelChange(null, 'decade');
  };

  let panel = null;
  if (mode === 'month') {
    panel = (
      <MonthPanel
        locale={locale}
        value={value}
        rootPrefixCls={prefixCls}
        onSelect={handleMonthSelect}
        onYearPanelShow={() => showYearPanel('month')}
        disabledDate={disabledMonth}
        cellRender={props.monthCellRender}
        contentRender={props.monthCellContentRender}
        renderFooter={renderFooter}
        changeYear={changeYear}
      />
    );
  }
  if (mode === 'year') {
    panel = (
      <YearPanel
        locale={locale}
        defaultValue={value}
        rootPrefixCls={prefixCls}
        onSelect={handleYearSelect}
        onDecadePanelShow={showDecadePanel}
        renderFooter={renderFooter}
      />
    );
  }
  if (mode === 'decade') {
    panel = (
      <DecadePanel
        locale={locale}
        defaultValue={value}
        rootPrefixCls={prefixCls}
        onSelect={handleDecadeSelect}
        renderFooter={renderFooter}
      />
    );
  }

  return (
    <div className={`${prefixCls}-header`}>
      <div style={{ position: 'relative' }}>
        {enablePrev && !showTimePicker && (
          <a
            className={`${prefixCls}-prev-year-btn`}
            role="button"
            onClick={previousYear}
            title={locale.previousYear}
          />
        )}
        {enablePrev && !showTimePicker && (
          <a
            className={`${prefixCls}-prev-month-btn`}
            role="button"
            onClick={previousMonth}
            title={locale.previousMonth}
          />
        )}
        {monthYearElement(showTimePicker)}
        {enableNext && !showTimePicker && (
          <a
            className={`${prefixCls}-next-month-btn`}
            onClick={nextMonth}
            title={locale.nextMonth}
          />
        )}
        {enableNext && !showTimePicker && (
          <a
            className={`${prefixCls}-next-year-btn`}
            onClick={nextYear}
            title={locale.nextYear}
          />
        )}
      </div>
      {panel}
    </div>
  );
}
