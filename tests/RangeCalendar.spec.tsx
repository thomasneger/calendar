import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import React, { useState } from 'react';
import moment, { Moment } from 'moment';
import { render } from '@testing-library/react';
import TimePickerPanel from '../src/TimePickerPanel';
import RangeCalendar from '../src/RangeCalendar';
import { fireEvent } from '@testing-library/react';
import { Mode } from '../src/types';

const format = 'YYYY-MM-DD';

describe('RangeCalendar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 4, 29));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it.only('render works', () => {
    const { container } = render(<RangeCalendar />);

    expect(
      container.querySelectorAll('.rc-calendar-cell').length,
    ).toBeGreaterThan(0);
  });

  it.only('default sperator', () => {
    const { container } = render(<RangeCalendar />);
    expect(
      container.querySelector('.rc-calendar-range-middle')?.textContent,
    ).toBe('~');
  });

  it.only('custom sperator', () => {
    const { container } = render(<RangeCalendar seperator="至" />);
    expect(
      container.querySelector('.rc-calendar-range-middle')?.textContent,
    ).toBe('至');
  });

  it.only('render hoverValue correctly', () => {
    const { container } = render(
      <RangeCalendar hoverValue={[moment(), moment().add(1, 'months')]} />,
    );
    expect(container).toMatchSnapshot();
  });

  it.only('next month works', async () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <RangeCalendar onValueChange={onValueChange} />,
    );

    const rightNextButton = container.querySelector(
      '.rc-calendar-range-right .rc-calendar-next-month-btn',
    );

    fireEvent.click(rightNextButton!);

    expect(onValueChange).toHaveBeenCalled();
    const [start1, end1] = onValueChange.mock.calls[0][0];

    expect(start1.format('YYYY-MM-DD')).toBe('2025-05-29');
    expect(end1.format('YYYY-MM-DD')).toBe('2025-07-29');

    expect(
      container.querySelectorAll(
        '.rc-calendar-range-right .rc-calendar-prev-month-btn',
      ).length,
    ).toBe(1);

    const leftNextButton = container.querySelector(
      '.rc-calendar-range-left .rc-calendar-next-month-btn',
    );

    fireEvent.click(leftNextButton!);

    expect(onValueChange).toHaveBeenCalled();
    const [start2, end2] = onValueChange.mock.calls[1][0];
    expect(start2.format('YYYY-MM-DD')).toBe('2025-06-29');
    expect(end2.format('YYYY-MM-DD')).toBe('2025-07-29');

    expect(
      container.querySelectorAll(
        '.rc-calendar-range-left .rc-calendar-next-month-btn',
      ).length,
    ).toBe(0);
  });

  it.only('previous month works', async () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <RangeCalendar onValueChange={onValueChange} />,
    );

    const leftPrevButton = container.querySelector(
      '.rc-calendar-range-left .rc-calendar-prev-month-btn',
    );
    fireEvent.click(leftPrevButton!);

    expect(onValueChange).toHaveBeenCalled();
    const [start1, end1] = onValueChange.mock.calls[0][0];

    expect(start1.format('YYYY-MM-DD')).toBe('2025-04-29');
    expect(end1.format('YYYY-MM-DD')).toBe('2025-06-29');

    expect(
      container.querySelectorAll(
        '.rc-calendar-range-left .rc-calendar-next-month-btn',
      ).length,
    ).toBe(1);

    const rightPrevButton = container.querySelector(
      '.rc-calendar-range-right .rc-calendar-prev-month-btn',
    );
    fireEvent.click(rightPrevButton!);

    expect(onValueChange).toHaveBeenCalled();
    const [start2, end2] = onValueChange.mock.calls[1][0];
    expect(start2.format('YYYY-MM-DD')).toBe('2025-04-29');
    expect(end2.format('YYYY-MM-DD')).toBe('2025-05-29');

    expect(
      container.querySelectorAll(
        '.rc-calendar-range-right .rc-calendar-prev-month-btn',
      ).length,
    ).toBe(0);
  });

  it.only('next year works', async () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <RangeCalendar onValueChange={onValueChange} />,
    );

    const rightNextYearButton = container.querySelector(
      '.rc-calendar-range-right .rc-calendar-next-year-btn',
    );
    fireEvent.click(rightNextYearButton!);

    expect(onValueChange).toHaveBeenCalled();
    const [start1, end1] = onValueChange.mock.calls[0][0];

    expect(start1.format('YYYY-MM-DD')).toBe('2025-05-29');
    expect(end1.format('YYYY-MM-DD')).toBe('2026-06-29');

    expect(
      container.querySelectorAll(
        '.rc-calendar-range-right .rc-calendar-prev-year-btn',
      ).length,
    ).toBe(1);

    const leftNextYearButton = container.querySelector(
      '.rc-calendar-range-left .rc-calendar-next-year-btn',
    );
    fireEvent.click(leftNextYearButton!);

    expect(onValueChange).toHaveBeenCalled();
    const [start2, end2] = onValueChange.mock.calls[1][0];

    expect(start2.format('YYYY-MM-DD')).toBe('2026-05-29');
    expect(end2.format('YYYY-MM-DD')).toBe('2026-06-29');

    expect(
      container.querySelectorAll(
        '.rc-calendar-range-left .rc-calendar-next-year-btn',
      ).length,
    ).toBe(0);
  });

  it.only('previous year works', async () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <RangeCalendar onValueChange={onValueChange} />,
    );

    const leftPrevYearButton = container.querySelector(
      '.rc-calendar-range-left .rc-calendar-prev-year-btn',
    );
    fireEvent.click(leftPrevYearButton!);

    expect(onValueChange).toHaveBeenCalled();
    const [start1, end1] = onValueChange.mock.calls[0][0];

    expect(start1.format('YYYY-MM-DD')).toBe('2024-05-29');
    expect(end1.format('YYYY-MM-DD')).toBe('2025-06-29');

    expect(
      container.querySelectorAll(
        '.rc-calendar-range-left .rc-calendar-next-year-btn',
      ).length,
    ).toBe(1);

    const rightPrevYearButton = container.querySelector(
      '.rc-calendar-range-right .rc-calendar-prev-year-btn',
    );
    fireEvent.click(rightPrevYearButton!);

    expect(onValueChange).toHaveBeenCalled();
    const [start2, end2] = onValueChange.mock.calls[1][0];
    expect(start2.format('YYYY-MM-DD')).toBe('2024-05-29');
    expect(end2.format('YYYY-MM-DD')).toBe('2024-06-29');

    expect(
      container.querySelectorAll(
        '.rc-calendar-range-right .rc-calendar-prev-year-btn',
      ).length,
    ).toBe(0);
  });

  it.only('left panel shows next buttons when right panel shows month panel', () => {
    const { container } = render(<RangeCalendar />);
    const rightMonthButton = container.querySelector(
      '.rc-calendar-range-right .rc-calendar-month-select',
    );
    fireEvent.click(rightMonthButton!);

    expect(
      container.querySelectorAll(
        '.rc-calendar-range-left .rc-calendar-next-year-btn',
      ).length,
    ).toBe(1);
    expect(
      container.querySelectorAll(
        '.rc-calendar-range-left .rc-calendar-next-month-btn',
      ).length,
    ).toBe(1);
  });

  it.only('left panel shows next buttons when right panel shows year panel', () => {
    const { container } = render(<RangeCalendar />);

    const rightYearButton = container.querySelector(
      '.rc-calendar-range-right .rc-calendar-year-select',
    );
    fireEvent.click(rightYearButton!);

    expect(
      container.querySelectorAll(
        '.rc-calendar-range-left .rc-calendar-next-year-btn',
      ).length,
    ).toBe(1);
    expect(
      container.querySelectorAll(
        '.rc-calendar-range-left .rc-calendar-next-month-btn',
      ).length,
    ).toBe(1);
  });

  it.only('right panel shows prev buttons when left panel shows month panel', () => {
    const { container } = render(<RangeCalendar />);
    const leftMonthButton = container.querySelector(
      '.rc-calendar-range-left .rc-calendar-month-select',
    );
    fireEvent.click(leftMonthButton!);

    expect(
      container.querySelectorAll(
        '.rc-calendar-range-right .rc-calendar-next-year-btn',
      ).length,
    ).toBe(1);
    expect(
      container.querySelectorAll(
        '.rc-calendar-range-right .rc-calendar-next-month-btn',
      ).length,
    ).toBe(1);
  });

  it.only('right panel show prev buttons when left panel show year panel', () => {
    const { container } = render(<RangeCalendar />);

    const leftYearButton = container.querySelector(
      '.rc-calendar-range-left .rc-calendar-year-select',
    );

    fireEvent.click(leftYearButton!);

    expect(
      container.querySelectorAll(
        '.rc-calendar-range-right .rc-calendar-next-year-btn',
      ).length,
    ).toBe(1);
    expect(
      container.querySelectorAll(
        '.rc-calendar-range-right .rc-calendar-next-month-btn',
      ).length,
    ).toBe(1);
  });

  it.only('left panel cannot select month after right panel', () => {
    const { container } = render(<RangeCalendar />);

    const leftMonthButton = container.querySelector(
      '.rc-calendar-range-left .rc-calendar-month-select',
    );

    fireEvent.click(leftMonthButton!);

    const monthCells = container.querySelectorAll(
      '.rc-calendar-range-left .rc-calendar-month-panel-cell',
    );

    const rightPanelMonth = 5; // June

    // Check that the next month (June) is enabled
    expect(monthCells[rightPanelMonth].className).toMatch(
      'rc-calendar-month-panel-cell',
    );

    // Check that the month after that (July) is disabled
    expect(monthCells[rightPanelMonth + 1].className).toMatch(
      'rc-calendar-month-panel-cell-disabled',
    );
  });

  it.only('right panel cannot select month before left panel', () => {
    const { container } = render(<RangeCalendar />);

    const rightMonthButton = container.querySelector(
      '.rc-calendar-range-right .rc-calendar-month-select',
    );

    fireEvent.click(rightMonthButton!);

    const monthCells = container.querySelectorAll(
      '.rc-calendar-range-right .rc-calendar-month-panel-cell',
    );

    const leftPanelMonth = 4; // May
    expect(monthCells[leftPanelMonth].className).toMatch(
      'rc-calendar-month-panel-cell rc-calendar-month-panel-current-cell',
    );
    expect(monthCells[leftPanelMonth - 1].className).toMatch(
      'rc-calendar-month-panel-cell-disabled',
    );
  });

  it.only('onSelect works', () => {
    function onSelect(d) {
      expect(d[0].format(format)).toBe('2015-09-04');
      expect(d[1].format(format)).toBe('2015-10-02');
    }

    const now = moment([2015, 8, 29]);

    const { container } = render(
      <RangeCalendar
        format={format}
        onSelect={onSelect}
        defaultValue={[now, now.clone().add(1, 'months')]}
        showWeekNumber
      />,
    );

    const leftDate = container.querySelectorAll(
      '.rc-calendar-range-left .rc-calendar-date',
    )[5];

    fireEvent.click(leftDate);

    const inputs = container.querySelectorAll('.rc-calendar-input');
    const leftInput = inputs[0] as HTMLInputElement;

    expect(leftInput.value).toBe('2015-09-04');

    const rightDate = container.querySelectorAll(
      '.rc-calendar-range-right .rc-calendar-date',
    )[5];

    fireEvent.click(rightDate);

    const rightInput = inputs[1] as HTMLInputElement;
    expect(rightInput.value).toBe('2015-10-02');
  });

  it.only('onSelect works reversely', () => {
    function onSelect(d) {
      expect(d[0].format(format)).toBe('2015-09-04');
      expect(d[1].format(format)).toBe('2015-09-14');
    }

    const now = moment([2015, 8, 29]);

    const { container } = render(
      <RangeCalendar
        format={format}
        onSelect={onSelect}
        defaultValue={[now, now.clone().add(1, 'months')]}
        showWeekNumber
      />,
    );

    const leftDate15 = container.querySelectorAll(
      '.rc-calendar-range-left .rc-calendar-date',
    )[15];

    fireEvent.click(leftDate15); // 9.14

    const inputs = container.querySelectorAll('.rc-calendar-input');
    const leftInput = inputs[0] as HTMLInputElement;
    const rightInput = inputs[1] as HTMLInputElement;

    expect(leftInput.value).toBe('2015-09-14');

    const lefDate5 = container.querySelectorAll(
      '.rc-calendar-range-left .rc-calendar-date',
    )[5];

    fireEvent.click(lefDate5); // 9.4

    expect(leftInput.value).toBe('2015-09-04');
    expect(rightInput.value).toBe('2015-09-14');
  });

  it.only('onHoverChange works', () => {
    const onHoverChange = vi.fn();
    const { container } = render(
      <RangeCalendar onHoverChange={onHoverChange} />,
    );

    const cells = container.querySelectorAll(
      '.rc-calendar-range-left .rc-calendar-cell',
    );

    fireEvent.click(cells[10]);
    expect(onHoverChange).toHaveBeenCalledTimes(1);

    fireEvent.mouseEnter(cells[20]);
    expect(onHoverChange).toHaveBeenCalledTimes(2);

    // Get the arguments of the second call
    const hoverValue = onHoverChange.mock.calls[1][0];

    expect(hoverValue[0].format(format)).toBe('2025-05-07');
    expect(hoverValue[1].format(format)).toBe('2025-05-17');
  });

  describe('timePicker', () => {
    it.only('defaultOpenValue should follow RangeCalendar[selectedValue|defaultSelectedValue] when it is set', () => {
      const timePicker = (
        <TimePickerPanel
          defaultValue={[
            moment('00:00:00', 'HH:mm:ss'),
            moment('23:59:59', 'HH:mm:ss'),
          ]}
        />
      );
      const { container } = render(
        <RangeCalendar
          timePicker={timePicker}
          defaultSelectedValue={[
            moment('01:01:01', 'HH:mm:ss'),
            moment('01:01:01', 'HH:mm:ss'),
          ]}
        />,
      );
      const timePickerButton = container.querySelector(
        '.rc-calendar-time-picker-btn',
      );

      fireEvent.click(timePickerButton!);

      const selectedValues = container.querySelectorAll(
        '.rc-time-picker-panel-select-option-selected',
      );
      for (let i = 0; i < selectedValues.length; i += 1) {
        expect(selectedValues[i].innerHTML).toBe('01');
      }
    });

    it.only('selected start and end date can be same', () => {
      const timePicker = (
        <TimePickerPanel
          defaultValue={[
            moment('00:00:00', 'HH:mm:ss'),
            moment('23:59:59', 'HH:mm:ss'),
          ]}
        />
      );
      const { container } = render(
        <RangeCalendar
          selectedValue={[
            moment('2000-09-03', format),
            moment('2000-09-03', format),
          ]}
          timePicker={timePicker}
        />,
      );

      const timePickerButton = container.querySelector(
        '.rc-calendar-time-picker-btn',
      );
      fireEvent.click(timePickerButton!);

      expect(
        container.querySelectorAll('.rc-calendar-year-select')[0].innerHTML,
      ).toBe('2000');
      expect(
        container.querySelectorAll('.rc-calendar-month-select')[0].innerHTML,
      ).toBe('Sep');
      expect(
        container.querySelectorAll('.rc-calendar-day-select')[0].innerHTML,
      ).toBe('3');
      expect(
        container.querySelectorAll('.rc-calendar-year-select')[1].innerHTML,
      ).toBe('2000');
      expect(
        container.querySelectorAll('.rc-calendar-month-select')[1].innerHTML,
      ).toBe('Sep');
      expect(
        container.querySelectorAll('.rc-calendar-day-select')[1].innerHTML,
      ).toBe('3');
    });

    it.only("use timePicker's time", () => {
      const timePicker = (
        <TimePickerPanel
          defaultValue={[
            moment('00:00:00', 'HH:mm:ss'),
            moment('23:59:59', 'HH:mm:ss'),
          ]}
        />
      );
      const { container } = render(<RangeCalendar timePicker={timePicker} />);

      const todayButton = container.querySelectorAll('.rc-calendar-today')[0];

      fireEvent.click(todayButton!);
      fireEvent.click(todayButton!);

      const inputs = container.querySelectorAll('.rc-calendar-input');
      const startInput = inputs[0] as HTMLInputElement;
      const endInput = inputs[1] as HTMLInputElement;

      // use timePicker's defaultValue if users haven't select a time
      expect(startInput.value).toBe('5/29/2025 00:00:00');
      expect(endInput.value).toBe('5/29/2025 23:59:59');

      const timePickerButton = container.querySelector(
        '.rc-calendar-time-picker-btn',
      );

      fireEvent.click(timePickerButton!);

      // update time to timePicker's time
      const leftButton = container
        .querySelectorAll(
          '.rc-calendar-range-left .rc-time-picker-panel-select ul',
        )[0]
        .querySelectorAll('li')[6];

      fireEvent.click(leftButton);

      expect(startInput.value).toBe('5/29/2025 06:00:00');

      const rightButton = container
        .querySelectorAll(
          '.rc-calendar-range-right .rc-time-picker-panel-select ul',
        )[0]
        .querySelectorAll('li')[6];

      fireEvent.click(rightButton);

      expect(endInput.value).toBe('5/29/2025 06:59:59');

      const cell10 = container.querySelectorAll(
        '.rc-calendar-range-left .rc-calendar-cell',
      )[10];

      fireEvent.click(cell10);

      expect(startInput.value).toBe('5/7/2025 06:00:00');

      const cell20 = container.querySelectorAll(
        '.rc-calendar-range-left .rc-calendar-cell',
      )[20];

      fireEvent.click(cell20);

      expect(endInput.value).toBe('5/17/2025 06:59:59');
    });

    it.only('should combine disabledTime', () => {
      function newArray(start: number, end: number) {
        const result: number[] = [];
        for (let i = start; i < end; i++) {
          result.push(i);
        }
        return result;
      }
      function disabledTime(_time, type: string) {
        if (type === 'start') {
          return {
            disabledHours() {
              const hours = newArray(0, 60);
              hours.splice(20, 4);
              return hours;
            },
            disabledMinutes(h) {
              if (h === 20) {
                return newArray(0, 31);
              } else if (h === 23) {
                return newArray(30, 60);
              }
              return [];
            },
            disabledSeconds() {
              return [55, 56];
            },
          };
        }
        return {
          disabledHours() {
            const hours = newArray(0, 60);
            hours.splice(2, 6);
            return hours;
          },
          disabledMinutes(h: number) {
            if (h === 20) {
              return newArray(0, 31);
            } else if (h === 23) {
              return newArray(30, 60);
            }
            return [];
          },
          disabledSeconds() {
            return [55, 56];
          },
        };
      }
      const timePicker = (
        <TimePickerPanel
          defaultValue={[
            moment('00:00:00', 'HH:mm:ss'),
            moment('23:59:59', 'HH:mm:ss'),
          ]}
        />
      );
      const { container } = render(
        <RangeCalendar timePicker={timePicker} disabledTime={disabledTime} />,
      );

      const todayButton = container.querySelectorAll('.rc-calendar-today')[0];

      fireEvent.click(todayButton!);
      fireEvent.click(todayButton!);
      fireEvent.click(todayButton!);
      fireEvent.click(todayButton!);

      const inputStart = container.querySelectorAll(
        '.rc-calendar-input',
      )[0] as HTMLInputElement;

      const inputEnd = container.querySelectorAll(
        '.rc-calendar-input',
      )[1] as HTMLInputElement;

      // use timePicker's defaultValue if users haven't selected a time
      expect(inputStart.value).toBe('5/29/2025 00:00:00');
      expect(inputEnd.value).toBe('5/29/2025 23:59:59');

      const timePickerButton = container.querySelector(
        '.rc-calendar-time-picker-btn',
      );
      fireEvent.click(timePickerButton!);

      // update time to timePicker's time
      const li23 = container
        .querySelectorAll(
          '.rc-calendar-range-left .rc-time-picker-panel-select ul',
        )[0]
        .querySelectorAll('li')[23];

      fireEvent.click(li23);

      expect(inputStart.value).toBe('5/29/2025 23:00:00');
      const li25Left = container
        .querySelectorAll(
          '.rc-calendar-range-left .rc-time-picker-panel-select ul',
        )[1]
        .querySelectorAll('li')[25];

      fireEvent.click(li25Left);

      expect(inputStart.value).toBe('5/29/2025 23:25:00');
      const li3 = container
        .querySelectorAll(
          '.rc-calendar-range-left .rc-time-picker-panel-select ul',
        )[2]
        .querySelectorAll('li')[3];

      fireEvent.click(li3);

      expect(inputStart.value).toBe('5/29/2025 23:25:03');

      const li25Right = container
        .querySelectorAll(
          '.rc-calendar-range-right .rc-time-picker-panel-select ul',
        )[1]
        .querySelectorAll('li')[25];

      fireEvent.click(li25Right);
      expect(inputEnd.value).toBe('5/29/2025 23:25:59');

      const disabledTimeElements = container
        .querySelectorAll(
          '.rc-calendar-range-right .rc-time-picker-panel-select ul',
        )[2]
        .querySelectorAll('.rc-time-picker-panel-select-option-disabled');

      const disabledTimeValus = Array.from(disabledTimeElements).map(
        (item) => item.innerHTML,
      );
      expect(disabledTimeValus).toEqual(['00', '01', '02', '55', '56']);
    });

    it.only('works fine when select reversely', () => {
      // see: https://github.com/ant-design/ant-design/issues/6440
      const timePicker = (
        <TimePickerPanel
          defaultValue={[
            moment('00:00:00', 'HH:mm:ss'),
            moment('23:59:59', 'HH:mm:ss'),
          ]}
        />
      );
      const { container } = render(<RangeCalendar timePicker={timePicker} />);

      const cell20 = container.querySelectorAll('.rc-calendar-cell')[20];
      const cell10 = container.querySelectorAll('.rc-calendar-cell')[10];

      fireEvent.click(cell20);
      fireEvent.click(cell10);

      // It can only be re-produced at second time.
      fireEvent.click(cell20);
      fireEvent.click(cell10);

      const inputStart = container.querySelectorAll(
        '.rc-calendar-input',
      )[0] as HTMLInputElement;
      const inputEnd = container.querySelectorAll(
        '.rc-calendar-input',
      )[1] as HTMLInputElement;

      expect(inputStart.value).toBe('5/7/2025 00:00:00');
      expect(inputEnd.value).toBe('5/17/2025 23:59:59');
    });

    it.only('disabledTime when same day and different hour or different minute', () => {
      // see: https://github.com/ant-design/ant-design/issues/8915
      function newArray(start: number, end: number) {
        const result: number[] = [];
        for (let i = start; i < end; i++) {
          result.push(i);
        }
        return result;
      }
      function disabledTime(_time, type: string) {
        if (type === 'start') {
          return {
            disabledHours() {
              return [];
            },
            disabledMinutes() {
              return newArray(30, 60);
            },
            disabledSeconds() {
              return [55, 56];
            },
          };
        }
        return {
          disabledHours() {
            return [];
          },
          disabledMinutes() {
            return newArray(30, 60);
          },
          disabledSeconds() {
            return [55, 56];
          },
        };
      }
      const timePicker = (
        <TimePickerPanel
          defaultValue={[
            moment('00:00:00', 'HH:mm:ss'),
            moment('23:59:59', 'HH:mm:ss'),
          ]}
        />
      );
      const { container } = render(
        <RangeCalendar timePicker={timePicker} disabledTime={disabledTime} />,
      );
      // update same day
      fireEvent.click(container.querySelectorAll('.rc-calendar-today')[0]);
      fireEvent.click(container.querySelectorAll('.rc-calendar-today')[0]);

      const inputStart = container.querySelectorAll(
        '.rc-calendar-input',
      )[0] as HTMLInputElement;
      const inputEnd = container.querySelectorAll(
        '.rc-calendar-input',
      )[1] as HTMLInputElement;

      expect(inputStart.value).toBe('5/29/2025 00:00:00');
      expect(inputEnd.value).toBe('5/29/2025 23:59:59');

      const timePickerButton = container.querySelector(
        '.rc-calendar-time-picker-btn',
      );
      fireEvent.click(timePickerButton!);

      // update same hour
      const leftLi11 = container
        .querySelectorAll(
          '.rc-calendar-range-left .rc-time-picker-panel-select ul',
        )[0]
        .querySelectorAll('li')[11];

      fireEvent.click(leftLi11);
      const leftLi1_4 = container
        .querySelectorAll(
          '.rc-calendar-range-left .rc-time-picker-panel-select ul',
        )[1]
        .querySelectorAll('li')[4];

      fireEvent.click(leftLi1_4);

      const leftLi2_4 = container
        .querySelectorAll(
          '.rc-calendar-range-left .rc-time-picker-panel-select ul',
        )[2]
        .querySelectorAll('li')[4];

      fireEvent.click(leftLi2_4);

      const startInput = container.querySelectorAll(
        '.rc-calendar-input',
      )[0] as HTMLInputElement;

      expect(startInput.value).toBe('5/29/2025 11:04:04');

      const rightLi0_11 = container
        .querySelectorAll(
          '.rc-calendar-range-right .rc-time-picker-panel-select ul',
        )[0]
        .querySelectorAll('li')[11];

      fireEvent.click(rightLi0_11);

      const rightLi1_4 = container
        .querySelectorAll(
          '.rc-calendar-range-right .rc-time-picker-panel-select ul',
        )[1]
        .querySelectorAll('li')[4];

      fireEvent.click(rightLi1_4);

      const rightLi2_5 = container
        .querySelectorAll(
          '.rc-calendar-range-right .rc-time-picker-panel-select ul',
        )[2]
        .querySelectorAll('li')[5];
      fireEvent.click(rightLi2_5);

      const endInput = container.querySelectorAll(
        '.rc-calendar-input',
      )[1] as HTMLInputElement;

      expect(endInput.value).toBe('5/29/2025 11:04:05');

      // disabled early seconds
      const rightLi2_2 = container
        .querySelectorAll(
          '.rc-calendar-range-right .rc-time-picker-panel-select ul',
        )[2]
        .querySelectorAll('li')[2];

      fireEvent.click(rightLi2_2);

      expect(endInput.value).toBe('5/29/2025 11:04:05');

      // disabledSeconds
      const rightLi2_55 = container
        .querySelectorAll(
          '.rc-calendar-range-right .rc-time-picker-panel-select ul',
        )[2]
        .querySelectorAll('li')[55];

      fireEvent.click(rightLi2_55);

      expect(endInput.value).toBe('5/29/2025 11:04:05');

      // disabled early minutes
      const rightLi1_1 = container
        .querySelectorAll(
          '.rc-calendar-range-right .rc-time-picker-panel-select ul',
        )[1]
        .querySelectorAll('li')[1];

      fireEvent.click(rightLi1_1);

      expect(endInput.value).toBe('5/29/2025 11:04:05');

      // disabledMinutes
      const rightLi1_35 = container
        .querySelectorAll(
          '.rc-calendar-range-right .rc-time-picker-panel-select ul',
        )[1]
        .querySelectorAll('li')[35];

      fireEvent.click(rightLi1_35);

      expect(endInput.value).toBe('5/29/2025 11:04:05');

      // different minutes for disabledSeconds
      const leftLi1_3 = container
        .querySelectorAll(
          '.rc-calendar-range-left .rc-time-picker-panel-select ul',
        )[1]
        .querySelectorAll('li')[3];

      fireEvent.click(leftLi1_3);
      fireEvent.click(rightLi2_55);

      expect(endInput.value).toBe('5/29/2025 11:04:05');

      // different hour for disabledMinutes
      const leftLi0_10 = container
        .querySelectorAll(
          '.rc-calendar-range-left .rc-time-picker-panel-select ul',
        )[0]
        .querySelectorAll('li')[10];

      fireEvent.click(leftLi0_10);
      fireEvent.click(rightLi1_35);

      expect(endInput.value).toBe('5/29/2025 11:04:05');
    });
  });

  describe('controlled panels', () => {
    it.only('render controlled panels correctly', () => {
      const { container: containerMonth } = render(
        <RangeCalendar mode={['month', 'month']} />,
      );

      expect(containerMonth).toMatchSnapshot();

      const [monthYearSelectStart, monthYearSelectEnd] =
        containerMonth.querySelectorAll('.rc-calendar-month-panel-year-select');

      fireEvent.click(monthYearSelectStart);
      fireEvent.click(monthYearSelectEnd);

      expect(
        containerMonth.querySelectorAll('.rc-calendar-year-panel').length,
      ).toBe(0);
      expect(
        containerMonth.querySelectorAll('.rc-calendar-month-panel').length,
      ).toBe(2);

      const { container: containerYear } = render(
        <RangeCalendar mode={['year', 'year']} />,
      );
      expect(containerYear).toMatchSnapshot();

      const [yearPanelDecadeSelectStart, yearPanelDecadeSelectEnd] =
        containerYear.querySelectorAll('.rc-calendar-year-panel-decade-select');

      fireEvent.click(yearPanelDecadeSelectStart);
      fireEvent.click(yearPanelDecadeSelectEnd);

      expect(
        containerYear.querySelectorAll('.rc-calendar-decade-panel').length,
      ).toBe(0);
      expect(
        containerYear.querySelectorAll('.rc-calendar-year-panel').length,
      ).toBe(2);

      const { container: containerTime } = render(
        <RangeCalendar mode={['time', 'time']} />,
      );
      expect(
        containerTime.querySelectorAll('.rc-calendar-time-picker').length,
      ).toBe(2);
    });

    it.only('should work when start time is null in defaultValue', () => {
      const { container: containerNull } = render(
        <RangeCalendar defaultValue={[null, moment().endOf('month')]} />,
      );
      const rightMonthSelect = containerNull.querySelectorAll(
        '.rc-calendar-range-right .rc-calendar-month-select',
      );

      fireEvent.click(rightMonthSelect[0]);

      expect(
        containerNull.querySelectorAll(
          '.rc-calendar-range-left .rc-calendar-next-year-btn',
        ).length,
      ).toBe(1);
      expect(
        containerNull.querySelectorAll(
          '.rc-calendar-range-left .rc-calendar-next-month-btn',
        ).length,
      ).toBe(1);

      const { container } = render(<RangeCalendar />);
      const rightYearSelect = container.querySelector(
        '.rc-calendar-range-right .rc-calendar-year-select',
      );

      fireEvent.click(rightYearSelect!);

      expect(
        container.querySelectorAll(
          '.rc-calendar-range-left .rc-calendar-next-year-btn',
        ).length,
      ).toBe(1);

      expect(
        container.querySelectorAll(
          '.rc-calendar-range-left .rc-calendar-next-month-btn',
        ).length,
      ).toBe(1);
    });

    it.only('should work when end time is null in defaultValue', () => {
      const { container: containerNull } = render(
        <RangeCalendar defaultValue={[moment().startOf('month'), null]} />,
      );
      const rightMonthSelect = containerNull.querySelector(
        '.rc-calendar-range-right .rc-calendar-month-select',
      );

      fireEvent.click(rightMonthSelect!);

      expect(
        containerNull.querySelectorAll(
          '.rc-calendar-range-left .rc-calendar-next-year-btn',
        ).length,
      ).toBe(1);
      expect(
        containerNull.querySelectorAll(
          '.rc-calendar-range-left .rc-calendar-next-month-btn',
        ).length,
      ).toBe(1);

      const { container } = render(<RangeCalendar />);
      const rightYearSelect = container.querySelector(
        '.rc-calendar-range-right .rc-calendar-year-select',
      );

      fireEvent.click(rightYearSelect!);

      expect(
        container.querySelectorAll(
          '.rc-calendar-range-left .rc-calendar-next-year-btn',
        ).length,
      ).toBe(1);
      expect(
        container.querySelectorAll(
          '.rc-calendar-range-left .rc-calendar-next-month-btn',
        ).length,
      ).toBe(1);
    });

    it.only('should work when start time is undefined in defaultValue', () => {
      const { container: containerUndefined } = render(
        <RangeCalendar defaultValue={[undefined, moment().endOf('month')]} />,
      );
      const rightMonthSelect = containerUndefined.querySelector(
        '.rc-calendar-range-right .rc-calendar-month-select',
      );
      fireEvent.click(rightMonthSelect!);

      expect(
        containerUndefined.querySelectorAll(
          '.rc-calendar-range-left .rc-calendar-next-year-btn',
        ).length,
      ).toBe(1);
      expect(
        containerUndefined.querySelectorAll(
          '.rc-calendar-range-left .rc-calendar-next-month-btn',
        ).length,
      ).toBe(1);

      const { container } = render(<RangeCalendar />);
      const rightYearSelect = container.querySelector(
        '.rc-calendar-range-right .rc-calendar-year-select',
      );

      fireEvent.click(rightYearSelect!);

      expect(
        container.querySelectorAll(
          '.rc-calendar-range-left .rc-calendar-next-year-btn',
        ).length,
      ).toBe(1);
      expect(
        container.querySelectorAll(
          '.rc-calendar-range-left .rc-calendar-next-month-btn',
        ).length,
      ).toBe(1);
    });

    it.only('should work when end time is undefined in defaultValue', () => {
      const { container: containerUndefined } = render(
        <RangeCalendar defaultValue={[moment().startOf('month'), undefined]} />,
      );
      const rightMonthSelect = containerUndefined.querySelector(
        '.rc-calendar-range-right .rc-calendar-month-select',
      );
      fireEvent.click(rightMonthSelect!);

      expect(
        containerUndefined.querySelectorAll(
          '.rc-calendar-range-left .rc-calendar-next-year-btn',
        ).length,
      ).toBe(1);
      expect(
        containerUndefined.querySelectorAll(
          '.rc-calendar-range-left .rc-calendar-next-month-btn',
        ).length,
      ).toBe(1);

      const { container } = render(<RangeCalendar />);
      const rightYearSelect = container.querySelector(
        '.rc-calendar-range-right .rc-calendar-year-select',
      );

      fireEvent.click(rightYearSelect!);

      expect(
        container.querySelectorAll(
          '.rc-calendar-range-left .rc-calendar-next-year-btn',
        ).length,
      ).toBe(1);
      expect(
        container.querySelectorAll(
          '.rc-calendar-range-left .rc-calendar-next-month-btn',
        ).length,
      ).toBe(1);
    });

    it.only('support controlled mode', () => {
      let value: Moment[] = null;
      function ControlledRangeCalendar() {
        const [mode, setMode] = useState<Mode[]>(['date', 'date']);

          return (
            <RangeCalendar
            mode={mode}
            onPanelChange={(v, updatedMode) => {
              value = v;
              setMode(updatedMode);
            }}
            />
          );
        }
      const { container } = render(<ControlledRangeCalendar />);

      const [startMonthSelect, endMonthSelect] = container.querySelectorAll(
        '.rc-calendar-month-select',
      );
      fireEvent.click(startMonthSelect);
      fireEvent.click(endMonthSelect);

      expect(
        container.querySelectorAll('.rc-calendar-month-panel').length,
      ).toBe(2);

      const [monthPanelYearSelectStart, monthPanelYearSelectEnd] =
        container.querySelectorAll('.rc-calendar-month-panel-year-select');

      fireEvent.click(monthPanelYearSelectStart);
      fireEvent.click(monthPanelYearSelectEnd);

      expect(container.querySelectorAll('.rc-calendar-year-panel').length).toBe(
        2,
      );
      const [yearPanelDecadeSelectStart, yearPanelDecadeSelectEnd] =
        container.querySelectorAll('.rc-calendar-year-panel-decade-select');

      fireEvent.click(yearPanelDecadeSelectStart);
      fireEvent.click(yearPanelDecadeSelectEnd);

      expect(
        container.querySelectorAll('.rc-calendar-decade-panel').length,
      ).toBe(2);

      expect(value[0].isSame(moment(), 'day')).toBe(true);
      expect(value[1].isSame(moment().add(1, 'month'), 'day')).toBe(true);

      const [decadePanelSelectedCellStart, decadePanelSelectedCellEnd] =
        container.querySelectorAll('.rc-calendar-decade-panel-selected-cell');

      fireEvent.click(decadePanelSelectedCellStart);
      fireEvent.click(decadePanelSelectedCellEnd);

      expect(
        container.querySelectorAll('.rc-calendar-decade-panel').length,
      ).toBe(0);

      const [yearPanelSelectedCellStart, yearPanelSelectedCellEnd] =
        container.querySelectorAll('.rc-calendar-year-panel-selected-cell');

      fireEvent.click(yearPanelSelectedCellStart);
      fireEvent.click(yearPanelSelectedCellEnd);

      expect(container.querySelectorAll('.rc-calendar-year-panel').length).toBe(
        0,
      );

      const [monthPanelSelectedCellStart, monthPanelSelectedCellEnd] =
        container.querySelectorAll('.rc-calendar-month-panel-selected-cell');

      fireEvent.click(monthPanelSelectedCellStart);
      fireEvent.click(monthPanelSelectedCellEnd);

      expect(
        container.querySelectorAll('.rc-calendar-month-panel').length,
      ).toBe(0);

      expect(value[0].isSame(moment('2025-05-29'), 'day')).toBe(true);
      expect(value[1].isSame(moment('2025-06-29'), 'day')).toBe(true);

      const [yearSelectStart, yearSelectEnd] = container.querySelectorAll(
        '.rc-calendar-year-select',
      );

      fireEvent.click(yearSelectStart);
      fireEvent.click(yearSelectEnd);
      expect(container.querySelectorAll('.rc-calendar-year-panel').length).toBe(
        2,
      );

      const [yearPanelDecadeSelectStart2, yearPanelDecadeSelectEnd2] =
        container.querySelectorAll('.rc-calendar-year-panel-decade-select');
      fireEvent.click(yearPanelDecadeSelectStart2);

      fireEvent.click(yearPanelDecadeSelectEnd2);
      expect(
        container.querySelectorAll('.rc-calendar-decade-panel').length,
      ).toBe(2);

      const [decadePanelSelectedCellStart2, decadePanelSelectedCellEnd2] =
        container.querySelectorAll('.rc-calendar-decade-panel-selected-cell');

      fireEvent.click(decadePanelSelectedCellStart2);
      fireEvent.click(decadePanelSelectedCellEnd2);
      expect(
        container.querySelectorAll('.rc-calendar-decade-panel').length,
      ).toBe(0);

      const [yearPanelSelectedCellStart2, yearPanelSelectedCellEnd2] =
        container.querySelectorAll('.rc-calendar-year-panel-selected-cell');
      fireEvent.click(yearPanelSelectedCellStart2);
      fireEvent.click(yearPanelSelectedCellEnd2);
      expect(container.querySelectorAll('.rc-calendar-year-panel').length).toBe(
        0,
      );
    });

    it('controlled value works correctly', () => {
      const wrapper = render(<RangeCalendar value={[moment(), moment()]} />);
      const initialValue = wrapper.state('value');
      expect(initialValue[0].isSame(initialValue[1], 'month')).toBe(true);

      wrapper.setProps({ value: [moment(), moment()] });
      const updatedValue = wrapper.state('value');
      expect(updatedValue[0].isSame(updatedValue[1], 'month')).toBe(true);
    });

    // https://github.com/ant-design/ant-design/issues/15659
    it('controlled value works correctly with mode', () => {
      class Demo extends React.Component {
        state = {
          mode: ['month', 'month'],
          value: [moment().add(-1, 'day'), moment()],
        };

        handlePanelChange = (value, mode) => {
          this.setState({
            value,
            mode: [
              mode[0] === 'date' ? 'month' : mode[0],
              mode[1] === 'date' ? 'month' : mode[1],
            ],
          });
        };

        render() {
          return (
            <RangeCalendar
              value={this.state.value}
              selectedValue={this.state.value}
              mode={this.state.mode}
              onPanelChange={this.handlePanelChange}
            />
          );
        }
      }

      const wrapper = render(<Demo />);
      wrapper
        .find('.rc-calendar-month-panel-year-select')
        .first()
        .simulate('click');
      wrapper.find('.rc-calendar-year-panel-cell').at(1).simulate('click');
      expect(
        wrapper
          .find('.rc-calendar-month-panel-year-select-content')
          .first(0)
          .text(),
      ).toBe('2010');
    });

    // https://github.com/ant-design/ant-design/issues/15659
    it('selected item style works correctly with mode year', () => {
      class Demo extends React.Component {
        state = {
          value: [moment().add(-1, 'year'), moment()],
        };

        handlePanelChange = (value) => {
          this.setState({
            value,
          });
        };

        render() {
          return (
            <RangeCalendar
              value={this.state.value}
              selectedValue={this.state.value}
              mode={['year', 'year']}
              onPanelChange={this.handlePanelChange}
            />
          );
        }
      }

      const wrapper = render(<Demo />);
      wrapper.find('.rc-calendar-year-panel-cell').at(1).simulate('click');
      expect(
        wrapper.find('.rc-calendar-year-panel-selected-cell').first(0).text(),
      ).toBe('2010');
    });
  });

  it('can hide date inputs with showDateInput={false}', () => {
    const wrapper = render(<RangeCalendar showDateInput={false} />);
    expect(wrapper).toMatchSnapshot();
  });

  describe('onInputSelect', () => {
    it('trigger when date is valid', () => {
      const handleInputSelect = jest.fn();
      const wrapper = render(
        <RangeCalendar format={format} onInputSelect={handleInputSelect} />,
      );
      wrapper
        .find('input')
        .first()
        .simulate('change', { target: { value: '2013-01-01' } });
      expect(handleInputSelect.mock.calls[0][0].length).toBe(1);
      expect(handleInputSelect.mock.calls[0][0][0].isSame('2013-01-01')).toBe(
        true,
      );
    });

    it('not trigger when date is not valid', () => {
      const handleInputSelect = jest.fn();
      const wrapper = render(
        <RangeCalendar format={format} onInputSelect={handleInputSelect} />,
      );
      wrapper
        .find('input')
        .first()
        .simulate('change', { target: { value: '2013-01-0' } });
      expect(handleInputSelect).not.toBeCalled();
    });
  });

  it('controlled hoverValue changes', () => {
    const start = moment();
    const end = moment().add(2, 'day');
    const wrapper = render(<RangeCalendar hoverValue={[start, end]} />);
    const nextEnd = end.clone().add(2, 'day');
    wrapper.setProps({ hoverValue: [start, nextEnd] });
    expect(wrapper.state().hoverValue[1]).toBe(nextEnd);
  });

  it('controlled selectedValue changes', () => {
    const start = moment();
    const end = moment().add(2, 'day');
    const wrapper = render(<RangeCalendar selectedValue={[start, end]} />);
    const nextEnd = end.clone().add(2, 'day');
    wrapper.setProps({ selectedValue: [start, nextEnd] });
    expect(wrapper.state().selectedValue[1]).toBe(nextEnd);
    expect(wrapper.state().prevSelectedValue[1]).toBe(nextEnd);
  });

  describe('onHoverChange', () => {
    let handleHoverChange;
    let start;
    let end;
    let wrapper;

    beforeEach(() => {
      handleHoverChange = jest.fn();
      start = moment();
      end = moment().add(2, 'day');
      wrapper = render(
        <RangeCalendar
          type="start"
          onHoverChange={handleHoverChange}
          selectedValue={[start, end]}
        />,
      );
    });

    it('mouseEnter', () => {
      wrapper.find('.rc-calendar-date-panel').simulate('mouseEnter');
      expect(handleHoverChange).toHaveBeenCalledWith([start, end]);
    });

    it('mouseHover', () => {
      wrapper.find('.rc-calendar-date-panel').simulate('mouseLeave');
      expect(handleHoverChange).toHaveBeenCalledWith([]);
    });
  });

  it('key control', () => {
    const onChange = jest.fn();
    const onSelect = jest.fn();
    let keyDownEvent = 0;
    const wrapper = render(
      <RangeCalendar
        defaultSelectedValue={[
          moment('2000-09-03', format),
          moment('2000-11-28', format),
        ]}
        onChange={onChange}
        onSelect={onSelect}
        onKeyDown={() => (keyDownEvent = 1)}
      />,
    );
    expect(wrapper.render()).toMatchSnapshot();

    const keyDown = (code: string, info?: any) => {
      wrapper.find('.rc-calendar').simulate('keyDown', {
        ...info,
        key: code,
      });
    };

    const keySimulateCheck = (code: string, month, date, info?: any) => {
      keyDown(code, info);

      expect(
        wrapper
          .find('.rc-calendar-range-left .rc-calendar-month-select')
          .text(),
      ).toEqual(String(month));
      expect(
        wrapper
          .find('.rc-calendar-selected-start-date .rc-calendar-date')
          .text(),
      ).toEqual(String(date));
    };

    // 09-03 down 09-10
    keySimulateCheck('ArrowDown', 'Sep', 10);

    // 09-03 left 09-09
    keySimulateCheck('ArrowLeft', 'Sep', 9);

    // 09-09 right 09-10
    keySimulateCheck('ArrowRight', 'Sep', 10);

    // 09-10 right 09-03
    keySimulateCheck('ArrowUp', 'Sep', 3);

    // 09-10 home 09-01
    keySimulateCheck('Home', 'Sep', 1);

    // 09-10 end 09-30
    keySimulateCheck('End', 'Sep', 30);

    // 09-30 page up 08-30
    keySimulateCheck('PageUp', 'Aug', 30);

    // 08-30 page down 09-30
    keySimulateCheck('PageDown', 'Sep', 30);

    keyDown('Backslash');
    expect(keyDownEvent).toEqual(1);

    keyDown('Enter');

    expect(onChange.mock.calls[0][0][0].format(format)).toEqual('2000-09-30');

    // 2000-09-30 ctrl+right 2001-09-30
    keySimulateCheck('ArrowRight', 'Sep', 30, {
      ctrlKey: true,
    });
    expect(
      wrapper.find('.rc-calendar-range-right .rc-calendar-year-select').text(),
    ).toEqual('2001');

    // 2001-09-30 ctrl+right 2000-09-30
    keySimulateCheck('ArrowLeft', 'Sep', 30, {
      ctrlKey: true,
    });

    keyDown('Enter');
    expect(onChange.mock.calls[1][0][0].format(format)).toEqual('2000-09-30');
    expect(onChange.mock.calls[1][0][1].format(format)).toEqual('2000-09-30');

    expect(onSelect.mock.calls[0][0][0].format(format)).toEqual('2000-09-30');
    expect(onSelect.mock.calls[0][0][1].format(format)).toEqual('2000-09-30');
  });

  it('change input trigger calendar close', () => {
    const value = [moment(), moment().add(1, 'months')];
    const onSelect = jest.fn();

    const wrapper = render(
      <RangeCalendar value={value} selectedValue={value} onSelect={onSelect} />,
    );

    wrapper
      .find('input')
      .at(0)
      .simulate('change', {
        target: {
          value: '1/1/2000',
        },
      });

    expect(onSelect.mock.calls[0][1].source).toEqual('dateInput');

    wrapper.find('input').at(0).simulate('keyDown', {
      keyCode: 'Enter',
    });
    expect(onSelect.mock.calls[1][1].source).toEqual('dateInputSelect');
  });

  it('date mode should not display same month', () => {
    const FORMAT = 'YYYY-MM-DD';
    const sameDay = moment('2000-01-01');
    const wrapper = render(<RangeCalendar defaultValue={[sameDay, sameDay]} />);

    // Should in different month
    expect(
      wrapper.find('CalendarPart').at(0).props().value.format(FORMAT),
    ).toEqual('2000-01-01');
    expect(
      wrapper.find('CalendarPart').at(1).props().value.format(FORMAT),
    ).toEqual('2000-02-01');

    // Back end to month panel
    wrapper
      .find('CalendarPart')
      .at(1)
      .find('.rc-calendar-month-select')
      .simulate('click');
    wrapper
      .find('CalendarPart')
      .at(1)
      .find('.rc-calendar-month-panel-month')
      .at(0)
      .simulate('click');
    expect(
      wrapper.find('CalendarPart').at(0).props().value.format(FORMAT),
    ).toEqual('1999-12-01');
    expect(
      wrapper.find('CalendarPart').at(1).props().value.format(FORMAT),
    ).toEqual('2000-01-01');

    // Back start to month panel
    wrapper
      .find('CalendarPart')
      .at(0)
      .find('.rc-calendar-month-select')
      .simulate('click');
    wrapper
      .find('CalendarPart')
      .at(0)
      .find('.rc-calendar-month-panel-month')
      .at(0)
      .simulate('click');
    expect(
      wrapper.find('CalendarPart').at(0).props().value.format(FORMAT),
    ).toEqual('2000-01-01');
    expect(
      wrapper.find('CalendarPart').at(1).props().value.format(FORMAT),
    ).toEqual('2000-02-01');
  });

  it('render text correctly when range mode is both time', () => {
    const RangeTimePicker = render(
      <RangeCalendar
        mode={['time', 'time']}
        timePicker={
          <TimePickerPanel
            defaultValue={[
              moment('00:00:00', 'HH:mm:ss'),
              moment('23:59:59', 'HH:mm:ss'),
            ]}
          />
        }
      />,
    );
    expect(RangeTimePicker.find('.rc-calendar-time-picker-btn').text()).toBe(
      'select date',
    );
  });
});
