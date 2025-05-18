import type { Locale } from '../types';

interface Props {
  prefixCls: string;
  locale: Locale;
  okDisabled?: boolean | number;
  onOk?: () => void;
}

export default function OkButton({
  prefixCls,
  locale,
  okDisabled,
  onOk,
}: Props) {
  let className = `${prefixCls}-ok-btn`;
  if (okDisabled) {
    className += ` ${prefixCls}-ok-btn-disabled`;
  }
  return (
    <a
      className={className}
      role="button"
      onClick={okDisabled ? undefined : onOk}
    >
      {locale.ok}
    </a>
  );
}
