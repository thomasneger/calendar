import {
  forwardRef,
  useEffect,
  useState,
  type ChangeEventHandler,
  type HTMLAttributes,
  type KeyboardEventHandler,
  type ReactNode,
} from 'react';
import moment, { type Moment } from 'moment';
import { formatDate } from '../util';
import type { Locale } from '../types';

interface Props {
  prefixCls: string;
  value: Moment;
  format: string | string[];
  locale: Locale;
  disabledDate?: (date: Moment) => boolean;
  onChange: (date: Moment | null) => void;
  onClear?: () => void;
  placeholder?: string;
  onSelect: (date: Moment) => void;
  selectedValue: Moment | null | undefined;
  clearIcon: ReactNode;
  inputMode: HTMLAttributes<HTMLInputElement>['inputMode'];
  disabled?: boolean;
  showClear?: boolean;
}

const DateInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    prefixCls,
    value,
    format,
    locale,
    selectedValue,
    onClear = () => {},
    disabledDate,
    onChange,
    onSelect,
    placeholder,
    clearIcon,
    inputMode,
    disabled,
    showClear,
  } = props;

  const [str, setStr] = useState(formatDate(selectedValue, format));
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    setStr(formatDate(selectedValue, format));
    setInvalid(false);
  }, [selectedValue, format]);

  const handleClear = () => {
    setStr('');
    onClear();
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const str = event.target.value;

    // No content, legal and exit directly
    if (!str) {
      onChange(null);
      setInvalid(false);
      setStr(str);
      return;
    }

    // Exit directly if it is illegal
    const parsed = moment(str, format, true);
    if (!parsed.isValid()) {
      setInvalid(true);
      setStr(str);
      return;
    }

    const updatedValue = value.clone();
    updatedValue
      .year(parsed.year())
      .month(parsed.month())
      .date(parsed.date())
      .hour(parsed.hour())
      .minute(parsed.minute())
      .second(parsed.second());

    if (!updatedValue || (disabledDate && disabledDate(updatedValue))) {
      setInvalid(true);
      setStr(str);
      return;
    }

    if (
      selectedValue !== updatedValue ||
      (selectedValue && updatedValue && !selectedValue.isSame(updatedValue))
    ) {
      setInvalid(false);
      setStr(str);
      onChange(updatedValue);
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    const { key } = event;

    if (key === 'Enter' && onSelect) {
      const validateDate = !disabledDate || !disabledDate(value);
      if (validateDate) {
        onSelect(value.clone());
      }
      event.preventDefault();
    }
  };

  const invalidClass = invalid ? `${prefixCls}-input-invalid` : '';
  return (
    <div className={`${prefixCls}-input-wrap`}>
      <div className={`${prefixCls}-date-input-wrap`}>
        <input
          ref={ref}
          className={`${prefixCls}-input ${invalidClass}`}
          value={str}
          disabled={disabled}
          placeholder={placeholder}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          inputMode={inputMode}
        />
      </div>
      {showClear ? (
        <a role="button" title={locale.clear} onClick={handleClear}>
          {clearIcon || <span className={`${prefixCls}-clear-btn`} />}
        </a>
      ) : null}
    </div>
  );
});

export default DateInput;
