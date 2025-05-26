import React, { useState } from 'react';
import classnames from 'classnames';
import type { Moment } from 'moment';
import type { Locale, Mode } from '../types';

const ROW = 4;
const COL = 3;

interface Props {
  locale: Locale;
  value?: Moment;
  defaultValue: Moment;
  rootPrefixCls: string;
  renderFooter?: (mode: Mode) => React.ReactNode;
  onSelect: (value: Moment) => void;
}

export default function DecadePanel(props: Props) {
  const {
    rootPrefixCls,
    value,
    defaultValue,
    renderFooter,
    onSelect = () => {},
    locale,
  } = props;

  const [state, setState] = useState(value || defaultValue);

  const goYear = (direction: number) => {
    const next = state.clone();
    next.add(direction, 'years');
    setState(next);
  };

  const chooseDecade = (year: number) => {
    const next = state.clone();
    next.year(year);
    next.month(state.month());
    setState(next);
    onSelect(next);
  };

  const prefixCls = `${rootPrefixCls}-decade-panel`;
  const nextCentury = () => goYear(100);
  const previousCentury = () => goYear(-100);

  const currentYear = state.year();
  const startYear = (currentYear / 100) * 100;
  const preYear = startYear - 10;
  const endYear = startYear + 99;
  const decades: { startDecade: number; endDecade: number }[][] = [];
  let index = 0;

  for (let rowIndex = 0; rowIndex < ROW; rowIndex++) {
    decades[rowIndex] = [];
    for (let colIndex = 0; colIndex < COL; colIndex++) {
      const startDecade = preYear + index * 10;
      const endDecade = preYear + index * 10 + 9;
      decades[rowIndex][colIndex] = {
        startDecade,
        endDecade,
      };
      index++;
    }
  }

  const footer = renderFooter && renderFooter('decade');

  const decadesEls = decades.map((row, decadeIndex) => {
    const tds = row.map((decadeData) => {
      const dStartDecade = decadeData.startDecade;
      const dEndDecade = decadeData.endDecade;
      const isLast = dStartDecade < startYear;
      const isNext = dEndDecade > endYear;
      const classNameMap = {
        [`${prefixCls}-cell`]: 1,
        [`${prefixCls}-selected-cell`]:
          dStartDecade <= currentYear && currentYear <= dEndDecade,
        [`${prefixCls}-last-century-cell`]: isLast,
        [`${prefixCls}-next-century-cell`]: isNext,
      };
      const content = `${dStartDecade}-${dEndDecade}`;
      let clickHandler;
      if (isLast) {
        clickHandler = previousCentury;
      } else if (isNext) {
        clickHandler = nextCentury;
      } else {
        clickHandler = () => chooseDecade(dStartDecade);
      }
      return (
        <td
          key={dStartDecade}
          onClick={clickHandler}
          role="gridcell"
          className={classnames(classNameMap)}
        >
          <a className={`${prefixCls}-decade`}>{content}</a>
        </td>
      );
    });
    return (
      <tr key={decadeIndex} role="row">
        {tds}
      </tr>
    );
  });

  return (
    <div className={prefixCls}>
      <div className={`${prefixCls}-header`}>
        <a
          className={`${prefixCls}-prev-century-btn`}
          role="button"
          onClick={previousCentury}
          title={locale.previousCentury}
        />

        <div className={`${prefixCls}-century`}>
          {startYear}-{endYear}
        </div>
        <a
          className={`${prefixCls}-next-century-btn`}
          role="button"
          onClick={nextCentury}
          title={locale.nextCentury}
        />
      </div>
      <div className={`${prefixCls}-body`}>
        <table className={`${prefixCls}-table`} cellSpacing="0" role="grid">
          <tbody className={`${prefixCls}-tbody`}>{decadesEls}</tbody>
        </table>
      </div>

      {footer && <div className={`${prefixCls}-footer`}>{footer}</div>}
    </div>
  );
}
