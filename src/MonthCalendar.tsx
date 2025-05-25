import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEventHandler,
  type ReactNode,
} from 'react';
import CalendarHeader from './calendar/CalendarHeader';
import CalendarFooter from './calendar/CalendarFooter';
import moment, { type Moment } from 'moment';
import classnames from 'classnames';
import type { Cause, Locale, Mode } from './types';
import en_US from './locale/en_US';

interface MonthCalendarProps {
  prefixCls?: string;
  monthCellRender?: (date: Moment) => ReactNode;
  monthCellContentRender?: (date: Moment) => ReactNode;
  value?: Moment;
  defaultValue?: Moment;
  selectedValue?: Moment;
  defaultSelectedValue?: Moment;
  disabledDate?: (date: Moment) => boolean;
  onSelect?: (date: Moment, cause: Cause | undefined) => void; // TODO Check Cause is probably always undefined
  onChange?: (date: Moment) => void;
  renderFooter?: () => ReactNode;
  locale?: Locale;
  visible?: boolean;
  className?: string;
  style?: CSSProperties;
}

type State = {
  mode: Mode;
  value: Moment;
  selectedValue?: Moment;
};

function MonthCalendar(props: MonthCalendarProps) {
  const {
    onSelect = () => {},
    onChange = () => {},
    prefixCls = 'rc-calendar',
    locale = en_US,
    monthCellRender,
    monthCellContentRender,
    renderFooter = () => null,
    disabledDate,
    visible = true,
    className = '',
    style = {},
  } = props;

  const [state, setState] = useState<State>({
    mode: 'month',
    value: props.value || props.defaultValue || moment(),
    selectedValue: props.selectedValue || props.defaultSelectedValue,
  });

  const handleSelect = (value: Moment, cause?: Cause) => {
    if (value) {
      setValue(value);
    }
    setSelectedValue(value, cause);
  };

  const setSelectedValue = (
    selectedValue: Moment,
    cause: Cause | undefined,
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

  const onKeyDown: KeyboardEventHandler = (event) => {
    const key = event.key;
    const ctrlKey = event.ctrlKey || event.metaKey;
    let value;

    switch (key) {
      case 'ArrowDown':
        value = state.value.clone();
        value.add(3, 'months');
        break;
      case 'ArrowUp':
        value = state.value.clone();
        value.add(-3, 'months');
        break;
      case 'ArrowLeft':
        value = state.value.clone();
        if (ctrlKey) {
          value.add(-1, 'years');
        } else {
          value.add(-1, 'months');
        }
        break;
      case 'ArrowRight':
        value = state.value.clone();
        if (ctrlKey) {
          value.add(1, 'years');
        } else {
          value.add(1, 'months');
        }
        break;
      case 'Enter':
        if (!disabledDate || !disabledDate(state.value)) {
          handleSelect(state.value);
        }
        event.preventDefault();
        return 1;
      default:
        return undefined;
    }
    if (value !== state.value) {
      setValue(value);
      event.preventDefault();
      return 1;
    }
  };

  const handlePanelChange = (_: unknown, mode: Mode) => {
    if (mode !== 'date') {
      setState((prev) => ({ ...prev, mode }));
    }
  };

  const { mode, value } = state;

  const children = (
    <div className={`${prefixCls}-month-calendar-content`}>
      <div className={`${prefixCls}-month-header-wrap`}>
        <CalendarHeader
          prefixCls={prefixCls}
          mode={mode}
          value={value}
          locale={locale}
          disabledMonth={disabledDate}
          monthCellRender={monthCellRender}
          monthCellContentRender={monthCellContentRender}
          onMonthSelect={handleSelect}
          onValueChange={setValue}
          onPanelChange={handlePanelChange}
        />
      </div>
      <CalendarFooter
        prefixCls={prefixCls}
        renderFooter={renderFooter}
        locale={locale}
      />
    </div>
  );

  const monthCalendarClassName = `${prefixCls}-month-calendar`;

  const rootRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={rootRef}
      className={classnames({
        [prefixCls]: 1,
        [`${prefixCls}-hidden`]: !visible,
        [className]: !!className,
        [monthCalendarClassName]: !!monthCalendarClassName,
      })}
      style={style}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
}

export default MonthCalendar;
