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

const format = 'YYYY-Wo';
const cn = location.search.indexOf('cn') !== -1;

const now = moment();
if (cn) {
  now.locale('zh-cn').utcOffset(8);
} else {
  now.locale('en-gb').utcOffset(0);
}

const style = `
.week-calendar {
  width: 386px;
}
.week-calendar .rc-calendar-tbody > tr:hover
.rc-calendar-date {
  background: #ebfaff;
}

.week-calendar .rc-calendar-tbody > tr:hover
.rc-calendar-selected-day .rc-calendar-date {
    background: #3fc7fa;
}

.week-calendar .week-calendar-sidebar {
  position:absolute;
  top:0;
  left:0;
  bottom:0;
  width:100px;
  border-right: 1px solid #ccc;
}
.week-calendar .rc-calendar-panel {
  margin-left: 100px;
}
`;

function Demo() {
  const [value, setValue] = useState<Moment>();
  const [open, setOpen] = useState(false);

  const onChange = (value: Moment) => {
    console.log('DatePicker change: ', value && value.format(format));
    setValue(value);
  };

  const onOpenChange = (open: boolean) => {
    setOpen(open);
  };

  const dateRender = (current: Moment) => {
    if (
      value &&
      current.year() === value.year() &&
      current.week() === value.week()
    ) {
      return (
        <div className="rc-calendar-selected-day">
          <div className="rc-calendar-date">{current.date()}</div>
        </div>
      );
    }
    return <div className="rc-calendar-date">{current.date()}</div>;
  };

  const lastWeek = () => {
    const updatedValue = value || now;
    updatedValue.add(-1, 'weeks');
    setValue(updatedValue);
    setOpen(false);
  };

  const renderSidebar = () => {
    return (
      <div className="week-calendar-sidebar" key="sidebar">
        <button onClick={lastWeek} style={{ margin: 20 }}>
          上一周
        </button>
      </div>
    );
  };

  const calendar = (
    <Calendar
      className="week-calendar"
      showWeekNumber
      renderSidebar={renderSidebar}
      dateRender={dateRender}
      locale={cn ? zhCN : enUS}
      format={format}
      style={{ zIndex: 1000 }}
      dateInputPlaceholder="please input"
      defaultValue={now}
      showDateInput
    />
  );
  return (
    <div style={{ width: 400, margin: 20 }}>
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
          onOpenChange={onOpenChange}
          open={open}
          animation="slide-up"
          calendar={calendar}
          value={value}
          onChange={onChange}
        >
          {({ value }) => {
            return (
              <span tabIndex={0}>
                <input
                  placeholder="please select week"
                  style={{ width: 250 }}
                  readOnly
                  tabIndex={-1}
                  className="ant-calendar-picker-input ant-input"
                  value={(value && value.format(format)) || ''}
                />
              </span>
            );
          }}
        </DatePicker>
      </div>
    </div>
  );
}

renderDemo(
  <>
    <style dangerouslySetInnerHTML={{ __html: style }} />
    <div>
      <Demo />
    </div>
  </>,
);
