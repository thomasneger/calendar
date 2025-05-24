import moment, { type Moment } from 'moment';
import { useState } from 'react';
import Calendar, { type CalendarProps } from './Calendar';
import Picker from './Picker';
import RangeCalendar from './RangeCalendar';
import MonthCalendar from './MonthCalendar';
import FullCalendar from './FullCalendar';

// @ts-expect-error importing css
import '../assets/index.less';
// @ts-expect-error importing css
import 'rc-time-picker/assets/index.css';

type Mode = CalendarProps['mode'];

export function Example() {
  const [input, setInput] = useState('5/13/2025 21:42:54');
  const [mode, setMode] = useState<Mode>('date');

  const value = moment(input, 'MM/DD/YYYY HH:mm:ss');

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />

      <select name="" id="" onChange={(e) => setMode(e.target.value as Mode)}>
        <option value="year">year</option>
        <option value="month">month</option>
        <option value="date">date</option>
        <option value="time">time</option>
        <option value="decade">decade</option>
      </select>

      <Calendar
        // prefixCls='rc-calendar'
        className="demo-calendar"
        showWeekNumber
        showDateInput
        showOk
        showToday
        disabledDate={(curr, selected) => {
          if (curr.isSame(selected, 'week')) {
            return true;
          }

          return false;
        }}
        selectedValue={value}
        value={value}
        mode={mode}
        onPanelChange={(_, panel) => setMode(panel)}
        onChange={(v) => setInput(v.format('MM/DD/YYYY HH:mm:ss'))}
      />

      <RangeCalendar />

      <Picker
        calendar={<RangeCalendar />}
        value={[value, value.clone().add(2, 'day')]}
      >
        {({ ref, value }) => {
          return (
            <span>
              <input
                value={format(value)}
                ref={ref}
                placeholder="Pick a date"
                style={{ width: 250 }}
                disabled={false}
                readOnly
              />
            </span>
          );
        }}
      </Picker>

      <MonthCalendar />

      <FullCalendar />
    </div>
  );
}

function format(value: Moment | Moment[] | null) {
  if (!value) {
    return '';
  }

  if (Array.isArray(value)) {
    return value.map((v) => v.format('YYYY-MM-DD HH:mm:ss')).join(' - ');
  }

  return value.format('YYYY-MM-DD HH:mm:ss');
}
