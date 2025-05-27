import { useState } from 'react';
import Picker from '../src/Picker';
import RangeCalendar from '../src/RangeCalendar';
import zhCN from '../src/locale/zh_CN';
import enUS from '../src/locale/en_US';
import TimePickerPanel from '../src/TimePickerPanel';
import '../assets/index.less';

import moment, { type Moment } from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';
import { renderDemo } from './demo';

const cn = location.search.indexOf('cn') !== -1;

if (cn) {
  moment.locale('zh-cn');
} else {
  moment.locale('en-gb');
}

const now = moment();
if (cn) {
  now.utcOffset(8);
} else {
  now.utcOffset(0);
}

const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'month');

const timePickerElement = (
  <TimePickerPanel
    defaultValue={[
      moment('00:00:00', 'HH:mm:ss'),
      moment('23:59:59', 'HH:mm:ss'),
    ]}
  />
);

function newArray(start: number, end: number) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

function disabledDate(current: Moment) {
  const date = moment();
  date.hour(0);
  date.minute(0);
  date.second(0);
  return current.isBefore(date); // can not select days before today
}

function disabledTime(time: Moment[], type: string) {
  console.log('disabledTime', time, type);
  if (type === 'start') {
    return {
      disabledHours() {
        const hours = newArray(0, 60);
        hours.splice(20, 4);
        return hours;
      },
      disabledMinutes(h: number | undefined) {
        if (h === 20) {
          return newArray(0, 31);
        } else if (h === 23) {
          return newArray(30, 60);
        }
        return [];
      },
      disabledSeconds() {
        return [55, 56];
      },
    };
  }
  return {
    disabledHours() {
      const hours = newArray(0, 60);
      hours.splice(2, 6);
      return hours;
    },
    disabledMinutes(h: number) {
      if (h === 20) {
        return newArray(0, 31);
      } else if (h === 23) {
        return newArray(30, 60);
      }
      return [];
    },
    disabledSeconds() {
      return [55, 56];
    },
  };
}

const formatStr = 'YYYY-MM-DD HH:mm:ss';
function format(v: Moment) {
  return v ? v.format(formatStr) : '';
}

function isValidRange(v: Moment[] | null) {
  return v && v[0] && v[1];
}

function onStandaloneChange(value: Moment[]) {
  console.log('onChange');
  console.log(value[0] && format(value[0]), value[1] && format(value[1]));
}

function onStandaloneSelect(value: Moment[]) {
  console.log('onSelect');
  console.log(format(value[0]), format(value[1]));
}

function Demo() {
  const [value, setValue] = useState<Moment[]>([]);
  const [hoverValue, setHoverValue] = useState<Moment[]>([]);

  const onChange = (value: Moment[]) => {
    console.log('onChange', value);
    setValue(value);
  };

  const onHoverChange = (hoverValue: Moment[]) => {
    console.log('hoverValue', hoverValue);
    setHoverValue(hoverValue);
  };

  const calendar = (
    <RangeCalendar
      hoverValue={hoverValue}
      onHoverChange={onHoverChange}
      showWeekNumber={false}
      dateInputPlaceholder={['start', 'end']}
      defaultValue={[now, now.clone().add(1, 'months')]}
      locale={cn ? zhCN : enUS}
      disabledTime={disabledTime}
      timePicker={timePickerElement}
    />
  );
  return (
    <Picker
      value={value}
      onChange={onChange}
      animation="slide-up"
      calendar={calendar}
    >
      {({ value }) => {
        return (
          <span>
            <input
              placeholder="please select"
              style={{ width: 350 }}
              readOnly
              className="ant-calendar-picker-input ant-input"
              value={
                (isValidRange(value) &&
                  `${format(value[0])} - ${format(value[1])}`) ||
                ''
              }
            />
          </span>
        );
      }}
    </Picker>
  );
}

renderDemo(
  <div>
    <h2>calendar</h2>
    <div style={{ margin: 10 }}>
      <RangeCalendar
        showToday={false}
        showWeekNumber
        dateInputPlaceholder={['start', 'end']}
        locale={cn ? zhCN : enUS}
        showOk={false}
        showClear
        format={formatStr}
        onChange={onStandaloneChange}
        onSelect={onStandaloneSelect}
        disabledDate={disabledDate}
        timePicker={timePickerElement}
        disabledTime={disabledTime}
        renderFooter={() => <span>extra footer</span>}
      />
    </div>
    <br />

    <div style={{ margin: 20 }}>
      <Demo />
    </div>
  </div>,
);
