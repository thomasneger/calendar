import moment, { type Moment } from 'moment';
import classNames from 'classnames';
import {
  useRef,
  useState,
  type ChangeEventHandler,
  type KeyboardEventHandler,
} from 'react';

interface HeaderProps {
  prefixCls: string;
  value?: Moment;
  format: string;
  defaultOpenValue: Moment;
  hourOptions: number[];
  minuteOptions: number[];
  secondOptions: number[];
  disabledHours: () => number[];
  disabledMinutes: (hour: number) => number[];
  disabledSeconds: (hour: number, minute: number) => number[];
  onChange: (value: Moment | null) => void;
  onEsc: () => void;
  onKeyDown: KeyboardEventHandler;
  focusOnOpen?: boolean;
  placeholder?: string;
  inputReadOnly?: boolean;
}

export default function Header(props: HeaderProps) {
  const {
    inputReadOnly = false,
    value,
    defaultOpenValue,
    format,
    hourOptions,
    minuteOptions,
    secondOptions,
    disabledHours,
    disabledMinutes,
    disabledSeconds,
    onChange,
    onEsc,
    onKeyDown,
    prefixCls,
    placeholder,
  } = props;

  // static defaultProps = {
  //   inputReadOnly: false,
  // };

  // constructor(props) {
  //   super(props);
  //   const { value, format } = props;
  //   this.state = {
  //     str: (value && value.format(format)) || '',
  //     invalid: false,
  //   };
  // }

  const [str, setStr] = useState((value && value.format(format)) || '');
  const [invalid, setInvalid] = useState(false);

  const refInput = useRef<HTMLInputElement>(null);

  // TODO This will most likely be a useEffect
  // componentDidMount() {
  //   const { focusOnOpen } = this.props;
  //   if (focusOnOpen) {
  //     // requestAnimationFrame will cause jump on rc-trigger 3.x
  //     // https://github.com/ant-design/ant-design/pull/19698#issuecomment-552889571
  //     // use setTimeout can resolve it
  //     // 60ms is a magic timeout to avoid focusing before dropdown reposition correctly
  //     this.timeout = setTimeout(() => {
  //       this.refInput.focus();
  //       this.refInput.select();
  //     }, 60);
  //   }
  // }

  // TODO refactor with useEffect
  // componentDidUpdate(prevProps) {
  //   const { value, format } = this.props;
  //   if (value !== prevProps.value) {
  //     // eslint-disable-next-line react/no-did-update-set-state
  //     this.setState({
  //       str: (value && value.format(format)) || '',
  //       invalid: false,
  //     });
  //   }
  // }

  // componentWillUnmount() {
  //   if (this.timeout) {
  //     clearTimeout(this.timeout);
  //   }
  // }

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const str = event.target.value;
    setStr(str);

    if (str) {
      const initValue = getInitValue().clone();
      const parsed = moment(str, format, true);
      if (!parsed.isValid()) {
        setInvalid(true);
        return;
      }
      initValue
        .hour(parsed.hour())
        .minute(parsed.minute())
        .second(parsed.second());

      // if time value not allowed, response warning.
      if (
        hourOptions.indexOf(initValue.hour()) < 0 ||
        minuteOptions.indexOf(initValue.minute()) < 0 ||
        secondOptions.indexOf(initValue.second()) < 0
      ) {
        setInvalid(true);
        return;
      }

      // if time value is disabled, response warning.
      const disabledHourOptions = disabledHours();
      const disabledMinuteOptions = disabledMinutes(initValue.hour());
      const disabledSecondOptions = disabledSeconds(
        initValue.hour(),
        initValue.minute(),
      );
      if (
        (disabledHourOptions &&
          disabledHourOptions.indexOf(initValue.hour()) >= 0) ||
        (disabledMinuteOptions &&
          disabledMinuteOptions.indexOf(initValue.minute()) >= 0) ||
        (disabledSecondOptions &&
          disabledSecondOptions.indexOf(initValue.second()) >= 0)
      ) {
        setInvalid(true);
        return;
      }

      if (value) {
        if (
          value.hour() !== initValue.hour() ||
          value.minute() !== initValue.minute() ||
          value.second() !== initValue.second()
        ) {
          // keep other fields for rc-calendar
          const changedValue = value.clone();
          changedValue.hour(initValue.hour());
          changedValue.minute(initValue.minute());
          changedValue.second(initValue.second());
          onChange(changedValue);
        }
      } else if (value !== initValue) {
        onChange(initValue);
      }
    } else {
      onChange(null);
    }

    setInvalid(false);
  };

  const handleKeyDown: KeyboardEventHandler = (e) => {
    if (e.key === 'Escape') {
      onEsc();
    }

    onKeyDown(e);
  };

  const getInitValue = () => {
    return value || defaultOpenValue;
  };

  const getInput = () => {
    const invalidClass = invalid ? `${prefixCls}-input-invalid` : '';
    return (
      <input
        className={classNames(`${prefixCls}-input`, invalidClass)}
        ref={refInput}
        onKeyDown={handleKeyDown}
        value={str}
        placeholder={placeholder}
        onChange={handleInputChange}
        readOnly={!!inputReadOnly}
      />
    );
  };

  return <div className={`${prefixCls}-input-wrap`}>{getInput()}</div>;
}
