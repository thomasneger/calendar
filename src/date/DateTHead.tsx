import DateConstants from './DateConstants';
import moment, { type Moment } from 'moment';

interface Props {
  prefixCls: string;
  value: Moment;
  showWeekNumber?: boolean;
}

export default function DateTHead(props: Props) {
  const { value, prefixCls, showWeekNumber } = props;
  const localeData = value.localeData();
  const veryShortWeekdays: string[] = [];
  const weekDays = [];
  const firstDayOfWeek = localeData.firstDayOfWeek();
  let showWeekNumberEl;
  const now = moment();

  for (
    let dateColIndex = 0;
    dateColIndex < DateConstants.DATE_COL_COUNT;
    dateColIndex++
  ) {
    const index =
      (firstDayOfWeek + dateColIndex) % DateConstants.DATE_COL_COUNT;
    now.day(index);
    veryShortWeekdays[dateColIndex] = localeData.weekdaysMin(now);
    weekDays[dateColIndex] = localeData.weekdaysShort(now);
  }

  if (showWeekNumber) {
    showWeekNumberEl = (
      <th
        role="columnheader"
        className={`${prefixCls}-column-header ${prefixCls}-week-number-header`}
      >
        <span className={`${prefixCls}-column-header-inner`}>x</span>
      </th>
    );
  }

  const weekDaysEls = weekDays.map((day, xindex) => {
    return (
      <th
        key={xindex}
        role="columnheader"
        title={day}
        className={`${prefixCls}-column-header`}
      >
        <span className={`${prefixCls}-column-header-inner`}>
          {veryShortWeekdays[xindex]}
        </span>
      </th>
    );
  });

  return (
    <thead>
      <tr role="row">
        {showWeekNumberEl}
        {weekDaysEls}
      </tr>
    </thead>
  );
}
