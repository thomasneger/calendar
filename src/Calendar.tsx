import {
  cloneElement,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type FocusEventHandler,
  type HTMLAttributes,
  type KeyboardEventHandler,
  type ReactElement,
  type ReactNode,
} from 'react';
import DateTable from './date/DateTable';
import CalendarHeader from './calendar/CalendarHeader';
import CalendarFooter from './calendar/CalendarFooter';
import DateInput from './date/DateInput';
import { getTimeConfig, getTodayTime, isAllowedDate, syncTime } from './util';
import { goStartMonth, goEndMonth, goTime, type Unit } from './util/toTime';
import moment, { type Moment } from 'moment';
import enUs from './locale/en_US';
import classNames from 'classnames';
import type { Cause, DisabledTimeFn, Mode } from './types';
import { useGetFormat } from './util/format';

const getMomentObjectIfValid = (date: Moment | undefined) => {
  if (moment.isMoment(date) && date.isValid()) {
    return date;
  }
  return false;
};

export interface CalendarProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;

  /**
   * Controls the current date in the calendar picker only
   */
  value?: Moment;
  defaultValue?: Moment;
  /**
   * Controls the selected date in the calendar picker and the date input.
   */
  selectedValue?: Moment;
  defaultSelectedValue?: Moment;
  visible?: boolean;
  mode?: Mode;
  locale?: typeof enUs;
  showDateInput?: boolean;
  showWeekNumber?: boolean;
  showToday?: boolean;
  showOk?: boolean;
  onSelect?: (value: Moment | null, cause?: Cause) => void;
  onOk?: (value: Moment | null | undefined) => void;
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
  timePicker?: ReactElement<{
    showHour?: boolean;
    showMinute?: boolean;
    showSecond?: boolean;
    defaultOpenValue?: Moment;
    value?: Moment | null;
    onChange?: (value: Moment) => void;
    disabledTime?: DisabledTimeFn;
    defaultValue?: Moment;
    disabled?: boolean;
  }> | null;
  dateInputPlaceholder?: string;
  onClear?: () => void;
  onChange?: (value: Moment) => void;
  onPanelChange?: (value: Moment, mode: Mode) => void;
  disabledDate?: (date: Moment, selected?: Moment) => boolean;
  disabledTime?: DisabledTimeFn;
  dateRender?: (current: Moment, today: Moment) => ReactNode;
  renderFooter?: () => ReactNode;
  renderSidebar?: () => ReactNode;
  clearIcon?: ReactNode;
  focusablePanel?: boolean;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
  onBlur?: FocusEventHandler<HTMLDivElement>;
  monthCellRender?: (current: Moment) => ReactNode;
  monthCellContentRender?: (current: Moment) => ReactNode;
  format?: string | string[];
}

