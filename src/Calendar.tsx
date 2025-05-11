import React, {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEventHandler,
  type HTMLAttributes,
  type KeyboardEventHandler,
  type ReactNode,
} from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import DateTable from './date/DateTable';
import CalendarHeader from './calendar/CalendarHeader';
import CalendarFooter from './calendar/CalendarFooter';
import DateInput from './date/DateInput';
import { getTimeConfig, getTodayTime, isAllowedDate, syncTime } from './util';
import { goStartMonth, goEndMonth, goTime, type Unit } from './util/toTime';
import moment, { type Moment } from 'moment';
import enUs from './locale/en_US';
import classnames from 'classnames';
import classNames from 'classnames';

const getMomentObjectIfValid = (date: Moment | undefined) => {
  if (moment.isMoment(date) && date.isValid()) {
    return date;
  }
  return false;
};

type Mode = 'time' | 'date' | 'month' | 'year' | 'decade';

export interface CalendarProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;

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
  locale?: any;
  showDateInput?: boolean;
  showWeekNumber?: boolean;
  showToday?: boolean;
  showOk?: boolean;
  onSelect?: (value: Moment | null, cause: any) => void;
  onOk?: (value: Moment | null | undefined) => void;
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
  timePicker?: React.ReactElement; // TODO Type as a TimePicker component
  dateInputPlaceholder?: string;
  onClear?: () => void;
  onChange?: (value: Moment) => void;
  onPanelChange?: (value: Moment, mode: Mode) => void;
  disabledDate?: (date: Moment | null | undefined) => boolean;
  disabledTime?: any;
  dateRender?: (current: Moment, today: Moment) => React.ReactNode;
  renderFooter?: () => React.ReactNode;
  renderSidebar?: () => React.ReactNode;
  clearIcon?: React.ReactNode;
  focusablePanel?: boolean;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
  onBlur?: FocusEventHandler<HTMLDivElement>;
  monthCellRender?: (current: Moment) => React.ReactNode;
  monthCellContentRender?: (current: Moment) => React.ReactNode;
  format?: string | string[];
}

function Calendar(props: CalendarProps) {
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

  // TODO This is called in CalendarMixing and is attached to the root element (our parent)
  const handleOnKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if ((event.target as HTMLElement).nodeName.toLowerCase() === 'input') {
      return undefined;
    }
    const keyCode = event.keyCode;
    // mac
    const ctrlKey = event.ctrlKey || event.metaKey;

    switch (keyCode) {
      case KeyCode.DOWN:
        handleGoTime(1, 'weeks');
        event.preventDefault();
        return 1;
      case KeyCode.UP:
        handleGoTime(-1, 'weeks');
        event.preventDefault();
        return 1;
      case KeyCode.LEFT:
        if (ctrlKey) {
          handleGoTime(-1, 'years');
        } else {
          handleGoTime(-1, 'days');
        }
        event.preventDefault();
        return 1;
      case KeyCode.RIGHT:
        if (ctrlKey) {
          handleGoTime(1, 'years');
        } else {
          handleGoTime(1, 'days');
        }
        event.preventDefault();
        return 1;
      case KeyCode.HOME:
        handleValue(goStartMonth(value));
        event.preventDefault();
        return 1;
      case KeyCode.END:
        handleValue(goEndMonth(value));
        event.preventDefault();
        return 1;
      case KeyCode.PAGE_DOWN:
        handleGoTime(1, 'month');
        event.preventDefault();
        return 1;
      case KeyCode.PAGE_UP:
        handleGoTime(-1, 'month');
        event.preventDefault();
        return 1;
      case KeyCode.ENTER:
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

  type Cause = {
    source: string;
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

  const handleIsAllowedDate = (value: Moment | null | undefined) => {
    return isAllowedDate(value, disabledDate, disabledTime);
  };

  // CalendarMixin stuff END

  const handleClear = () => {
    handleSelect(null);
    onClear();
  };

  const handleOk = () => {
    if (handleIsAllowedDate(selectedValue)) {
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

  // TODO This is probably called by other rc-* components
  // getRootDOMNode = () => {
  //   return ReactDOM.findDOMNode(this);
  // };

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

    timePickerEle = React.cloneElement(timePicker, timePickerProps);
  }

  const dateInputElement = showDateInput ? (
    <DateInput
      ref={inputRef}
      format={useGetFormat({ format, locale, timePicker })}
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
    <Root
      ref={rootRef}
      prefixCls={prefixCls}
      visible={visible}
      className={classNames({
        [`${prefixCls}-week-number`]: showWeekNumber,
        [className]: className,
      })}
      style={style}
      onKeyDown={handleOnKeyDown}
      onBlur={handleBlur}
    >
      {children}
    </Root>
  );
}

const Root = forwardRef<
  HTMLDivElement,
  {
    prefixCls: string;
    visible: boolean;
    className: string;
    style: CSSProperties;
    onKeyDown: KeyboardEventHandler<HTMLElement>;
    onBlur: FocusEventHandler<HTMLDivElement>;
    children: ReactNode;
  }
>((props, ref) => {
  const prefixCls = props.prefixCls;

  const className = {
    [prefixCls]: 1,
    [`${prefixCls}-hidden`]: !props.visible,
    [props.className]: !!props.className,
  };

  return (
    <div
      ref={ref}
      className={classnames(className)}
      style={props.style}
      tabIndex={0}
      onKeyDown={props.onKeyDown}
      onBlur={props.onBlur}
    >
      {props.children}
    </div>
  );
});

function useGetFormat(props: any) {
  let { format, locale, timePicker } = props;

  if (!format) {
    if (timePicker) {
      format = locale.dateTimeFormat;
    } else {
      format = locale.dateFormat;
    }
  }
  return format;
}

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
