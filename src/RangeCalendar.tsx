import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type KeyboardEventHandler,
  type ReactElement,
} from 'react';
import moment, { type Moment } from 'moment';
import classnames from 'classnames';
import KeyCode from 'rc-util/lib/KeyCode';
import CalendarPart from './range-calendar/CalendarPart';
import TodayButton from './calendar/TodayButton';
import OkButton from './calendar/OkButton';
import TimePickerButton from './calendar/TimePickerButton';
import { syncTime, getTodayTime, isAllowedDate } from './util';
import { goTime, goStartMonth, goEndMonth, includesTime } from './util/toTime';
import en_US from './locale/en_US';
import type {
  Cause,
  DisabledTimeConfig,
  Mode,
  TimePickerRangeProps,
} from './types';
import { useGetFormat } from './util/format';

function isEmptyArray(arr: unknown[]) {
  return Array.isArray(arr) && (arr.length === 0 || arr.every((i) => !i));
}

function isArraysEqual(a: unknown[] | undefined, b: unknown[] | undefined) {
  if (a === b) return true;
  if (
    a === null ||
    typeof a === 'undefined' ||
    b === null ||
    typeof b === 'undefined'
  ) {
    return false;
  }
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function getValueFromSelectedValue(selectedValue: Moment[]) {
  let [start, end] = selectedValue;
  if (end && (start === undefined || start === null)) {
    start = end.clone().subtract(1, 'month');
  }

  if (start && (end === undefined || end === null)) {
    end = start.clone().add(1, 'month');
  }
  return [start, end];
}

function normalizeAnchor(props: ReturnType<typeof initProps>, init: 0 | 1) {
  const selectedValue =
    props.selectedValue || (init && props.defaultSelectedValue);
  const value = props.value || (init && props.defaultValue);
  const normalizedValue = value
    ? getValueFromSelectedValue(value)
    : // @ts-expect-error while technically a bug, this occurs when we pass a props.value of empty array
      getValueFromSelectedValue(selectedValue);
  return !isEmptyArray(normalizedValue)
    ? normalizedValue
    : init === 1
      ? [moment(), moment().add(1, 'months')]
      : [];
}

function generateOptions(length: number, extraOptionGen: () => number[]) {
  const arr = extraOptionGen ? extraOptionGen().concat() : [];
  for (let value = 0; value < length; value++) {
    if (arr.indexOf(value) === -1) {
      arr.push(value);
    }
  }
  return arr;
}

type DisabledTimeFn = (date: Moment[], type: string) => DisabledTimeConfig;

export interface RangeCalendarProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  dateInputPlaceholder?: string | string[];
  seperator?: string;
  defaultValue?: Moment[];
  value?: Moment[];
  hoverValue?: Moment[];
  mode?: Mode[];
  showDateInput?: boolean;
  timePicker?: ReactElement<TimePickerRangeProps>;
  showOk?: boolean;
  showToday?: boolean;
  defaultSelectedValue?: Moment[];
  selectedValue?: Moment[];
  onOk?: (value: Moment[]) => void;
  showClear?: boolean;
  locale?: typeof en_US;
  onChange?: (value: Moment[]) => void;
  onSelect?: (value: Moment[], cause: Cause | undefined) => void;
  onValueChange?: (value: Moment[]) => void;
  onHoverChange?: (hoverValue: Moment[]) => void;
  onPanelChange?: (value: Moment[], mode: string[]) => void;
  format?: string;
  onClear?: () => void;
  type?: string;
  disabledDate?: (date: Moment) => boolean;
  disabledTime?: DisabledTimeFn;
  renderFooter?: () => React.ReactNode;
  renderSidebar?: () => React.ReactNode;
  clearIcon?: React.ReactNode;
  onInputSelect?: (value: Moment[]) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  visible?: boolean;
  showWeekNumber?: boolean;
}

