import React, { type ReactElement } from 'react';
import cx from 'classnames';
import TodayButton from './TodayButton';
import OkButton from './OkButton';
import TimePickerButton from './TimePickerButton';
import type { Moment } from 'moment';
import type { DisabledTimeFn, Locale, Mode } from '../types';

interface Props {
  prefixCls: string;
  value: Moment;
  showToday: boolean;
  timePicker: ReactElement | null;
  renderFooter?: (mode: Mode | null) => React.ReactNode;
  mode: Mode | null;
  showOk?: boolean;
  onSelect: (value: Moment) => void;
  locale: Locale;
  disabledDate?: (date: Moment) => boolean;
  disabledTime?: DisabledTimeFn;
  showTimePicker?: boolean;
  showDateInput?: boolean;
  selectedValue?: Moment | null;
  timePickerDisabled?: boolean;
  okDisabled?: boolean;
  onOk?: () => void;
  onToday?: () => void;
  onClear?: () => void;
  onOpenTimePicker?: () => void;
  onCloseTimePicker?: () => void;
}

export default function CalendarFooter(props: Props) {
  const {
    value,
    prefixCls,
    showOk,
    timePicker,
    renderFooter,
    mode,
    showToday,
  } = props;

  let footerEl = null;
  const extraFooter = renderFooter && renderFooter(mode);

  if (showToday || timePicker || extraFooter) {
    let nowEl;
    if (showToday) {
      nowEl = <TodayButton {...props} value={value} />;
    }
    let okBtn;
    if (showOk === true || (showOk !== false && !!props.timePicker)) {
      okBtn = <OkButton {...props} />;
    }
    let timePickerBtn;
    if (props.timePicker) {
      timePickerBtn = <TimePickerButton {...props} />;
    }

    let footerBtn;
    if (nowEl || timePickerBtn || okBtn || extraFooter) {
      footerBtn = (
        <span className={`${prefixCls}-footer-btn`}>
          {extraFooter}
          {nowEl}
          {timePickerBtn}
          {okBtn}
        </span>
      );
    }
    const cls = cx(`${prefixCls}-footer`, {
      [`${prefixCls}-footer-show-ok`]: okBtn,
    });
    footerEl = <div className={cls}>{footerBtn}</div>;
  }

  return footerEl;
}
