import '../assets/index.less';
import { useState } from 'react';
import Calendar from '../src/Calendar';
import DatePicker from '../src/Picker';

import zhCN from '../src/locale/zh_CN';
import enUS from '../src/locale/en_US';

import moment, { type Moment } from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';
import { renderDemo } from './demo';

const cn = location.search.indexOf('cn') !== -1;

const now = moment();
if (cn) {
  now.locale('zh-cn').utcOffset(8);
} else {
  now.locale('en-gb').utcOffset(0);
}

function getFormat() {
  return 'YYYY-MM-DD';
}

const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'month');

const SHOW_TIME = true;

function Picker(props: {
  disabledDate?: (date: Moment) => boolean;
  value?: Moment | null;
  onChange?: (value: Moment | null) => void;
}) {
  const { disabledDate, onChange, value } = props;

  const calendar = (
    <Calendar
      locale={cn ? zhCN : enUS}
      defaultValue={now}
      disabledDate={disabledDate}
    />
  );
  return (
    <DatePicker
      animation="slide-up"
      calendar={calendar}
      value={value}
      onChange={onChange}
    >
      {({ value }) => {
        return (
          <span>
            <input
              placeholder="请选择日期"
              style={{ width: 250 }}
              readOnly
              value={(value && value.format(getFormat())) || ''}
            />
          </span>
        );
      }}
    </DatePicker>
  );
}

function Demo() {
  const [startValue, setStartValue] = useState<Moment | null>(null);
  const [endValue, setEndValue] = useState<Moment | null>(null);

  const log = (field: string, value: Moment | null) => {
    console.log('onChange', field, value && value.format(getFormat()));
  };

  const disabledEndDate = (endValue: Moment | null) => {
    if (!endValue) {
      return false;
    }
    if (!startValue) {
      return false;
    }

    return SHOW_TIME
      ? endValue.isBefore(startValue)
      : endValue.diff(startValue, 'days') <= 0;
  };

  const disabledStartDate = (startValue: Moment | null) => {
    if (!startValue) {
      return false;
    }
    if (!endValue) {
      return false;
    }
    return SHOW_TIME
      ? endValue.isBefore(startValue)
      : endValue.diff(startValue, 'days') <= 0;
  };

  return (
    <div style={{ width: 240, margin: 20 }}>
      <p>
        开始时间：
        <Picker
          disabledDate={disabledStartDate}
          value={startValue}
          onChange={(value) => {
            log('startValue', value);
            setStartValue(value);
          }}
        />
      </p>

      <p>
        结束时间：
        <Picker
          disabledDate={disabledEndDate}
          value={endValue}
          onChange={(value) => {
            log('endValue', value);
            setEndValue(value);
          }}
        />
      </p>
    </div>
  );
}

renderDemo(<Demo />);