function initProps(props: RangeCalendarProps) {
  return {
    ...props,
    prefixCls: props.prefixCls || 'rc-calendar',
    className: props.className || '',
    style: props.style || {},
    visible: props.visible || true,
    dateInputPlaceholder: props.dateInputPlaceholder || '',
    seperator: props.seperator || '~',
    defaultValue: props.defaultValue || null,
    locale: props.locale || en_US,
    onSelect: props.onSelect || (() => {}),
    onChange: props.onChange || (() => {}),
    onClear: props.onClear || (() => {}),
    renderFooter: props.renderFooter || (() => null),
    renderSidebar: props.renderSidebar || (() => null),
    type: props.type || 'both',
    defaultSelectedValue: props.defaultSelectedValue || [],
    onValueChange: props.onValueChange || (() => {}),
    onHoverChange: props.onHoverChange || (() => {}),
    onPanelChange: props.onPanelChange || (() => {}),
    disabledTime:
      props.disabledTime ||
      (() => ({
        disabledHours: () => [],
        disabledMinutes: () => [],
        disabledSeconds: () => [],
      })),
    onInputSelect: props.onInputSelect || (() => {}),
    onOk: props.onOk || (() => {}),
    showToday: props.showToday || true,
    showDateInput: props.showDateInput || true,
  } as const;
}

type State = {
  selectedValue: Moment[];
  prevSelectedValue: Moment[];
  firstSelectedValue: Moment | null;
  hoverValue: Moment[];
  value: Moment[];
  showTimePicker: boolean;
  mode: Mode[];
  /**
   * Trigger by which picker panel: 'start' | 'end'
   */
  panelTriggerSource: string;
};

type R = {
  focus: () => void;
};

type P = RangeCalendarProps;

