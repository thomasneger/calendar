import {
  useEffect,
  useState,
  type ComponentType,
  type CSSProperties,
  type ReactNode,
} from 'react';
import DateTable from './date/DateTable';
import MonthTable from './month/MonthTable';
import CalendarHeader from './full-calendar/CalendarHeader';
import moment, { type Moment } from 'moment';
import type { Locale } from './types';
import en_US from './locale/en_US';
import classNames from 'classnames';

export interface FullCalendarProps {
  type?: Cause;
  defaultType?: Cause;
  value?: Moment;
  defaultValue?: Moment;
  selectedValue?: Moment;
  defaultSelectedValue?: Moment;
  prefixCls?: string;
  locale?: Locale;
  fullscreen?: boolean;
  visible?: boolean;
  className?: string;
  style?: CSSProperties;
  monthCellRender?: (date: Moment) => ReactNode;
  monthCellContentRender?: (date: Moment) => ReactNode;
  dateCellRender?: (date: Moment) => ReactNode;
  showTypeSwitch?: boolean;
  onSelect?: (date: Moment, cause?: { target: Cause }) => void; // TODO Check type, looks like it's an event target
  onChange?: (date: Moment) => void;
  onTypeChange?: (type: Cause) => void;
  headerComponents?: ReactNode[];
  headerComponent?: ComponentType;
  headerRender?: (value: Moment, type: string, locale: object) => ReactNode;
  showHeader?: boolean;
  disabledDate?: (date: Moment) => boolean;
  dateCellContentRender?: (date: Moment) => ReactNode;
}

type Cause = 'date' | 'month';

type State = {
  type: Cause;
  value: Moment;
  selectedValue?: Moment;
};

export default function FullCalendar(props: FullCalendarProps) {
  const {
    onSelect = () => {},
    onChange = () => {},
    prefixCls = 'rc-calendar',
    locale = en_US,
    monthCellRender,
    monthCellContentRender,
    disabledDate,
    visible = true,
    className = '',
    style = {},
    defaultType = 'date',
    fullscreen = false,
    showTypeSwitch = true,
    showHeader = true,
    onTypeChange = () => {},
    headerComponent,
    headerRender,
    dateCellRender,
    dateCellContentRender,
  } = props;

  const [state, setState] = useState<State>({
    type: props.type || defaultType,
    value: props.value || props.defaultValue || moment(),
    selectedValue: props.selectedValue || props.defaultSelectedValue,
  });

  // TODO Extract
  const handleSelect = (value: Moment, cause?: { target: Cause }) => {
    if (value) {
      setValue(value);
    }

    setSelectedValue(value, cause);
  };

  // TODO Extract
  const setSelectedValue = (
    selectedValue: Moment,
    cause?: { target: Cause },
  ) => {
    if (!('selectedValue' in props)) {
      setState((prev) => ({
        ...prev,
        selectedValue,
      }));
    }

    onSelect(selectedValue, cause);
  };

  // TODO Extract
  const setValue = (value: Moment) => {
    const originalValue = state.value;
    if (!('value' in props)) {
      setState((prev) => ({
        ...prev,
        value,
      }));
    }
    if (
      (originalValue && value && !originalValue.isSame(value)) ||
      (!originalValue && value) ||
      (originalValue && !value)
    ) {
      onChange(value);
    }
  };

  const onMonthSelect = (value: Moment) => {
    handleSelect(value, {
      target: 'month',
    });
  };

  // Update type when props.type changes
  useEffect(() => {
    const updatedType = props.type;

    if (updatedType) {
      setState((prev) => ({
        ...prev,
        type: updatedType,
      }));
    }
  }, [props.type]);

  // Update value when props.value or props.defaultValue changes
  useEffect(() => {
    if (props.value) {
      const updatedValue = props.value || props.defaultValue || moment();
      setState((prev) => ({
        ...prev,
        value: updatedValue,
      }));
    }
  }, [props.value, props.defaultValue]);

  // Update selectedValue when props.selectedValue changes
  useEffect(() => {
    if (props.selectedValue) {
      setState((prev) => ({
        ...prev,
        selectedValue: props.selectedValue,
      }));
    }
  }, [props.selectedValue]);

  const setType = (type: Cause) => {
    if (!('type' in props)) {
      setState((prev) => ({
        ...prev,
        type,
      }));
    }
    onTypeChange(type);
  };

  const { value, type } = state;

  let header = null;
  if (showHeader) {
    if (headerRender) {
      header = headerRender(value, type, locale);
    } else {
      const TheHeader = headerComponent || CalendarHeader;
      header = (
        <TheHeader
          key="calendar-header"
          locale={locale}
          monthCellRender={monthCellRender}
          fullscreen={fullscreen}
          showTypeSwitch={showTypeSwitch}
          showHeader={showHeader}
          headerRender={headerRender}
          {...props}
          prefixCls={`${prefixCls}-full`}
          type={type}
          value={value}
          onTypeChange={setType}
          onValueChange={setValue}
        />
      );
    }
  }

  const table =
    type === 'date' ? (
      <DateTable
        dateRender={dateCellRender}
        contentRender={dateCellContentRender}
        locale={locale}
        prefixCls={prefixCls}
        onSelect={handleSelect}
        value={value}
        disabledDate={disabledDate}
      />
    ) : (
      <MonthTable
        cellRender={monthCellRender}
        contentRender={monthCellContentRender}
        locale={locale}
        onSelect={onMonthSelect}
        prefixCls={`${prefixCls}-month-panel`}
        value={value}
        disabledDate={disabledDate}
      />
    );

  return (
    <div
      className={classNames(prefixCls, `${prefixCls}-full`, className, {
        [`${prefixCls}-hidden`]: !visible,
        [`${prefixCls}-fullscreen`]: fullscreen,
      })}
      style={style}
      tabIndex={0}
    >
      {header}
      <div key="calendar-body" className={`${prefixCls}-calendar-body`}>
        {table}
      </div>
    </div>
  );
}
