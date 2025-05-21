import {
  cloneElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEventHandler,
  type ReactElement,
  type Ref,
} from 'react';
import placements from './picker/placements';
import Trigger from '@rc-component/trigger';
import type { CalendarProps } from './Calendar';
import type { RangeCalendarProps } from './RangeCalendar';

// No real good way to type the value based on the "calendar" prop
// so we just use "any" for all values and let the user type it
// in their own code
/* eslint-disable @typescript-eslint/no-explicit-any */

interface PickerProps {
  disabled?: boolean;
  /**
   * // TODO Think about what to do with this
   * @deprecated does nothing
   */
  animation?: string;
  /**
   * // TODO Think about what to do with this
   * @deprecated does nothing
   */
  transitionName?: string;
  onChange?: (value: any) => void;
  onOkay?: () => void;
  onOpenChange?: (open: boolean) => void;
  children: (
    state: PickerState & { ref: Ref<any> },
    props: ReturnType<typeof initProps>,
  ) => ReactElement;
  getCalendarContainer?: () => HTMLElement;
  calendar: ReactElement<CalendarProps | RangeCalendarProps>;
  style?: CSSProperties;
  open?: boolean;
  defaultOpen?: boolean;
  prefixCls?: string;
  placement?: string;
  value?: any;
  defaultValue?: any;
  align?: object;
  onBlur?: () => void;
}

function initProps(props: PickerProps) {
  return {
    ...props,
    prefixCls: props.prefixCls || 'rc-calendar-picker',
    style: props.style || {},
    align: props.align || {},
    placement: props.placement || 'bottomLeft',
    defaultOpen: props.defaultOpen || false,
    onChange: props.onChange || (() => {}),
    onOpenChange: props.onOpenChange || (() => {}),
    onBlur: props.onBlur || (() => {}),
  };
}

type PickerState = {
  open: boolean;
  value: any;
};

export default function Picker(rawProps: PickerProps) {
  const props = initProps(rawProps);
  const calendarProps = props.calendar.props;

  const [state, setState] = useState<PickerState>({
    open: props.open || props.defaultOpen,
    value: props.value || props.defaultValue,
  });

  const calendarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (state.open) {
      const focusCalendar = () => {
        if (calendarRef.current) {
          calendarRef.current.focus();
        }
      };

      const focusTimeout = setTimeout(focusCalendar, 0);
      return () => clearTimeout(focusTimeout);
    }
  }, [state.open]);

  const onCalendarKeyDown: KeyboardEventHandler = (event) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      close();
    }
  };

  const onCalendarSelect = (value: any, cause: any = {}) => {
    if (calendarProps.onSelect) {
      calendarProps.onSelect(value, cause);
    }

    if (!('value' in props)) {
      setState((prev) => ({ ...prev, value }));
    }
    if (
      cause.source === 'keyboard' ||
      cause.source === 'dateInputSelect' ||
      (!props.calendar.props.timePicker && cause.source !== 'dateInput') ||
      cause.source === 'todayButton'
    ) {
      close();
    }
    props.onChange(value);
  };

  const onKeyDown: KeyboardEventHandler = (event) => {
    if (!state.open && (event.key === 'ArrowDown' || event.key === 'Enter')) {
      open();
      event.preventDefault();
    }
  };

  const onCalendarOk = (v: any) => {
    if (calendarProps.onOk) {
      calendarProps.onOk(v);
    }

    close();
  };

  const onCalendarClear = () => {
    if (calendarProps.onClear) {
      calendarProps.onClear();
    }

    close();
  };

  const onCalendarBlur = () => {
    if ((calendarProps as any).onBlur) {
      (calendarProps as any).onBlur();
    }

    setOpen(false);
  };

  const onVisibleChange = (open: boolean) => {
    setOpen(open);
  };

  useEffect(() => {
    setState((prev) => ({ ...prev, value: props.value }));
  }, [props.value]);

  useEffect(() => {
    if (props.open !== undefined) {
      setState((prev) => ({ ...prev, open: !!props.open }));
    }
  }, [props.open]);

  const getCalendarElement = () => {
    const { value } = state;
    const defaultValue = value;
    const extraProps = {
      ref: calendarRef,
      defaultValue: defaultValue || calendarProps.defaultValue,
      selectedValue: value,
      onKeyDown: onCalendarKeyDown,
      onOk: onCalendarOk,
      onSelect: onCalendarSelect,
      onClear: onCalendarClear,
      onBlur: onCalendarBlur,
    };

    return cloneElement(props.calendar, extraProps);
  };

  const setOpen = (open: boolean) => {
    const { onOpenChange } = props;
    if (state.open !== open) {
      if (!('open' in props)) {
        setState((prev) => ({ ...prev, open }));
      }
      onOpenChange(open);
    }
  };

  const open = () => {
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    focus();
  };

  const focus = () => {
    if (ref.current) {
      ref.current.focus();
    }
  };

  const {
    prefixCls,
    placement,
    style,
    getCalendarContainer,
    align,
    disabled,
    children,
  } = props;

  const ref = useRef<HTMLElement>(null);

  return (
    <Trigger
      popup={getCalendarElement()}
      popupAlign={align}
      builtinPlacements={placements}
      popupPlacement={placement}
      action={disabled && !state.open ? [] : ['click']}
      autoDestroy
      getPopupContainer={getCalendarContainer}
      popupStyle={style}
      // TODO I think these will not work with rc-trigger v3
      // popupAnimation={animation}
      // popupTransitionName={transitionName}
      popupVisible={state.open}
      onOpenChange={onVisibleChange}
      prefixCls={prefixCls}
    >
      {cloneElement(
        children({ ...state, ref }, props) as ReactElement<{
          onKeyDown?: KeyboardEventHandler;
        }>,
        {
          onKeyDown,
        },
      )}
    </Trigger>
  );
}
