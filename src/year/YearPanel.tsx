import React, { useState } from 'react';
import classnames from 'classnames';
import type { Moment } from 'moment';
import type { Locale } from '../types';

const ROW = 4;
const COL = 3;

interface Props {
  rootPrefixCls: string;
  value?: Moment;
  defaultValue: Moment;
  renderFooter?: (mode: string) => React.ReactNode;
  onSelect: (value: Moment) => void;
  locale: Locale;
  onDecadePanelShow: () => void;
}

export default function YearPanel(props: Props) {
  const {
    rootPrefixCls,
    value,
    defaultValue,
    renderFooter,
    onSelect = () => {},
    locale,
    onDecadePanelShow,
  } = props;

  const [state, setState] = useState(value || defaultValue);

  const goYear = (direction: number) => {
    const value = state.clone();
    value.add(direction, 'year');
    setState(value);
  };

  const chooseYear = (year: number) => {
    const value = state.clone();
    value.year(year);
    value.month(state.month());

    setState(value);
    onSelect(value);
  };

  const prefixCls = `${rootPrefixCls}-year-panel`;
  const nextDecade = () => goYear(10);
  const previousDecade = () => goYear(-10);

  const years = () => {
    const value = state;
    const currentYear = value.year();
    const startYear = (currentYear / 10) * 10;
    const previousYear = startYear - 1;
    const years: { content: string; year: number; title: string }[][] = [];
    let index = 0;
    for (let rowIndex = 0; rowIndex < ROW; rowIndex++) {
      years[rowIndex] = [];
      for (let colIndex = 0; colIndex < COL; colIndex++) {
        const year = previousYear + index;
        const content = String(year);
        years[rowIndex][colIndex] = {
          content,
          year,
          title: content,
        };
        index++;
      }
    }
    return years;
  };

  const currentYear = state.year();
  const startYear = (currentYear / 10) * 10;
  const endYear = startYear + 9;

  const yeasEls = years().map((row, index) => {
    const tds = row.map((yearData) => {
      const classNameMap = {
        [`${prefixCls}-cell`]: 1,
        [`${prefixCls}-selected-cell`]: yearData.year === currentYear,
        [`${prefixCls}-last-decade-cell`]: yearData.year < startYear,
        [`${prefixCls}-next-decade-cell`]: yearData.year > endYear,
      };
      let clickHandler;
      if (yearData.year < startYear) {
        clickHandler = previousDecade;
      } else if (yearData.year > endYear) {
        clickHandler = nextDecade;
      } else {
        clickHandler = () => chooseYear(yearData.year);
      }
      return (
        <td
          role="gridcell"
          title={yearData.title}
          key={yearData.content}
          onClick={clickHandler}
          className={classnames(classNameMap)}
        >
          <a className={`${prefixCls}-year`}>{yearData.content}</a>
        </td>
      );
    });
    return (
      <tr key={index} role="row">
        {tds}
      </tr>
    );
  });

  const footer = renderFooter && renderFooter('year');

  return (
    <div className={prefixCls}>
      <div>
        <div className={`${prefixCls}-header`}>
          <a
            className={`${prefixCls}-prev-decade-btn`}
            role="button"
            onClick={previousDecade}
            title={locale.previousDecade}
          />
          <a
            className={`${prefixCls}-decade-select`}
            role="button"
            onClick={onDecadePanelShow}
            title={locale.decadeSelect}
          >
            <span className={`${prefixCls}-decade-select-content`}>
              {startYear}-{endYear}
            </span>
            <span className={`${prefixCls}-decade-select-arrow`}>x</span>
          </a>

          <a
            className={`${prefixCls}-next-decade-btn`}
            role="button"
            onClick={nextDecade}
            title={locale.nextDecade}
          />
        </div>
        <div className={`${prefixCls}-body`}>
          <table className={`${prefixCls}-table`} cellSpacing="0" role="grid">
            <tbody className={`${prefixCls}-tbody`}>{yeasEls}</tbody>
          </table>
        </div>

        {footer && <div className={`${prefixCls}-footer`}>{footer}</div>}
      </div>
    </div>
  );
}
