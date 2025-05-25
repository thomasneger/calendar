import DateTHead from './DateTHead';
import DateTBody from './DateTBody';

import type { Moment } from 'moment';
import type { ReactNode } from 'react';
import type { Locale } from '../types';

interface Props {
  prefixCls: string;
  onSelect: (current: Moment) => void;
  selectedValue?: Moment | Moment[] | null | undefined;
  value: Moment;
  hoverValue?: Moment[];
  onDayHover?: (value: Moment) => void;
  showWeekNumber?: boolean;
  dateRender?: (current: Moment, value: Moment) => ReactNode;
  disabledDate?: (current: Moment, value: Moment) => boolean;
  contentRender?: (current: Moment, value: Moment) => ReactNode;
  locale?: Locale;
}

export default function DateTable(props: Props) {
  const { prefixCls } = props;
  return (
    <table className={`${prefixCls}-table`} cellSpacing="0" role="grid">
      <DateTHead {...props} />
      <DateTBody {...props} />
    </table>
  );
}
