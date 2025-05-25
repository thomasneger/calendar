import type { Moment } from 'moment';
import Select from './Select';

interface ComboboxProps {
  onChange: (value: Moment) => void;
  defaultOpenValue: Moment;
  use12Hours: boolean;
  value?: Moment;
  isAM?: boolean;
  onAmPmChange: (ampm: string) => void;
  onCurrentSelectPanelChange: (range: string) => void;
  prefixCls: string;
  hourOptions: number[];
  minuteOptions: number[];
  secondOptions: number[];
  disabledHours: () => number[];
  disabledMinutes: (hour: number) => number[];
  disabledSeconds: (hour: number, minute: number) => number[];
  showHour: boolean;
  showMinute: boolean;
  showSecond: boolean;
  format: string;
  onEsc: () => void;
}

export default function Combobox(props: ComboboxProps) {
  const onItemChange = (type: string, itemValue: string) => {
    const {
      onChange,
      defaultOpenValue,
      use12Hours,
      value: propValue,
      isAM,
      onAmPmChange,
    } = props;
    const value = (propValue || defaultOpenValue).clone();

    if (type === 'hour') {
      if (use12Hours) {
        if (isAM) {
          value.hour(+itemValue % 12);
        } else {
          value.hour((+itemValue % 12) + 12);
        }
      } else {
        value.hour(+itemValue);
      }
    } else if (type === 'minute') {
      value.minute(+itemValue);
    } else if (type === 'ampm') {
      const ampm = itemValue.toUpperCase();
      if (use12Hours) {
        if (ampm === 'PM' && value.hour() < 12) {
          value.hour((value.hour() % 12) + 12);
        }

        if (ampm === 'AM') {
          if (value.hour() >= 12) {
            value.hour(value.hour() - 12);
          }
        }
      }
      onAmPmChange(ampm);
    } else {
      value.second(+itemValue);
    }
    onChange(value);
  };

  const onEnterSelectPanel = (range: string) => {
    const { onCurrentSelectPanelChange } = props;
    onCurrentSelectPanelChange(range);
  };

  const getHourSelect = (hour: number) => {
    const {
      prefixCls,
      hourOptions,
      disabledHours,
      showHour,
      use12Hours,
      onEsc,
    } = props;
    if (!showHour) {
      return null;
    }
    const disabledOptions = disabledHours();
    let hourOptionsAdj;
    let hourAdj;
    if (use12Hours) {
      hourOptionsAdj = [12].concat(hourOptions.filter((h) => h < 12 && h > 0));
      hourAdj = hour % 12 || 12;
    } else {
      hourOptionsAdj = hourOptions;
      hourAdj = hour;
    }

    return (
      <Select
        prefixCls={prefixCls}
        options={hourOptionsAdj.map((option) =>
          formatOption(option, disabledOptions),
        )}
        selectedIndex={hourOptionsAdj.indexOf(hourAdj)}
        type="hour"
        onSelect={onItemChange}
        onMouseEnter={() => onEnterSelectPanel('hour')}
        onEsc={onEsc}
      />
    );
  };

  const getMinuteSelect = (minute: number) => {
    const {
      prefixCls,
      minuteOptions,
      disabledMinutes,
      defaultOpenValue,
      showMinute,
      value: propValue,
      onEsc,
    } = props;

    if (!showMinute) {
      return null;
    }
    const value = propValue || defaultOpenValue;
    const disabledOptions = disabledMinutes(value.hour());

    return (
      <Select
        prefixCls={prefixCls}
        options={minuteOptions.map((option) =>
          formatOption(option, disabledOptions),
        )}
        selectedIndex={minuteOptions.indexOf(minute)}
        type="minute"
        onSelect={onItemChange}
        onMouseEnter={() => onEnterSelectPanel('minute')}
        onEsc={onEsc}
      />
    );
  };

  const getSecondSelect = (second: number) => {
    const {
      prefixCls,
      secondOptions,
      disabledSeconds,
      showSecond,
      defaultOpenValue,
      value: propValue,
      onEsc,
    } = props;
    if (!showSecond) {
      return null;
    }
    const value = propValue || defaultOpenValue;
    const disabledOptions = disabledSeconds(value.hour(), value.minute());

    return (
      <Select
        prefixCls={prefixCls}
        options={secondOptions.map((option) =>
          formatOption(option, disabledOptions),
        )}
        selectedIndex={secondOptions.indexOf(second)}
        type="second"
        onSelect={onItemChange}
        onMouseEnter={() => onEnterSelectPanel('second')}
        onEsc={onEsc}
      />
    );
  };

  const getAMPMSelect = () => {
    const { prefixCls, use12Hours, format, isAM, onEsc } = props;
    if (!use12Hours) {
      return null;
    }

    const AMPMOptions = ['am', 'pm'] // If format has A char, then we should uppercase AM/PM
      .map((c) => (format?.match(/\sA/) ? c.toUpperCase() : c))
      .map((c) => ({ value: c }));

    const selected = isAM ? 0 : 1;

    return (
      <Select
        prefixCls={prefixCls}
        options={AMPMOptions}
        selectedIndex={selected}
        type="ampm"
        onSelect={onItemChange}
        onMouseEnter={() => onEnterSelectPanel('ampm')}
        onEsc={onEsc}
      />
    );
  };

  const { prefixCls, defaultOpenValue, value: propValue } = props;
  const value = propValue || defaultOpenValue;

  return (
    <div className={`${prefixCls}-combobox`}>
      {getHourSelect(value.hour())}
      {getMinuteSelect(value.minute())}
      {getSecondSelect(value.second())}
      {getAMPMSelect()}
    </div>
  );
}

const formatOption = (option: number, disabledOptions: number[]) => {
  let value = `${option}`;
  if (option < 10) {
    value = `0${option}`;
  }

  let disabled = false;
  if (disabledOptions && disabledOptions.indexOf(option) >= 0) {
    disabled = true;
  }

  return {
    value,
    disabled,
  };
};
