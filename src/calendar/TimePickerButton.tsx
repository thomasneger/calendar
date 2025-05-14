import classnames from 'classnames';

type Props = {
  prefixCls: string;
  locale?: any;
  showTimePicker?: boolean;
  onOpenTimePicker?: () => void;
  onCloseTimePicker?: () => void;
  timePickerDisabled?: boolean | number;
};

export default function TimePickerButton({
  prefixCls,
  locale,
  showTimePicker,
  onOpenTimePicker,
  onCloseTimePicker,
  timePickerDisabled,
}: Props) {
  const className = classnames({
    [`${prefixCls}-time-picker-btn`]: true,
    [`${prefixCls}-time-picker-btn-disabled`]: timePickerDisabled,
  });

  const onClick = showTimePicker ? onCloseTimePicker : onOpenTimePicker;

  return (
    <a
      className={className}
      role="button"
      onClick={timePickerDisabled ? undefined : onClick}
    >
      {showTimePicker ? locale.dateSelect : locale.timeSelect}
    </a>
  );
}
