import '../assets/index.less';
import { useState } from 'react';
import RangeCalendar from '../src/RangeCalendar';
import DatePicker from '../src/Picker';

import zhCN from '../src/locale/zh_CN';
import enUS from '../src/locale/en_US';

import moment, { type Moment } from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';
import { renderDemo } from './demo';

const format = 'YYYY-MM-DD';

const fullFormat = 'YYYY-MM-DD dddd';
const cn = location.search.indexOf('cn') !== -1;

const now = moment();
if (cn) {
  now.locale('zh-cn').utcOffset(8);
} else {
  now.locale('en-gb').utcOffset(0);
}

type PickerProps = {
  showValue?: Moment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: Moment[];
  onChange: (value: Moment[]) => void;
  disabledDate?: (date: Moment) => boolean;
  type?: 'start' | 'end';
};

function Picker({
  showValue,
  open,
  onOpenChange,
  value,
  onChange,
  disabledDate,
  type,
}: PickerProps) {
  const [hoverValue, setHoverValue] = useState<Moment[]>([]);

  const onHoverChange = (hoverValue: Moment[]) => {
    console.log(hoverValue);
    setHoverValue(hoverValue);
  };

  const calendar = (
    <RangeCalendar
      hoverValue={hoverValue}
      onHoverChange={onHoverChange}
      type={type}
      locale={cn ? zhCN : enUS}
      defaultValue={now}
      format={format}
      onChange={onChange}
      disabledDate={disabledDate}
    />
  );
  return (
    <DatePicker
      open={open}
      onOpenChange={onOpenChange}
      calendar={calendar}
      value={value}
    >
      {() => {
        return (
          <span>
            <input
              placeholder="请选择日期"
              style={{ width: 250 }}
              readOnly
              value={(showValue && showValue.format(fullFormat)) || ''}
            />
          </span>
        );
      }}
    </DatePicker>
  );
}

function Demo() {
  const [startValue, setStartValue] = useState<Moment>();
  const [endValue, setEndValue] = useState<Moment>();
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  const onStartOpenChange = (startOpen: boolean) => {
    setStartOpen(startOpen);
  };

  const onEndOpenChange = (endOpen: boolean) => {
    setEndOpen(endOpen);
  };

  const onStartChange = (value: Moment[]) => {
    setStartValue(value[0]);
    setStartOpen(false);
    setEndOpen(true);
  };

  const onEndChange = (value: Moment[]) => {
    setEndValue(value[1]);
  };

  const disabledStartDate = (endValue: Moment) => {
    if (!endValue) {
      return false;
    }
    if (!startValue) {
      return false;
    }
    return endValue.diff(startValue, 'days') < 0;
  };

  return (
    <div style={{ width: 240, margin: 20 }}>
      <p>
        开始时间：
        <Picker
          onOpenChange={onStartOpenChange}
          type="start"
          showValue={startValue}
          open={startOpen}
          value={[startValue, endValue]}
          onChange={onStartChange}
        />
      </p>

      <p>
        结束时间：
        <Picker
          onOpenChange={onEndOpenChange}
          open={endOpen}
          type="end"
          showValue={endValue}
          disabledDate={disabledStartDate}
          value={[startValue, endValue]}
          onChange={onEndChange}
        />
      </p>
    </div>
  );
}

renderDemo(<Demo />);
