import '../assets/index.less';
import { useState } from 'react';
import FullCalendar, { type FullCalendarProps } from '../src/FullCalendar';

import zhCN from '../src/locale/zh_CN';
import enUS from '../src/locale/en_US';

import moment, { type Moment } from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';
import { renderDemo } from './demo';

const format = 'YYYY-MM-DD';
const cn = location.search.indexOf('cn') !== -1;

const now = moment();
if (cn) {
  now.locale('zh-cn').utcOffset(8);
} else {
  now.locale('en-gb').utcOffset(0);
}

const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'month');

function onSelect(value: Moment) {
  console.log('select', value.format(format));
}

function Demo() {
  const [type, setType] = useState<FullCalendarProps['type']>('month');

  return (
    <>
      <FullCalendar
        style={{ margin: 10 }}
        fullscreen={false}
        onSelect={onSelect}
        defaultValue={now}
        locale={cn ? zhCN : enUS}
      />
      <FullCalendar
        style={{ margin: 10 }}
        fullscreen
        defaultValue={now}
        onSelect={onSelect}
        type={type}
        onTypeChange={setType}
        locale={cn ? zhCN : enUS}
      />
    </>
  );
}

renderDemo(<Demo />);
