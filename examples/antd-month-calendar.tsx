import '../assets/index.less';
import { useState } from 'react';
import MonthCalendar from '../src/MonthCalendar';
import DatePicker from '../src/Picker';

import zhCN from '../src/locale/zh_CN';
import enUS from '../src/locale/en_US';

import moment, { type Moment } from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';

import { renderDemo } from './demo';

const format = 'YYYY-MM';
const cn = location.search.indexOf('cn') !== -1;

const now = moment();
if (cn) {
  now.locale('zh-cn').utcOffset(8);
} else {
  now.locale('en-gb').utcOffset(0);
}

const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'month');

function Demo(props: { defaultValue: Moment }) {
  const { defaultValue } = props;

  const [disabled, setDisabled] = useState(false);
  const [value, setValue] = useState<Moment | null>(defaultValue);

  const onChange = (value: Moment) => {
    console.log(`DatePicker change: ${value && value.format(format)}`);
    setValue(value);
  };

  const toggleDisabled = () => {
    setDisabled(!disabled);
  };

  const calendar = (
    <MonthCalendar locale={cn ? zhCN : enUS} style={{ zIndex: 1000 }} />
  );

  return (
    <div style={{ width: 240, margin: 20 }}>
      <div style={{ marginBottom: 10 }}>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <label>
          <input checked={disabled} onChange={toggleDisabled} type="checkbox" />{' '}
          disabled
        </label>
      </div>
      <div
        style={{
          boxSizing: 'border-box',
          position: 'relative',
          display: 'block',
          lineHeight: 1.5,
          marginBottom: 22,
        }}
      >
        <DatePicker
          animation="slide-up"
          disabled={disabled}
          calendar={calendar}
          value={value}
          onChange={onChange}
        >
          {({ value }) => {
            return (
              <input
                style={{ width: 200 }}
                readOnly
                disabled={disabled}
                value={value && value.format(format)}
                placeholder="请选择日期"
              />
            );
          }}
        </DatePicker>
      </div>
    </div>
  );
}

function onStandaloneSelect(value: Moment) {
  console.log('month-calendar select', value && value.format(format));
}

function onStandaloneChange(value: Moment) {
  console.log('month-calendar change', value && value.format(format));
}

function disabledDate(value: Moment) {
  return (
    value.year() > now.year() ||
    (value.year() === now.year() && value.month() > now.month())
  );
}

function onMonthCellContentRender(value: Moment) {
  return `${value.month() + 1}月`;
}

renderDemo(
  <>
    <MonthCalendar
      locale={cn ? zhCN : enUS}
      style={{ zIndex: 1000 }}
      disabledDate={disabledDate}
      onSelect={onStandaloneSelect}
      onChange={onStandaloneChange}
      monthCellContentRender={onMonthCellContentRender}
      defaultValue={defaultCalendarValue}
      renderFooter={() => 'extra footer'}
    />

    <div style={{ marginTop: 200 }}>
      <Demo defaultValue={now} />
    </div>
  </>,
);
