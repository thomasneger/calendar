import { useEffect, useState, type ReactNode } from 'react';
import moment, { type Moment } from 'moment';
import classNames from 'classnames';
import Combobox from './time-picker/Combobox';

interface TimePickerPanelProps {
  prefixCls?: string;
  className?: string;
  disabledHours?: () => number[];
  disabledMinutes?: (hour: number | null) => number[];
  disabledSeconds?: (hour: number | null, minute: number | null) => number[];
  hideDisabledOptions?: boolean;
  showHour?: boolean;
  showMinute?: boolean;
  showSecond?: boolean;
  format?: string;
  value?: Moment;
  defaultOpenValue?: Moment;
  clearText?: string;
  onChange?: (value: Moment) => void;
  onAmPmChange?: (ampm: string) => void;
  onEsc?: () => void;
  onCurrentSelectPanelChange?: (panel: string) => void;
  addon?: ReactNode;
  use12Hours?: boolean;
  focusOnOpen?: boolean;
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  clearIcon?: React.ReactNode;
}

export default function TimePickerPanel(props: TimePickerPanelProps) {
  const {
    prefixCls = 'rc-time-picker-panel',
    value: valueProps,
    onChange = () => {},
    disabledHours = () => [],
    disabledMinutes = () => [],
    disabledSeconds = () => [],
    defaultOpenValue = moment(),
    use12Hours = false,
    addon,
    onAmPmChange = () => {},
    onCurrentSelectPanelChange = () => {},
    className,
    hideDisabledOptions,
    showHour,
    showMinute,
    showSecond,
    format,
    onEsc = () => {},
    hourStep,
    minuteStep,
    secondStep,
  } = props;

  const [value, setValue] = useState(valueProps);

  useEffect(() => {
    setValue(valueProps);
  }, [valueProps]);

  const handleChange = (newValue: Moment) => {
    setValue(newValue);
    onChange(newValue);
  };

  const handleAmPmChange = (ampm: string) => {
    onAmPmChange(ampm);
  };

  const handleDisabledHours = () => {
    let disabledOptions = disabledHours();
    if (use12Hours && Array.isArray(disabledOptions)) {
      if (isAM()) {
        disabledOptions = disabledOptions
          .filter((h) => h < 12)
          .map((h) => (h === 0 ? 12 : h));
      } else {
        disabledOptions = disabledOptions.map((h) => (h === 12 ? 12 : h - 12));
      }
    }
    return disabledOptions;
  };

  const isAM = () => {
    const realValue = value || defaultOpenValue;
    return realValue.hour() >= 0 && realValue.hour() < 12;
  };

  const disabledHourOptions = handleDisabledHours();
  const disabledMinuteOptions = disabledMinutes(
    valueProps ? valueProps.hour() : null,
  );
  const disabledSecondOptions = disabledSeconds(
    valueProps ? valueProps.hour() : null,
    valueProps ? valueProps.minute() : null,
  );
  const hourOptions = generateOptions(
    24,
    disabledHourOptions,
    hideDisabledOptions,
    hourStep,
  );
  const minuteOptions = generateOptions(
    60,
    disabledMinuteOptions,
    hideDisabledOptions,
    minuteStep,
  );
  const secondOptions = generateOptions(
    60,
    disabledSecondOptions,
    hideDisabledOptions,
    secondStep,
  );

  const validDefaultOpenValue = toNearestValidTime(
    defaultOpenValue,
    hourOptions,
    minuteOptions,
    secondOptions,
  );

  return (
    <div className={classNames(className, `${prefixCls}-inner`)}>
      <Combobox
        prefixCls={prefixCls}
        value={valueProps}
        defaultOpenValue={validDefaultOpenValue}
        format={format}
        onChange={handleChange}
        onAmPmChange={handleAmPmChange}
        showHour={showHour}
        showMinute={showMinute}
        showSecond={showSecond}
        hourOptions={hourOptions}
        minuteOptions={minuteOptions}
        secondOptions={secondOptions}
        disabledHours={handleDisabledHours}
        disabledMinutes={disabledMinutes}
        disabledSeconds={disabledSeconds}
        onCurrentSelectPanelChange={onCurrentSelectPanelChange}
        use12Hours={use12Hours}
        onEsc={onEsc}
        isAM={isAM()}
      />
      {addon}
    </div>
  );
}

function generateOptions(
  length: number,
  disabledOptions: number[] | null,
  hideDisabledOptions: boolean | undefined,
  step = 1,
) {
  const arr = [];
  for (let value = 0; value < length; value += step) {
    if (
      !disabledOptions ||
      disabledOptions.indexOf(value) < 0 ||
      !hideDisabledOptions
    ) {
      arr.push(value);
    }
  }
  return arr;
}

function toNearestValidTime(
  time: Moment,
  hourOptions: number[],
  minuteOptions: number[],
  secondOptions: number[],
) {
  const hour = hourOptions
    .slice()
    .sort((a, b) => Math.abs(time.hour() - a) - Math.abs(time.hour() - b))[0];
  const minute = minuteOptions
    .slice()
    .sort(
      (a, b) => Math.abs(time.minute() - a) - Math.abs(time.minute() - b),
    )[0];
  const second = secondOptions
    .slice()
    .sort(
      (a, b) => Math.abs(time.second() - a) - Math.abs(time.second() - b),
    )[0];
  return moment(`${hour}:${minute}:${second}`, 'HH:mm:ss');
}