const RangeCalendar = forwardRef<R, P>((rawProps, forwardedRef) => {
  const props = initProps(rawProps);

  const selectedValueInit = props.selectedValue || props.defaultSelectedValue;
  const [state, setState] = useState<State>({
    selectedValue: selectedValueInit,
    prevSelectedValue: selectedValueInit,
    firstSelectedValue: null,
    hoverValue: props.hoverValue || [],
    value: normalizeAnchor(props, 1),
    showTimePicker: false,
    mode: props.mode || ['date', 'date'],
    panelTriggerSource: '',
  });

  const onDatePanelEnter = () => {
    if (hasSelectedValue()) {
      fireHoverValueChange(state.selectedValue.concat());
    }
  };

  const onDatePanelLeave = () => {
    if (hasSelectedValue()) {
      fireHoverValueChange([]);
    }
  };

  const onSelect = (value: Moment) => {
    const { type } = props;
    const { selectedValue, prevSelectedValue, firstSelectedValue } = state;
    let nextSelectedValue: Moment[];
    if (type === 'both') {
      if (!firstSelectedValue) {
        syncTime(prevSelectedValue[0], value);
        nextSelectedValue = [value];
      } else if (compare(firstSelectedValue, value) < 0) {
        syncTime(prevSelectedValue[1], value);
        nextSelectedValue = [firstSelectedValue, value];
      } else {
        syncTime(prevSelectedValue[0], value);
        syncTime(prevSelectedValue[1], firstSelectedValue);
        nextSelectedValue = [value, firstSelectedValue];
      }
    } else if (type === 'start') {
      syncTime(prevSelectedValue[0], value);
      const endValue = selectedValue[1];
      nextSelectedValue =
        endValue && compare(endValue, value) > 0 ? [value, endValue] : [value];
    } else {
      // type === 'end'
      const startValue = selectedValue[0];
      if (startValue && compare(startValue, value) <= 0) {
        syncTime(prevSelectedValue[1], value);
        nextSelectedValue = [startValue, value];
      } else {
        syncTime(prevSelectedValue[0], value);
        nextSelectedValue = [value];
      }
    }

    fireSelectValueChange(nextSelectedValue);
  };

  const onInputSelect = (
    direction: 'left' | 'right',
    value: Moment | null,
    cause?: Cause,
  ) => {
    if (!value) {
      return;
    }
    const originalValue = state.selectedValue;
    const selectedValue = originalValue.concat();
    const index = direction === 'left' ? 0 : 1;
    selectedValue[index] = value;

    if (selectedValue[0] && compare(selectedValue[0], selectedValue[1]) > 0) {
      // @ts-expect-error The typing of the various values should technically be [(Moment | undefined), (Moment | undefined)]
      selectedValue[1 - index] = state.showTimePicker
        ? selectedValue[index]
        : undefined;
    }

    props.onInputSelect(selectedValue);
    fireSelectValueChange(
      selectedValue,
      null,
      cause || { source: 'dateInput' },
    );
  };

  const onKeyDown: KeyboardEventHandler = (event) => {
    if ((event.target as HTMLElement).nodeName.toLowerCase() === 'input') {
      return;
    }

    const { keyCode } = event;
    const ctrlKey = event.ctrlKey || event.metaKey;

    const {
      selectedValue,
      hoverValue,
      firstSelectedValue,
      value, // Value is used for `CalendarPart` current page
    } = state;
    const { onKeyDown, disabledDate } = props;

    // Update last time of the picker
    const updateHoverPoint = (func: (v: Moment) => Moment) => {
      // Change hover to make focus in UI
      let currentHoverTime;
      let nextHoverTime;
      let nextHoverValue;

      if (!firstSelectedValue) {
        currentHoverTime =
          hoverValue[0] || selectedValue[0] || value[0] || moment();
        nextHoverTime = func(currentHoverTime);
        nextHoverValue = [nextHoverTime];
        fireHoverValueChange(nextHoverValue);
      } else {
        if (hoverValue.length === 1) {
          currentHoverTime = hoverValue[0].clone();
          nextHoverTime = func(currentHoverTime);
          nextHoverValue = onDayHover(nextHoverTime);
        } else {
          currentHoverTime = hoverValue[0].isSame(firstSelectedValue, 'day')
            ? hoverValue[1]
            : hoverValue[0];
          nextHoverTime = func(currentHoverTime);
          nextHoverValue = onDayHover(nextHoverTime);
        }
      }

      // Find origin hover time on value index
      if (nextHoverValue.length >= 2) {
        const miss = nextHoverValue.some(
          (ht) => !includesTime(value, ht, 'month'),
        );
        if (miss) {
          const newValue = nextHoverValue
            .slice()
            .sort((t1, t2) => t1.valueOf() - t2.valueOf());
          if (newValue[0].isSame(newValue[1], 'month')) {
            newValue[1] = newValue[0].clone().add(1, 'month');
          }
          fireValueChange(newValue);
        }
      } else if (nextHoverValue.length === 1) {
        // If only one value, let's keep the origin panel
        let oriValueIndex = value.findIndex((time) =>
          time.isSame(currentHoverTime, 'month'),
        );
        if (oriValueIndex === -1) oriValueIndex = 0;

        if (value.every((time) => !time.isSame(nextHoverTime, 'month'))) {
          const newValue = value.slice();
          newValue[oriValueIndex] = nextHoverTime.clone();
          fireValueChange(newValue);
        }
      }

      event.preventDefault();

      return nextHoverTime;
    };

    switch (keyCode) {
      case KeyCode.DOWN:
        updateHoverPoint((time) => goTime(time, 1, 'weeks'));
        return;
      case KeyCode.UP:
        updateHoverPoint((time) => goTime(time, -1, 'weeks'));
        return;
      case KeyCode.LEFT:
        if (ctrlKey) {
          updateHoverPoint((time) => goTime(time, -1, 'years'));
        } else {
          updateHoverPoint((time) => goTime(time, -1, 'days'));
        }
        return;
      case KeyCode.RIGHT:
        if (ctrlKey) {
          updateHoverPoint((time) => goTime(time, 1, 'years'));
        } else {
          updateHoverPoint((time) => goTime(time, 1, 'days'));
        }
        return;
      case KeyCode.HOME:
        updateHoverPoint((time) => goStartMonth(time));
        return;
      case KeyCode.END:
        updateHoverPoint((time) => goEndMonth(time));
        return;
      case KeyCode.PAGE_DOWN:
        updateHoverPoint((time) => goTime(time, 1, 'month'));
        return;
      case KeyCode.PAGE_UP:
        updateHoverPoint((time) => goTime(time, -1, 'month'));
        return;
      case KeyCode.ENTER: {
        let lastValue: Moment;
        if (hoverValue.length === 0) {
          lastValue = updateHoverPoint((time) => time);
        } else if (hoverValue.length === 1) {
          lastValue = hoverValue[0];
        } else {
          lastValue = hoverValue[0].isSame(firstSelectedValue, 'day')
            ? hoverValue[1]
            : hoverValue[0];
        }
        if (lastValue && (!disabledDate || !disabledDate(lastValue))) {
          onSelect(lastValue);
        }
        event.preventDefault();
        return;
      }
      default:
        if (onKeyDown) {
          onKeyDown(event);
        }
    }
  };

  const onDayHover = (value: Moment) => {
    let hoverValue: Moment[] = [];
    const { selectedValue, firstSelectedValue } = state;

    const { type } = props;
    if (type === 'start' && selectedValue[1]) {
      hoverValue =
        compare(value, selectedValue[1]) < 0
          ? [value, selectedValue[1]]
          : [value];
    } else if (type === 'end' && selectedValue[0]) {
      hoverValue =
        compare(value, selectedValue[0]) > 0 ? [selectedValue[0], value] : [];
    } else {
      if (!firstSelectedValue) {
        if (state.hoverValue.length) {
          setState((prev) => ({ ...prev, hoverValue: [] }));
        }
        return hoverValue;
      }
      hoverValue =
        compare(value, firstSelectedValue) < 0
          ? [value, firstSelectedValue]
          : [firstSelectedValue, value];
    }
    fireHoverValueChange(hoverValue);

    return hoverValue;
  };

  const onToday = () => {
    const startValue = getTodayTime(state.value[0]);
    const endValue = startValue.clone().add(1, 'months');
    setState((prev) => ({ ...prev, value: [startValue, endValue] }));
  };

  const onOpenTimePicker = () => {
    setState((prev) => ({ ...prev, showTimePicker: true }));
  };

  const onCloseTimePicker = () => {
    setState((prev) => ({ ...prev, showTimePicker: false }));
  };

  const onOk = () => {
    const { selectedValue } = state;
    if (isAllowedDateAndTime(selectedValue)) {
      props.onOk(state.selectedValue);
    }
  };

  const onStartInputChange = (input: Moment | null) => {
    return onInputSelect('left', input);
  };

  const onEndInputChange = (input: Moment | null) => {
    return onInputSelect('right', input);
  };

  const onStartInputSelect = (input: Moment) => {
    return onInputSelect('left', input, { source: 'dateInputSelect' });
  };

  const onEndInputSelect = (input: Moment) => {
    return onInputSelect('right', input, { source: 'dateInputSelect' });
  };

  const onStartValueChange = (leftValue: Moment) => {
    const value = [...state.value];
    value[0] = leftValue;
    return fireValueChange(value);
  };

  const onEndValueChange = (rightValue: Moment) => {
    const value = [...state.value];
    value[1] = rightValue;
    return fireValueChange(value);
  };

  const onStartPanelChange = (value: Moment | null, mode: Mode) => {
    const newMode = [mode, state.mode[1]];
    const newState: Partial<State> = {
      panelTriggerSource: 'start',
    };
    if (!('mode' in props)) {
      newState.mode = newMode;
    }
    setState((prev) => ({ ...prev, ...newState }));
    const newValue = [value || state.value[0], state.value[1]];
    props.onPanelChange(newValue, newMode);
  };

  const onEndPanelChange = (value: Moment | null, mode: Mode) => {
    const newMode = [state.mode[0], mode];
    const newState: Partial<State> = {
      panelTriggerSource: 'end',
    };
    if (!('mode' in props)) {
      newState.mode = newMode;
    }
    setState((prev) => ({ ...prev, ...newState }));
    const newValue = [state.value[0], value || state.value[1]];
    props.onPanelChange(newValue, newMode);
  };

  useEffect(() => {
    const newState: Partial<State> = {};
    if ('value' in props) {
      newState.value = normalizeAnchor(props, 0);
    }
    if ('hoverValue' in props) {
      if (!isArraysEqual(state.hoverValue, props.hoverValue)) {
        newState.hoverValue = props.hoverValue;
      }
    }
    // TODO This triggers all the time, even when props were not passed. It resets the selectedValue to undefined
    // if ('selectedValue' in props) {
    //   newState.selectedValue = props.selectedValue;
    //   newState.prevSelectedValue = props.selectedValue;
    // }
    if ('mode' in props && !isArraysEqual(state.mode, props.mode)) {
      newState.mode = props.mode;
    }

    setState((prev) => ({
      ...prev,
      ...newState,
    }));
    // We can't pass the whole props otherwise it will cause infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.value,
    props.hoverValue,
    props.selectedValue,
    props.mode,
    state.mode,
    state.hoverValue,
  ]);

  const getStartValue = () => {
    const { selectedValue, showTimePicker, value, mode, panelTriggerSource } =
      state;
    let startValue = value[0];
    // keep selectedTime when select date
    if (selectedValue[0] && props.timePicker) {
      startValue = startValue.clone();
      syncTime(selectedValue[0], startValue);
    }
    if (showTimePicker && selectedValue[0]) {
      startValue = selectedValue[0];
    }

    // Adjust month if date not align
    if (
      panelTriggerSource === 'end' &&
      mode[0] === 'date' &&
      mode[1] === 'date' &&
      startValue.isSame(value[1], 'month')
    ) {
      startValue = startValue.clone().subtract(1, 'month');
    }

    return startValue;
  };

  const getEndValue = () => {
    const { value, selectedValue, showTimePicker, mode, panelTriggerSource } =
      state;
    let endValue = value[1]
      ? value[1].clone()
      : value[0].clone().add(1, 'month');
    // keep selectedTime when select date
    if (selectedValue[1] && props.timePicker) {
      syncTime(selectedValue[1], endValue);
    }
    if (showTimePicker) {
      endValue = selectedValue[1] ? selectedValue[1] : getStartValue();
    }

    // Adjust month if date not align
    if (
      !showTimePicker &&
      panelTriggerSource !== 'end' &&
      mode[0] === 'date' &&
      mode[1] === 'date' &&
      endValue.isSame(value[0], 'month')
    ) {
      endValue = endValue.clone().add(1, 'month');
    }

    return endValue;
  };

  // get disabled hours for second picker
  const getEndDisableTime = () => {
    const { selectedValue, value } = state;
    const { disabledTime } = props;
    const userSettingDisabledTime = disabledTime(selectedValue, 'end') || {};
    const startValue = (selectedValue && selectedValue[0]) || value[0].clone();
    // if startTime and endTime is same day..
    // the second time picker will not able to pick time before first time picker
    if (!selectedValue[1] || startValue.isSame(selectedValue[1], 'day')) {
      const hours = startValue.hour();
      const minutes = startValue.minute();
      const second = startValue.second();
      const { disabledHours, disabledMinutes, disabledSeconds } =
        userSettingDisabledTime;
      const oldDisabledMinutes = disabledMinutes ? disabledMinutes() : [];
      const olddisabledSeconds = disabledSeconds ? disabledSeconds() : [];
      const disabledHoursArray = generateOptions(hours, disabledHours);
      const disabledMinutesArray = generateOptions(minutes, disabledMinutes);
      const disabledSecondsArray = generateOptions(second, disabledSeconds);
      return {
        disabledHours() {
          return disabledHoursArray;
        },
        disabledMinutes(hour: number) {
          if (hour === hours) {
            return disabledMinutesArray;
          }
          return oldDisabledMinutes;
        },
        disabledSeconds(hour: number, minute: number) {
          if (hour === hours && minute === minutes) {
            return disabledSecondsArray;
          }
          return olddisabledSeconds;
        },
      };
    }
    return userSettingDisabledTime;
  };

  const isAllowedDateAndTime = (selectedValue: Moment[]) => {
    return (
      // @ts-expect-error There is a bug in case "showOk" is true, it will indeed call props.disabledTime
      // with a moment object, which is incorrect, it should be an array of moment objects
      isAllowedDate(selectedValue[0], props.disabledDate, disabledStartTime) &&
      // @ts-expect-error There is a bug in case "showOk" is true, it will indeed call props.disabledTime
      // with a moment object, which is incorrect, it should be an array of moment objects
      isAllowedDate(selectedValue[1], props.disabledDate, disabledEndTime)
    );
  };

  const isMonthYearPanelShow = (mode: Mode) => {
    return ['month', 'year', 'decade'].indexOf(mode) > -1;
  };

  const hasSelectedValue = () => {
    const { selectedValue } = state;
    return !!selectedValue[1] && !!selectedValue[0];
  };

  const compare = (v1: Moment, v2: Moment) => {
    if (props.timePicker) {
      return v1.diff(v2);
    }
    return v1.diff(v2, 'days');
  };

  const fireSelectValueChange = (
    selectedValue: Moment[],
    direct?: boolean | null,
    cause?: Cause,
  ) => {
    const { timePicker } = props;
    const { prevSelectedValue } = state;
    if (timePicker && timePicker.props.defaultValue) {
      const timePickerDefaultValue = timePicker.props.defaultValue;
      if (!prevSelectedValue[0] && selectedValue[0]) {
        syncTime(timePickerDefaultValue[0], selectedValue[0]);
      }
      if (!prevSelectedValue[1] && selectedValue[1]) {
        syncTime(timePickerDefaultValue[1], selectedValue[1]);
      }
    }

    if (!('selectedValue' in props)) {
      setState((prev) => ({
        ...prev,
        selectedValue,
      }));
    }

    // If you have not selected a time, enter it directly.
    if (!state.selectedValue[0] || !state.selectedValue[1]) {
      const startValue = selectedValue[0] || moment();
      const endValue = selectedValue[1] || startValue.clone().add(1, 'months');
      setState((prev) => ({
        ...prev,
        selectedValue,
        value: getValueFromSelectedValue([startValue, endValue]),
      }));
    }

    if (selectedValue[0] && !selectedValue[1]) {
      setState((prev) => ({ ...prev, firstSelectedValue: selectedValue[0] }));
      fireHoverValueChange(selectedValue.concat());
    }
    props.onChange(selectedValue);
    if (direct || (selectedValue[0] && selectedValue[1])) {
      setState((prev) => ({
        ...prev,
        prevSelectedValue: selectedValue,
        firstSelectedValue: null,
      }));
      fireHoverValueChange([]);
      props.onSelect(selectedValue, cause);
    }
  };

  const fireValueChange = (value: Moment[]) => {
    if (!('value' in props)) {
      setState((prev) => ({
        ...prev,
        value,
      }));
    }
    props.onValueChange(value);
  };

  const fireHoverValueChange = (hoverValue: Moment[]) => {
    if (!('hoverValue' in props)) {
      setState((prev) => ({ ...prev, hoverValue }));
    }
    props.onHoverChange(hoverValue);
  };

  const clear = () => {
    fireSelectValueChange([], true);
    props.onClear();
  };

  const disabledStartTime = (time: Moment[]) => {
    return props.disabledTime(time, 'start');
  };

  const disabledEndTime = (time: Moment[]) => {
    return props.disabledTime(time, 'end');
  };

  const disabledStartMonth = (month: Moment) => {
    const { value } = state;
    return month.isAfter(value[1], 'month');
  };

  const disabledEndMonth = (month: Moment) => {
    const { value } = state;
    return month.isBefore(value[0], 'month');
  };

  const {
    prefixCls,
    dateInputPlaceholder,
    seperator,
    timePicker,
    showOk,
    locale,
    showClear,
    showToday,
    type,
    clearIcon,
  } = props;

  const { hoverValue, selectedValue, mode, showTimePicker } = state;
  const className = {
    [props.className]: !!props.className,
    [prefixCls]: 1,
    [`${prefixCls}-hidden`]: !props.visible,
    [`${prefixCls}-range`]: 1,
    [`${prefixCls}-show-time-picker`]: showTimePicker,
    [`${prefixCls}-week-number`]: props.showWeekNumber,
  };

  const classes = classnames(className);
  const newProps = {
    selectedValue: state.selectedValue,
    onSelect,
    onDayHover:
      (type === 'start' && selectedValue[1]) ||
      (type === 'end' && selectedValue[0]) ||
      !!hoverValue.length
        ? onDayHover
        : undefined,
  };

  let placeholder1;
  let placeholder2;

  if (dateInputPlaceholder) {
    if (Array.isArray(dateInputPlaceholder)) {
      [placeholder1, placeholder2] = dateInputPlaceholder;
    } else {
      placeholder1 = placeholder2 = dateInputPlaceholder;
    }
  }
  const showOkButton = showOk === true || (showOk !== false && !!timePicker);
  const cls = classnames({
    [`${prefixCls}-footer`]: true,
    [`${prefixCls}-range-bottom`]: true,
    [`${prefixCls}-footer-show-ok`]: showOkButton,
  });

  const startValue = getStartValue();
  const endValue = getEndValue();
  const todayTime = getTodayTime(startValue);
  const thisMonth = todayTime.month();
  const thisYear = todayTime.year();
  const isTodayInView =
    (startValue.year() === thisYear && startValue.month() === thisMonth) ||
    (endValue.year() === thisYear && endValue.month() === thisMonth);
  const nextMonthOfStart = startValue.clone().add(1, 'months');
  const isClosestMonths =
    nextMonthOfStart.year() === endValue.year() &&
    nextMonthOfStart.month() === endValue.month();

  const extraFooter = props.renderFooter();

  const rootRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      ref={rootRef}
      className={classes}
      style={props.style}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {props.renderSidebar()}
      <div className={`${prefixCls}-panel`}>
        {showClear && selectedValue[0] && selectedValue[1] ? (
          <a role="button" title={locale.clear} onClick={clear}>
            {clearIcon || <span className={`${prefixCls}-clear-btn`} />}
          </a>
        ) : null}
        <div
          className={`${prefixCls}-date-panel`}
          onMouseLeave={type !== 'both' ? onDatePanelLeave : undefined}
          onMouseEnter={type !== 'both' ? onDatePanelEnter : undefined}
        >
          <CalendarPart
            {...props}
            {...newProps}
            hoverValue={hoverValue}
            direction="left"
            disabledTime={disabledStartTime}
            disabledMonth={disabledStartMonth}
            format={useGetFormat(props)}
            value={startValue}
            mode={mode[0]}
            placeholder={placeholder1}
            onInputChange={onStartInputChange}
            onInputSelect={onStartInputSelect}
            onValueChange={onStartValueChange}
            onPanelChange={onStartPanelChange}
            showDateInput={props.showDateInput}
            timePicker={timePicker}
            showTimePicker={showTimePicker || mode[0] === 'time'}
            enablePrev
            enableNext={!isClosestMonths || isMonthYearPanelShow(mode[1])}
            clearIcon={clearIcon}
          />
          <span className={`${prefixCls}-range-middle`}>{seperator}</span>
          <CalendarPart
            {...props}
            {...newProps}
            hoverValue={hoverValue}
            direction="right"
            format={useGetFormat(props)}
            timePickerDisabledTime={getEndDisableTime()}
            placeholder={placeholder2}
            value={endValue}
            mode={mode[1]}
            onInputChange={onEndInputChange}
            onInputSelect={onEndInputSelect}
            onValueChange={onEndValueChange}
            onPanelChange={onEndPanelChange}
            showDateInput={props.showDateInput}
            timePicker={timePicker}
            showTimePicker={showTimePicker || mode[1] === 'time'}
            disabledTime={disabledEndTime}
            disabledMonth={disabledEndMonth}
            enablePrev={!isClosestMonths || isMonthYearPanelShow(mode[0])}
            enableNext
            clearIcon={clearIcon}
          />
        </div>
        <div className={cls}>
          {showToday || props.timePicker || showOkButton || extraFooter ? (
            <div className={`${prefixCls}-footer-btn`}>
              {extraFooter}
              {showToday ? (
                <TodayButton
                  {...props}
                  disabled={isTodayInView}
                  value={state.value[0]}
                  onToday={onToday}
                  text={locale.backToToday}
                />
              ) : null}
              {props.timePicker ? (
                <TimePickerButton
                  {...props}
                  showTimePicker={
                    showTimePicker || (mode[0] === 'time' && mode[1] === 'time')
                  }
                  onOpenTimePicker={onOpenTimePicker}
                  onCloseTimePicker={onCloseTimePicker}
                  timePickerDisabled={!hasSelectedValue() || hoverValue.length}
                />
              ) : null}
              {showOkButton ? (
                <OkButton
                  {...props}
                  onOk={onOk}
                  okDisabled={
                    !isAllowedDateAndTime(selectedValue) ||
                    !hasSelectedValue() ||
                    hoverValue.length
                  }
                />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
});

export default RangeCalendar;
