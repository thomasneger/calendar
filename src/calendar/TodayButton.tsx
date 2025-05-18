import type { Moment } from 'moment';
import type { Locale } from '../types';
import { getTodayTimeStr, getTodayTime, isAllowedDate } from '../util';
import type { ReactElement } from 'react';

type Props = {
  prefixCls: string;
  locale: Locale;
  value: Moment;
  timePicker?: ReactElement | null;
  disabled?: boolean;
  disabledDate?: (date: Moment) => boolean;
  onToday?: () => void;
  text?: string;
};

export default function TodayButton({
  prefixCls,
  locale,
  value,
  timePicker,
  disabled,
  disabledDate,
  onToday,
  text,
}: Props) {
  const localeNow = (!text && timePicker ? locale.now : text) || locale.today;
  const disabledToday =
    disabledDate && !isAllowedDate(getTodayTime(value), disabledDate);
  const isDisabled = disabledToday || disabled;
  const disabledTodayClass = isDisabled
    ? `${prefixCls}-today-btn-disabled`
    : '';

  return (
    <a
      className={`${prefixCls}-today-btn ${disabledTodayClass}`}
      role="button"
      onClick={isDisabled ? undefined : onToday}
      title={getTodayTimeStr(value)}
    >
      {localeNow}
    </a>
  );
}
