import classNames from 'classnames';
import type { ReactNode } from 'react';

interface SelectProps {
  className?: string;
  onChange?: (value: string) => void;
  children?: ReactNode;
  value?: string | number;
}

export default function Select(props: SelectProps) {
  const { className, onChange = () => {}, children, value } = props;

  return (
    <select
      className={classNames(className, 'rc-select')}
      defaultValue={value}
      onChange={(e) => {
        onChange(e.target.value);
      }}
    >
      {children}
    </select>
  );
}

interface OptionProps {
  children?: ReactNode;
  value?: string | number;
}

export function Option(props: OptionProps) {
  const { children, value } = props;

  return <option value={value}>{children}</option>;
}
