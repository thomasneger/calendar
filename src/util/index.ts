import moment, { type Moment } from 'moment';
import type { DisabledTimeConfig } from '../types';

type Value = (Moment | null | undefined) | Moment[];

type DisabledTimeFn<T extends Value> = (
  date: T,
  type?: string,
) => DisabledTimeConfig;

const defaultDisabledTime: DisabledTimeConfig = {
  disabledHours() {
    return [];
  },
  disabledMinutes() {
    return [];
  },
  disabledSeconds() {
    return [];
  },
};

export function getTodayTime(value: Moment) {
  const today = moment();
  today.locale(value.locale()).utcOffset(value.utcOffset());
  return today;
}

export function getTitleString(value: Moment) {
  return value.format('LL');
}

export function getTodayTimeStr(value: Moment) {
  const today = getTodayTime(value);
  return getTitleString(today);
}

export function getMonthName(month: Moment) {
  const locale = month.locale();
  const localeData = month.localeData();
  return localeData[locale === 'zh-cn' ? 'months' : 'monthsShort'](month);
}

export function syncTime(from: Moment | undefined, to: Moment | undefined) {
  if (!moment.isMoment(from) || !moment.isMoment(to)) return;
  to.hour(from.hour());
  to.minute(from.minute());
  to.second(from.second());
  to.millisecond(from.millisecond());
}

export function getTimeConfig<T extends Value>(
  value: T,
  disabledTime: DisabledTimeFn<T>,
): DisabledTimeConfig {
  const disabledTimeConfig = disabledTime ? disabledTime(value) : {};

  return {
    ...defaultDisabledTime,
    ...disabledTimeConfig,
  };
}

export function isTimeValidByConfig(
  value: Moment,
  disabledTimeConfig: DisabledTimeConfig,
) {
  let invalidTime = false;
  if (value) {
    const hour = value.hour();
    const minutes = value.minute();
    const seconds = value.second();
    const disabledHours = disabledTimeConfig.disabledHours();
    if (disabledHours.indexOf(hour) === -1) {
      const disabledMinutes = disabledTimeConfig.disabledMinutes(hour);
      if (disabledMinutes.indexOf(minutes) === -1) {
        const disabledSeconds = disabledTimeConfig.disabledSeconds(
          hour,
          minutes,
        );
        invalidTime = disabledSeconds.indexOf(seconds) !== -1;
      } else {
        invalidTime = true;
      }
    } else {
      invalidTime = true;
    }
  }
  return !invalidTime;
}

export function isTimeValid(
  value: Moment,
  disabledTime: DisabledTimeFn<Moment>,
) {
  const disabledTimeConfig = getTimeConfig<Moment>(value, disabledTime);

  return isTimeValidByConfig(value, disabledTimeConfig);
}

export function isAllowedDate(
  value: Moment,
  disabledDate?: (value: Moment) => boolean,
  disabledTime?: DisabledTimeFn<Moment>,
) {
  if (disabledDate) {
    if (disabledDate(value)) {
      return false;
    }
  }
  if (disabledTime) {
    if (!isTimeValid(value, disabledTime)) {
      return false;
    }
  }
  return true;
}

export function formatDate(
  value: Moment | null | undefined,
  format: string | string[],
) {
  if (!value) {
    return '';
  }

  if (Array.isArray(format)) {
    format = format[0];
  }

  return value.format(format);
}
