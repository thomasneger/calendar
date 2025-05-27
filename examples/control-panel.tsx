import '../assets/index.less';
import { useState } from 'react';
import Calendar from '../src/Calendar';
import RangeCalendar from '../src/RangeCalendar';
import { renderDemo } from './demo';
import type { Mode } from '../src/types';

function Demo() {
  const [mode, setMode] = useState<Mode>('month');
  const [rangeStartMode, setRangeStartMode] = useState<Mode>('date');
  const [rangeEndMode, setRangeEndMode] = useState<Mode>('date');

  return (
    <>
      <h2>controle Calendar panel</h2>
      <select
        value={mode}
        style={{ width: 500 }}
        onChange={(e) => {
          setMode(e.target.value as Mode);
        }}
      >
        {['time', 'date', 'month', 'year', 'decade'].map((item) => (
          <option value={item} key={item}>
            {item}
          </option>
        ))}
      </select>
      <Calendar
        mode={mode}
        onPanelChange={(...args) => console.log('on panel change', ...args)}
      />
      <h2>controle RangeCalendar panel</h2>
      <select
        value={rangeStartMode}
        style={{ width: 500 }}
        onChange={(e) => {
          setRangeStartMode(e.target.value as Mode);
        }}
      >
        {['date', 'month', 'year', 'decade'].map((item) => (
          <option value={item} key={item}>
            {item}
          </option>
        ))}
      </select>
      <select
        value={rangeEndMode}
        style={{ width: 500 }}
        onChange={(e) => {
          setRangeEndMode(e.target.value as Mode);
        }}
      >
        {['date', 'month', 'year', 'decade'].map((item) => (
          <option value={item} key={item}>
            {item}
          </option>
        ))}
      </select>
      <RangeCalendar
        mode={[rangeStartMode, rangeEndMode]}
        onPanelChange={(...args) =>
          console.log('on range panel change', ...args)
        }
      />
    </>
  );
}

renderDemo(<Demo />);
