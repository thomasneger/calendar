import React, { type ReactNode } from 'react';
import CalendarHeader from '../calendar/CalendarHeader';
import DateTable from '../date/DateTable';
import DateInput from '../date/DateInput';
import { getTimeConfig } from '../util/index';
import type { Moment } from 'moment';

// TODO Extract
type Mode = 'time' | 'date' | 'month' | 'year' | 'decade';
type DisabledTimeFn = (date: Moment[], type: string) => DisabledTimeConfig;
type DisabledTimeConfig = {
  disabledHours: (hours: number) => number[];
  disabledMinutes: (hour: number) => number[];
  disabledSeconds: (hour: number, minute: number) => number[];
};

interface CalendarPartProps {
  prefixCls: string;
  value?: Moment;
  hoverValue: Moment[];
  selectedValue: Moment[];
  direction: 'left' | 'right';
  locale: any;
  showDateInput: boolean;
  showTimePicker: boolean;
  format: string;
  placeholder?: string;
  disabledDate: (date: Moment) => boolean;
  timePicker: ReactNode;
  disabledTime: DisabledTimeFn;
  timePickerDisabledTime: object;
  onInputChange: (value: Moment) => void;
  onInputSelect: (value: Moment) => void;
  enableNext?: boolean;
  enablePrev?: boolean;
  clearIcon: ReactNode;
  dateRender: (date: Moment) => ReactNode;
  inputMode: string;
  showClear: boolean;
  onValueChange: (value: Moment) => void;
  onPanelChange: (value: Moment, mode: Mode) => void;
  disabledMonth: (date: Moment) => boolean;
  onSelect: (value: Moment) => void;
  onDayHover: (value: Moment) => void;
  showWeekNumber: boolean;
  mode: Mode;
}

export default function CalendarPart(props: CalendarPartProps) {
  const {
    prefixCls,
    value,
    hoverValue,
    selectedValue,
    mode,
    direction,
    locale,
    format,
    placeholder,
    disabledDate,
    timePicker,
    disabledTime,
    timePickerDisabledTime,
    showTimePicker,
    onInputChange,
    onInputSelect,
    enablePrev,
    enableNext,
    clearIcon,
    showClear,
    inputMode,
  } = props;
  const shouldShowTimePicker = showTimePicker && timePicker;
  const disabledTimeConfig =
    shouldShowTimePicker && disabledTime
      ? getTimeConfig(selectedValue, disabledTime)
      : null;
  const rangeClassName = `${prefixCls}-range`;
  const newProps = {
    locale,
    value,
    prefixCls,
    showTimePicker,
  };
  const index = direction === 'left' ? 0 : 1;
  const timePickerEle =
    shouldShowTimePicker &&
    React.cloneElement(timePicker, {
      showHour: true,
      showMinute: true,
      showSecond: true,
      ...timePicker.props,
      ...disabledTimeConfig,
      ...timePickerDisabledTime,
      onChange: onInputChange,
      defaultOpenValue: value,
      value: selectedValue[index],
    });

  const dateInputElement = props.showDateInput && (
    <DateInput
      format={format}
      locale={locale}
      prefixCls={prefixCls}
      timePicker={timePicker}
      disabledDate={disabledDate}
      placeholder={placeholder}
      disabledTime={disabledTime}
      value={value}
      showClear={showClear || false}
      selectedValue={selectedValue[index]}
      onChange={onInputChange}
      onSelect={onInputSelect}
      clearIcon={clearIcon}
      inputMode={inputMode}
    />
  );

  return (
    <div className={`${rangeClassName}-part ${rangeClassName}-${direction}`}>
      {dateInputElement}
      <div style={{ outline: 'none' }}>
        <CalendarHeader
          {...newProps}
          mode={mode}
          enableNext={enableNext}
          enablePrev={enablePrev}
          onValueChange={props.onValueChange}
          onPanelChange={props.onPanelChange}
          disabledMonth={props.disabledMonth}
        />
        {showTimePicker ? (
          <div className={`${prefixCls}-time-picker`}>
            <div className={`${prefixCls}-time-picker-panel`}>
              {timePickerEle}
            </div>
          </div>
        ) : null}
        <div className={`${prefixCls}-body`}>
          <DateTable
            {...newProps}
            hoverValue={hoverValue}
            selectedValue={selectedValue}
            dateRender={props.dateRender}
            onSelect={props.onSelect}
            onDayHover={props.onDayHover}
            disabledDate={disabledDate}
            showWeekNumber={props.showWeekNumber}
          />
        </div>
      </div>
    </div>
  );
}
