import type { Moment, MomentInput } from 'moment';

export function goStartMonth(time: Moment) {
  return time.clone().startOf('month');
}

export function goEndMonth(time: Moment) {
  return time.clone().endOf('month');
}

export type Unit =
  | 'years'
  | 'month'
  | 'weeks'
  | 'days'
  | 'hour'
  | 'minute'
  | 'second';

export function goTime(time: Moment, direction: number, unit: Unit) {
  return time.clone().add(direction, unit);
}

export function includesTime(
  timeList: Moment[] = [],
  time: MomentInput,
  unit: 'month',
) {
  return timeList.some((t) => t.isSame(time, unit));
}
