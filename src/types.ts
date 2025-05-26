import type { Moment } from 'moment';

export type Mode = 'time' | 'date' | 'month' | 'year' | 'decade';

export type Cause = {
  source: string;
};

export type DisabledTimeFn = (
  date: Moment | null | undefined,
  type?: string,
) => DisabledTimeConfig;

export type DisabledTimeConfig = {
  disabledHours: (hours?: number) => number[];
  disabledMinutes: (hour?: number) => number[];
  disabledSeconds: (hour?: number, minute?: number) => number[];
};

export type Locale = {
  today: string;
  now: string;
  backToToday: string;
  ok: string;
  clear: string;
  month: string;
  year: string;
  timeSelect: string;
  dateSelect: string;
  weekSelect: string;
  monthSelect: string;
  yearSelect: string;
  decadeSelect: string;
  yearFormat: string;
  monthFormat?: string;
  dateFormat: string;
  dayFormat: string;
  dateTimeFormat: string;
  monthBeforeYear?: boolean;
  previousMonth: string;
  nextMonth: string;
  previousYear: string;
  nextYear: string;
  previousDecade: string;
  nextDecade: string;
  previousCentury: string;
  nextCentury: string;
};

export type TimePickerRangeProps = {
  onChange?: (value: Moment) => void;
  showHour?: boolean;
  showMinute?: boolean;
  defaultValue?: Moment[];
  defaultOpenValue?: Moment;
  showSecond?: boolean;
  value?: Moment;
};
