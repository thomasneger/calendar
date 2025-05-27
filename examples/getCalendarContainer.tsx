import '../assets/index.less';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import Calendar from '../src/Calendar';
import DatePicker from '../src/Picker';

import zhCN from '../src/locale/zh_CN';
import enUS from '../src/locale/en_US';

import moment from 'moment';
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

function Demo() {
  const [open, setOpen] = useState(false);
  const [destroy, setDestroy] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  if (destroy) {
    return null;
  }

  return (
    <div>
      <button onClick={() => setOpen(true)}>open</button>
      &nbsp;
      <button onClick={() => setDestroy(true)}>destroy</button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <div id="d" ref={containerRef} />
        <div style={{ marginTop: 20 }}>
          <DatePicker
            getCalendarContainer={() => {
              if (containerRef.current === null) {
                throw new Error('containerRef is null');
              } else {
                return containerRef.current;
              }
            }}
            calendar={<Calendar locale={cn ? zhCN : enUS} />}
          >
            {({ value }) => {
              return (
                <span>
                  <input
                    style={{ width: 250 }}
                    readOnly
                    value={(value && value.format(format)) || ''}
                  />
                </span>
              );
            }}
          </DatePicker>
        </div>
      </Dialog>
    </div>
  );
}

function Dialog({
  open,
  children,
  onClose = () => {},
}: {
  open: boolean;
  children?: ReactNode;
  onClose?: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [open]);

  return (
    <dialog ref={ref} onClose={onClose} style={{ overflow: 'visible' }}>
      <button
        style={{ position: 'absolute', top: 10, right: 10 }}
        onClick={() => {
          ref.current?.close();
          onClose();
        }}
      >
        close
      </button>
      {children}
    </dialog>
  );
}

renderDemo(<Demo />);
