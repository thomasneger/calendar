import DateTHead from './DateTHead';
import DateTBody from './DateTBody';

import type { Moment } from 'moment';

interface Props {
  prefixCls: string;
  onSelect: (current: Moment) => void;
  selectedValue: Moment | null | undefined;
  value: Moment;
  showWeekNumber?: boolean;
  dateRender?: (current: Moment, value: Moment) => React.ReactNode;
  disabledDate?: (current: Moment, value: Moment) => boolean;
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
