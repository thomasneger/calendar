import React, {
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import MonthTable from './MonthTable';
import type { Moment } from 'moment';
import type { Locale, Mode } from '../types';

interface Props {
  disabledDate?: (date: Moment) => boolean;
  onSelect: (date: Moment) => void;
  renderFooter?: (mode: Mode) => ReactNode;
  rootPrefixCls: string;
  value: Moment;
  defaultValue?: Moment;
  changeYear: (direction: number) => void;
  locale: Locale;
  style?: CSSProperties;
  onYearPanelShow: () => void;
  cellRender?: (date: Moment) => React.ReactNode;
  contentRender?: (date: Moment) => React.ReactNode;
}

export default function MonthPanel(props: Props) {
  const {
    disabledDate,
    onSelect = () => {},
    rootPrefixCls,
    value,
    defaultValue,
    changeYear,
    renderFooter,
    locale,
    style,
    onYearPanelShow,
    cellRender,
    contentRender,
  } = props;

  const goYear = (direction: number) => {
    changeYear(direction);
  };
  const nextYear = () => goYear(1);
  const previousYear = () => goYear(-1);
  const prefixCls = `${rootPrefixCls}-month-panel`;

  const [state, setState] = useState(value || defaultValue);

  // Handle controlled component updates
  useEffect(() => {
    if ('value' in props && value !== state) {
      setState(value);
    }
  }, [value, state, props]);

  const setAndSelectValue = (newValue: Moment) => {
    setValue(newValue);
    onSelect(newValue);
  };

  const setValue = (value: Moment) => {
    if ('value' in props) {
      setState(value);
    }
  };

  const year = state.year();

  const footer = renderFooter && renderFooter('month');

  return (
    <div className={prefixCls} style={style}>
      <div>
        <div className={`${prefixCls}-header`}>
          <a
            className={`${prefixCls}-prev-year-btn`}
            role="button"
            onClick={previousYear}
            title={locale.previousYear}
          />

          <a
            className={`${prefixCls}-year-select`}
            role="button"
            onClick={onYearPanelShow}
            title={locale.yearSelect}
          >
            <span className={`${prefixCls}-year-select-content`}>{year}</span>
            <span className={`${prefixCls}-year-select-arrow`}>x</span>
          </a>

          <a
            className={`${prefixCls}-next-year-btn`}
            role="button"
            onClick={nextYear}
            title={locale.nextYear}
          />
        </div>
        <div className={`${prefixCls}-body`}>
          <MonthTable
            disabledDate={disabledDate}
            onSelect={setAndSelectValue}
            locale={locale}
            value={state}
            cellRender={cellRender}
            contentRender={contentRender}
            prefixCls={prefixCls}
          />
        </div>
        {footer && <div className={`${prefixCls}-footer`}>{footer}</div>}
      </div>
    </div>
  );
}
