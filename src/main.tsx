import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Calendar, { type CalendarProps } from './Calendar';
import '../assets/index.less';

import 'rc-time-picker/assets/index.css';

import TimePickerPanel from 'rc-time-picker/lib/Panel';
import moment from 'moment';
import RangeCalendar from './RangeCalendar';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Example />
  </StrictMode>,
);

type Mode = CalendarProps['mode'];

function Example() {
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
        timePicker={<TimePickerPanel />}
        disabledTime={() => true}
        selectedValue={value}
        value={value}
        mode={mode}
        onPanelChange={(_, panel) => setMode(panel)}
        onChange={(v) => setInput(v.format('MM/DD/YYYY HH:mm:ss'))}
      />

      <RangeCalendar />
    </div>
  );
}
