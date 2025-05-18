import type { ReactElement } from 'react';
import type { Locale } from '../types';

type Props = {
  locale: Locale;
  timePicker?: ReactElement | null;
  format?: string | string[];
};

export function useGetFormat(props: Props) {
  const { locale, timePicker } = props;
  let { format } = props;

  if (!format) {
    if (timePicker) {
      format = locale.dateTimeFormat;
    } else {
      format = locale.dateFormat;
    }
  }
  return format;
}