const Calendar = forwardRef((props: CalendarProps, forwardedRef) => {
  const {
    locale = enUs,
    style = {},
    visible = true,
    prefixCls = 'rc-calendar',
    className = '',
    onSelect = () => {},
    onChange = () => {},
    onClear = () => {},
    onBlur,
    renderFooter = () => null,
    renderSidebar = () => null,
    onKeyDown = () => {},
    showToday = true,
    showDateInput = true,
    timePicker = null,
    onOk = () => {},
    onPanelChange = () => {},
    focusablePanel = true,
    disabledDate,
    disabledTime,
    dateInputPlaceholder,
    clearIcon,
    inputMode,
    monthCellRender,
    monthCellContentRender,
    showWeekNumber,
    dateRender,
    showOk,
    format,
  } = props;

  const [mode, setMode] = useState<Mode | null>(props.mode || 'date');
  const [value, setValue] = useState(
    getMomentObjectIfValid(props.value) ||
      getMomentObjectIfValid(props.defaultValue) ||
      moment(),
  );

  const [selectedValue, setSelectedValue] = useState<Moment | null | undefined>(
    props.selectedValue || props.defaultSelectedValue,
  );

  // Update state value when props.value or props.defaultValue changes
  useEffect(() => {
    setValue(
      getMomentObjectIfValid(props.value) ||
        getMomentObjectIfValid(props.defaultValue) ||
        getNowByCurrentStateValue(value),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value, props.defaultValue]);

  // Update selectedValue when props.selectedValue
  useEffect(() => {
    setSelectedValue(props.selectedValue);
  }, [props.selectedValue]);

  useEffect(() => {
    if (props.mode) {
      setMode(props.mode);
    }
  }, [props.mode]);

  const handlePanelChange = (updatedValue: Moment | null, mode: Mode) => {
    if (!('mode' in props)) {
      setMode(mode);
    }

    onPanelChange(updatedValue || value, mode);
  };

  const handleOnKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if ((event.target as HTMLElement).nodeName.toLowerCase() === 'input') {
      return undefined;
    }
    const key = event.key;
    // mac
    const ctrlKey = event.ctrlKey || event.metaKey;

    switch (key) {
      case 'ArrowDown':
        handleGoTime(1, 'weeks');
        event.preventDefault();
        return 1;
      case 'ArrowUp':
        handleGoTime(-1, 'weeks');
        event.preventDefault();
        return 1;
      case 'ArrowLeft':
        if (ctrlKey) {
          handleGoTime(-1, 'years');
        } else {
          handleGoTime(-1, 'days');
        }
        event.preventDefault();
        return 1;
      case 'ArrowRight':
        if (ctrlKey) {
          handleGoTime(1, 'years');
        } else {
          handleGoTime(1, 'days');
        }
        event.preventDefault();
        return 1;
      case 'Home':
        handleValue(goStartMonth(value));
        event.preventDefault();
        return 1;
      case 'End':
        handleValue(goEndMonth(value));
        event.preventDefault();
        return 1;
      case 'PageDown':
        handleGoTime(1, 'month');
        event.preventDefault();
        return 1;
      case 'PageUp':
        handleGoTime(-1, 'month');
        event.preventDefault();
        return 1;
      case 'Enter':
        if (!disabledDate || !disabledDate(value)) {
          handleSelect(value, {
            source: 'keyboard',
          });
        }
        event.preventDefault();
        return 1;
      default:
        onKeyDown(event);
        return 1;
    }
  };

  // CalendarMixin stuff START
  const handleSelect = (value: Moment | null, cause?: Cause) => {
    if (value) {
      handleValue(value);
    }
    handleSelectedValue(value, cause);
  };

  const handleSelectedValue = (
    updatedSelectedValue: Moment | null,
    cause?: Cause,
  ) => {
    if (!('selectedValue' in props)) {
      setSelectedValue(updatedSelectedValue);
    }

    onSelect(updatedSelectedValue, cause);
  };

  // TODO Extract
  const handleValue = (updatedValue: Moment) => {
    const originalValue = value;

    if (!('value' in props)) {
      setValue(updatedValue);
    }

    if (
      (originalValue && updatedValue && !originalValue.isSame(updatedValue)) ||
      (!originalValue && updatedValue) ||
      (originalValue && !updatedValue)
    ) {
      onChange(updatedValue);
    }
  };

  const handleIsAllowedDate = (value: Moment) => {
    return isAllowedDate(value, disabledDate, disabledTime);
  };

  // CalendarMixin stuff END

  const handleClear = () => {
    handleSelect(null);
    onClear();
  };

  const handleOk = () => {
    if (handleIsAllowedDate(selectedValue as Moment)) {
      onOk(selectedValue);
    }
  };

  const handleDateInputChange = (value: Moment | null) => {
    handleSelect(value, {
      source: 'dateInput',
    });
  };

  const handleDateInputSelect = (value: Moment) => {
    handleSelect(value, {
      source: 'dateInputSelect',
    });
  };

  const handleDateTableSelect = (value: Moment) => {
    if (!selectedValue && timePicker) {
      const timePickerDefaultValue = timePicker.props.defaultValue;
      if (timePickerDefaultValue) {
        syncTime(timePickerDefaultValue, value);
      }
    }
    handleSelect(value);
  };

  const handleToday = () => {
    const now = getTodayTime(value);
    handleSelect(now, {
      source: 'todayButton',
    });
  };

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBlur: FocusEventHandler<HTMLDivElement> = (event) => {
    setTimeout(() => {
      if (
        !rootRef.current ||
        rootRef.current.contains(document.activeElement) ||
        (inputRef.current && inputRef.current.contains(document.activeElement))
      ) {
        // focused element is still part of Calendar
        return;
      }

      if (onBlur) {
        onBlur(event);
      }
    }, 0);
  };

  useImperativeHandle(
    forwardedRef,
    () => ({
      focus: () => {
        if (rootRef.current) {
          rootRef.current.focus();
        }
      },
    }),
    [],
  );

  const openTimePicker = () => {
    handlePanelChange(null, 'time');
  };

  const closeTimePicker = () => {
    handlePanelChange(null, 'date');
  };

  const handleGoTime = (direction: number, unit: Unit) => {
    handleValue(goTime(value, direction, unit));
  };

  const showTimePicker = mode === 'time';
  const disabledTimeConfig =
    showTimePicker && disabledTime && timePicker
      ? getTimeConfig(selectedValue, disabledTime)
      : null;

  let timePickerEle = null;

  if (timePicker && showTimePicker) {
    const timePickerProps = {
      showHour: true,
      showSecond: true,
      showMinute: true,
      ...timePicker.props,
      ...disabledTimeConfig,
      onChange: handleDateInputChange,
      value: selectedValue,
      disabledTime,
    };

    if (timePicker.props.defaultValue !== undefined) {
      timePickerProps.defaultOpenValue = timePicker.props.defaultValue;
    }

    timePickerEle = cloneElement(timePicker, timePickerProps);
  }

  const preparedFormat = useGetFormat({ format, locale, timePicker });
  const dateInputElement = showDateInput ? (
    <DateInput
      ref={inputRef}
      format={preparedFormat}
      key="date-input"
      value={value}
      locale={locale}
      placeholder={dateInputPlaceholder}
      showClear
      disabledDate={disabledDate}
      onClear={handleClear}
      prefixCls={prefixCls}
      selectedValue={selectedValue}
      onChange={handleDateInputChange}
      onSelect={handleDateInputSelect}
      clearIcon={clearIcon}
      inputMode={inputMode}
    />
  ) : null;

  const children = [];
  if (renderSidebar) {
    children.push(renderSidebar());
  }
  children.push(
    <div className={`${prefixCls}-panel`} key="panel">
      {dateInputElement}
      <div
        tabIndex={focusablePanel ? 0 : undefined}
        className={`${prefixCls}-date-panel`}
      >
        <CalendarHeader
          locale={locale}
          mode={mode}
          value={value}
          onValueChange={handleValue}
          onPanelChange={handlePanelChange}
          renderFooter={renderFooter}
          showTimePicker={showTimePicker}
          prefixCls={prefixCls}
          monthCellRender={monthCellRender}
          monthCellContentRender={monthCellContentRender}
        />
        {timePicker && showTimePicker ? (
          <div className={`${prefixCls}-time-picker`}>
            <div className={`${prefixCls}-time-picker-panel`}>
              {timePickerEle}
            </div>
          </div>
        ) : null}

        <div className={`${prefixCls}-body`}>
          <DateTable
            value={value}
            selectedValue={selectedValue}
            prefixCls={prefixCls}
            dateRender={dateRender}
            onSelect={handleDateTableSelect}
            disabledDate={disabledDate}
            showWeekNumber={showWeekNumber}
          />
        </div>

        <CalendarFooter
          showOk={showOk}
          mode={mode}
          renderFooter={props.renderFooter}
          locale={locale}
          prefixCls={prefixCls}
          showToday={showToday}
          disabledTime={disabledTime}
          showTimePicker={showTimePicker}
          showDateInput={props.showDateInput}
          timePicker={timePicker}
          selectedValue={selectedValue}
          timePickerDisabled={!selectedValue}
          value={value}
          disabledDate={disabledDate}
          okDisabled={
            showOk !== false &&
            (!selectedValue || !handleIsAllowedDate(selectedValue))
          }
          onOk={handleOk}
          onSelect={handleSelect}
          onToday={handleToday}
          onOpenTimePicker={openTimePicker}
          onCloseTimePicker={closeTimePicker}
        />
      </div>
    </div>,
  );

  return (
    <div
      ref={rootRef}
      className={classNames({
        [prefixCls]: 1,
        [`${prefixCls}-hidden`]: !visible,
        [`${prefixCls}-week-number`]: showWeekNumber,
        [className]: !!className,
      })}
      style={style}
      tabIndex={0}
      onKeyDown={handleOnKeyDown}
      onBlur={handleBlur}
    >
      {children}
    </div>
  );
});

function getNowByCurrentStateValue(value: Moment | null | undefined) {
  let ret;
  if (value) {
    ret = getTodayTime(value);
  } else {
    ret = moment();
  }
  return ret;
}

export default Calendar;
