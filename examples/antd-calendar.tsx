// @ts-expect-error importing css
import '../assets/index.less';
import { type ChangeEventHandler, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import Calendar from '../src/Calendar';
import DatePicker from '../src/Picker';
import zhCN from '../src/locale/zh_CN';
import enUS from '../src/locale/en_US';
import TimePickerPanel from '../src/TimePickerPanel';

import moment, { type Moment } from 'moment';
// @ts-expect-error moment locale import is not typed
import 'moment/locale/zh-cn';
// @ts-expect-error moment locale import is not typed
import 'moment/locale/en-gb';

const format = 'YYYY-MM-DD HH:mm:ss';
const cn = location.search.indexOf('cn') !== -1;

const now = moment();
if (cn) {
  now.locale('zh-cn').utcOffset(8);
} else {
  now.locale('en-gb').utcOffset(0);
}

function getFormat(time: boolean) {
  return time ? format : 'YYYY-MM-DD';
}

const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'month');

const timePickerElement = (
  <TimePickerPanel defaultValue={moment('00:00:00', 'HH:mm:ss')} />
);

function disabledTime(date: Moment | null) {
  console.log('disabledTime', date);
  if (date && date.date() === 15) {
    return {
      disabledHours() {
        return [3, 4];
      },
    };
  }
  return {
    disabledHours() {
      return [1, 2];
    },
  };
}

function disabledDate(current: Moment | null) {
  if (!current) {
    // allow empty select
    return false;
  }
  const date = moment();
  date.hour(0);
  date.minute(0);
  date.second(0);
  return current.valueOf() < date.valueOf(); // can not select days before today
}

function Demo(props: { defaultValue?: Moment; defaultCalendarValue?: Moment }) {
  const { defaultValue } = props;

  const [showTime, setShowTime] = useState(true);
  const [showDateInput, setShowDateInput] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const calendarContainerRef = useRef<HTMLDivElement>(null);

  const onChange = (value: Moment) => {
    console.log('DatePicker change: ', value && value.format(format));
    setValue(value);
  };

  const onShowTimeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setShowTime(e.target.checked);
  };

  const onShowDateInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setShowDateInput(e.target.checked);
  };

  const onOpenChange = (open: boolean) => {
    setOpen(open);
  };

  const onFocus = () => {
    if (!open && isMouseDown) {
      // focus from a "click" event, let the picker trigger automatically open the calendar
      setIsMouseDown(false);
    } else {
      // focus not caused by "click" (such as programmatic or via keyboard)
      setOpen(true);
    }
  };

  const onMouseDown = () => {
    setIsMouseDown(true);
  };

  const toggleDisabled = () => {
    setDisabled(!disabled);
  };

  const calendar = (
    <Calendar
      locale={cn ? zhCN : enUS}
      style={{ zIndex: 1001 }}
      dateInputPlaceholder="please input"
      format={getFormat(showTime)}
      disabledTime={showTime ? disabledTime : undefined}
      timePicker={showTime ? timePickerElement : undefined}
      defaultValue={props.defaultCalendarValue}
      showDateInput={showDateInput}
      disabledDate={disabledDate}
      focusablePanel={false}
    />
  );
  return (
    <div style={{ width: 400, margin: 20 }}>
      <div style={{ marginBottom: 10 }}>
        <label>
          <input
            type="checkbox"
            checked={showTime}
            onChange={onShowTimeChange}
          />
          showTime
        </label>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <label>
          <input
            type="checkbox"
            checked={showDateInput}
            onChange={onShowDateInputChange}
          />
          showDateInput
        </label>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <label>
          <input checked={disabled} onChange={toggleDisabled} type="checkbox" />
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
          calendar={calendar}
          value={value}
          onChange={onChange}
          onOpenChange={onOpenChange}
          open={open}
          style={{ zIndex: 1001 }}
        >
          {({ value }) => {
            return (
              <span tabIndex={0} onMouseDown={onMouseDown} onFocus={onFocus}>
                <input
                  placeholder="please select"
                  style={{ width: 250 }}
                  disabled={disabled}
                  readOnly
                  tabIndex={-1}
                  className="ant-calendar-picker-input ant-input"
                  value={(value && value.format(getFormat(showTime))) || ''}
                />
                <div ref={calendarContainerRef} />
              </span>
            );
          }}
        </DatePicker>
      </div>
    </div>
  );
}

const multiFormats = ['DD/MM/YYYY', 'DD/MM/YY', 'DDMMYY', 'D/M/YY'];

function DemoMultiFormat() {
  const [value, setValue] = useState(now);

  const onChange = (value: Moment) => {
    console.log('Calendar change: ', value && value.format(format));
    setValue(value);
  };

  return (
    <div style={{ width: 400, margin: 20 }}>
      <div style={{ marginBottom: 10 }}>
        Accepts multiple input formats
        <br />
        <small>{multiFormats.join(', ')}</small>
        <br />
      </div>
      <Calendar
        locale={cn ? zhCN : enUS}
        style={{ zIndex: 1000 }}
        dateInputPlaceholder="please input"
        format={multiFormats}
        value={value}
        onChange={onChange}
        focusablePanel={false}
      />
    </div>
  );
}

function onStandaloneSelect(value: Moment | null) {
  console.log('onStandaloneSelect');
  console.log(value && value.format(format));
}

function onStandaloneChange(value: Moment | null) {
  console.log('onStandaloneChange');
  console.log(value && value.format(format));
}

const node = document.getElementById('root');
const root = createRoot(node!);

root.render(
  <DemoWrapper>
    <div>
      <div style={{ margin: 10 }}>
        <Calendar
          showWeekNumber={false}
          locale={cn ? zhCN : enUS}
          defaultValue={now}
          disabledTime={disabledTime}
          showToday
          format={getFormat(true)}
          showOk={false}
          timePicker={timePickerElement}
          onChange={onStandaloneChange}
          disabledDate={disabledDate}
          onSelect={onStandaloneSelect}
          renderFooter={(mode) => <span>{mode} extra footer</span>}
        />
      </div>
      <div style={{ float: 'left', width: 300 }}>
        <Demo defaultValue={now} />
      </div>
      <div style={{ float: 'right', width: 300 }}>
        <Demo defaultCalendarValue={defaultCalendarValue} />
      </div>
      <div style={{ clear: 'both' }}></div>
      <div>
        <DemoMultiFormat />
      </div>
    </div>
  </DemoWrapper>,
);

// @ts-expect-error importing css
import './demo.css';
import { useState } from 'react';
import { useRef } from 'react';

function DemoWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="container">
      <div className="header">
        <h1>rc-calendar@10.0.0</h1>
        <p>React Calendar</p>
      </div>

      <div className="example">{children}</div>
    </div>
  );
}
