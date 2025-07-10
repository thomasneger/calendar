import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useState } from 'react';
import moment, { Moment } from 'moment';
import { render, fireEvent } from '@testing-library/react';
import TimePickerPanel from '../src/TimePickerPanel';
import RangeCalendar from '../src/RangeCalendar';
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

  it('render works', () => {
    const { container } = render(<RangeCalendar />);

    expect(
      container.querySelectorAll('.rc-calendar-cell').length,
    ).toBeGreaterThan(0);
  });

  it('default sperator', () => {
    const { container } = render(<RangeCalendar />);
    expect(
      container.querySelector('.rc-calendar-range-middle')?.textContent,
    ).toBe('~');
  });

  it('custom sperator', () => {
    const { container } = render(<RangeCalendar seperator="至" />);
    expect(
      container.querySelector('.rc-calendar-range-middle')?.textContent,
    ).toBe('至');
  });

  it('render hoverValue correctly', () => {
    const { container } = render(
      <RangeCalendar hoverValue={[moment(), moment().add(1, 'months')]} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('next month works', async () => {
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

  it('previous month works', async () => {
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

  it('next year works', async () => {
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

  it('previous year works', async () => {
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

  it('left panel shows next buttons when right panel shows month panel', () => {
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

  it('left panel shows next buttons when right panel shows year panel', () => {
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

  it('right panel shows prev buttons when left panel shows month panel', () => {
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

  it('right panel show prev buttons when left panel show year panel', () => {
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

  it('left panel cannot select month after right panel', () => {
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

  it('right panel cannot select month before left panel', () => {
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

  it('onSelect works', () => {
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

  it('onSelect works reversely', () => {
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

  it('onHoverChange works', () => {
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
    it('defaultOpenValue should follow RangeCalendar[selectedValue|defaultSelectedValue] when it is set', () => {
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

    it('selected start and end date can be same', () => {
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

    it("use timePicker's time", () => {
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

    it('should combine disabledTime', () => {
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

    it('works fine when select reversely', () => {
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

    it('disabledTime when same day and different hour or different minute', () => {
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
    it('render controlled panels correctly', () => {
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

    it('should work when start time is null in defaultValue', () => {
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

    it('should work when end time is null in defaultValue', () => {
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

    it('should work when start time is undefined in defaultValue', () => {
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

    it('should work when end time is undefined in defaultValue', () => {
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

    it('support controlled mode', () => {
      let value;
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
      const initialValue = [moment(), moment()];
      const { container, rerender } = render(
        <RangeCalendar value={initialValue} />,
      );

      // Check initial state - both panels should show the same month since values are same
      const [initialLeftMonth, initialRightMonth] = container.querySelectorAll(
        '.rc-calendar-month-select',
      );
      const [initialLeftYear, initialRightYear] = container.querySelectorAll(
        '.rc-calendar-year-select',
      );

      // Since both values are moment(), left should be May and right should be June
      expect(initialLeftMonth.textContent).toEqual('May');
      expect(initialRightMonth.textContent).toEqual('Jun');
      expect(initialLeftYear.textContent).toEqual('2025');
      expect(initialRightYear.textContent).toEqual('2025');

      // Update with new props using rerender
      const updatedValue = [moment(), moment()];
      rerender(<RangeCalendar value={updatedValue} />);

      // Check updated state - should still show same behavior
      const [updatedLeftMonth, updatedRightMonth] = container.querySelectorAll(
        '.rc-calendar-month-select',
      );
      const [updatedLeftYear, updatedRightYear] = container.querySelectorAll(
        '.rc-calendar-year-select',
      );

      // Should still show May/June 2025 since both new values are also moment()
      expect(updatedLeftMonth.textContent).toEqual('May');
      expect(updatedRightMonth.textContent).toEqual('Jun');
      expect(updatedLeftYear.textContent).toEqual('2025');
      expect(updatedRightYear.textContent).toEqual('2025');
    });

    // https://github.com/ant-design/ant-design/issues/15659
    it('controlled value works correctly with mode', () => {
      const Demo = () => {
        const [value, setValue] = useState<Moment[]>([
          moment().add(-1, 'day'),
          moment(),
        ]);
        const [mode, setMode] = useState<Mode[]>(['month', 'month']);

        const handlePanelChange = (value: Moment[], mode: Mode[]) => {
          setValue(value);
          setMode([
            mode[0] === 'date' ? 'month' : mode[0],
            mode[1] === 'date' ? 'month' : mode[1],
          ]);
        };

        return (
          <RangeCalendar
            value={value}
            selectedValue={value}
            mode={mode}
            onPanelChange={handlePanelChange}
          />
        );
      };

      const { container } = render(<Demo />);

      const yearPanelCell = container.querySelector(
        '.rc-calendar-month-panel-year-select',
      );
      fireEvent.click(yearPanelCell!);

      const yearPanelCells = container.querySelectorAll(
        '.rc-calendar-year-panel-cell',
      );
      fireEvent.click(yearPanelCells[1]);

      expect(
        container.querySelectorAll(
          '.rc-calendar-month-panel-year-select-content',
        )[0].innerHTML,
      ).toBe('2025');
    });

    // https://github.com/ant-design/ant-design/issues/15659
    it('selected item style works correctly with mode year', () => {
      const Demo = () => {
        const [value, setValue] = useState<Moment[]>([
          moment().add(-1, 'year'),
          moment(),
        ]);

        return (
          <RangeCalendar
            value={value}
            selectedValue={value}
            mode={['year', 'year']}
            onPanelChange={setValue}
          />
        );
      };

      const { container } = render(<Demo />);
      const yearPanelCell = container.querySelectorAll(
        '.rc-calendar-year-panel-cell',
      )[1];

      fireEvent.click(yearPanelCell);

      expect(
        container.querySelectorAll('.rc-calendar-year-panel-selected-cell')[0]
          .textContent,
      ).toBe('2024');
    });
  });

  it('can hide date inputs with showDateInput={false}', () => {
    const { container } = render(<RangeCalendar showDateInput={false} />);
    expect(container).toMatchSnapshot();
  });

  describe('onInputSelect', () => {
    it('trigger when date is valid', () => {
      const handleInputSelect = vi.fn();
      const { container } = render(
        <RangeCalendar format={format} onInputSelect={handleInputSelect} />,
      );

      const input = container.querySelector('input');
      fireEvent.change(input!, {
        target: { value: '2013-01-01' },
      });

      expect(handleInputSelect.mock.calls[0][0].length).toBe(1);
      expect(handleInputSelect.mock.calls[0][0][0].isSame('2013-01-01')).toBe(
        true,
      );
    });

    it('not trigger when date is not valid', () => {
      const handleInputSelect = vi.fn();
      const { container } = render(
        <RangeCalendar format={format} onInputSelect={handleInputSelect} />,
      );

      const input = container.querySelector('input');
      fireEvent.change(input!, {
        target: { value: '2013-01-0' },
      });

      expect(handleInputSelect).not.toBeCalled();
    });
  });

  it('controlled hoverValue changes', () => {
    const start = moment(); // 2025-05-29
    const end = moment().add(2, 'day'); // 2025-05-31
    const { container, rerender } = render(
      <RangeCalendar hoverValue={[start, end]} />,
    );

    const nextEnd = end.clone().add(2, 'day'); // 2025-06-02
    rerender(<RangeCalendar hoverValue={[start, nextEnd]} />);

    const lastDayCell = container.querySelectorAll(
      '.rc-calendar-selected-day',
    )[1];

    expect(lastDayCell.textContent).toBe('2'); // 2nd of June
  });

  it('controlled selectedValue changes', () => {
    const start = moment();
    const end = moment().add(2, 'day');
    const { container, rerender } = render(
      <RangeCalendar selectedValue={[start, end]} />,
    );
    const nextEnd = end.clone().add(2, 'day');

    rerender(<RangeCalendar selectedValue={[start, nextEnd]} />);
    const selectedLastDayCell = container.querySelectorAll(
      '.rc-calendar-selected-end-date',
    )[0];
    expect(selectedLastDayCell.textContent).toBe('2'); // 2nd of June
  });

  describe('onHoverChange', () => {
    it('mouseEnter', () => {
      const handleHoverChange = vi.fn();
      const start = moment();
      const end = moment().add(2, 'day');
      const { container } = render(
        <RangeCalendar
          type="start"
          onHoverChange={handleHoverChange}
          selectedValue={[start, end]}
        />,
      );
      const datePanel = container?.querySelector('.rc-calendar-date-panel');
      fireEvent.mouseEnter(datePanel!);

      expect(handleHoverChange).toHaveBeenCalledWith([start, end]);
    });

    it('mouseHover', () => {
      const handleHoverChange = vi.fn();
      const start = moment();
      const end = moment().add(2, 'day');
      const { container } = render(
        <RangeCalendar
          type="start"
          onHoverChange={handleHoverChange}
          selectedValue={[start, end]}
        />,
      );
      const datePanel = container?.querySelector('.rc-calendar-date-panel');
      fireEvent.mouseLeave(datePanel!);

      expect(handleHoverChange).toHaveBeenCalledWith([]);
    });
  });

  it('key control', () => {
    const onChange = vi.fn();
    const onSelect = vi.fn();
    let keyDownEvent = 0;
    const { container } = render(
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
    expect(container).toMatchSnapshot();

    const keyDown = (key: string, ctrlKey?: boolean) => {
      fireEvent.keyDown(container.querySelector('.rc-calendar')!, {
        key,
        ctrlKey,
      });
    };

    const keySimulateCheck = (
      code: string,
      month: string,
      date: number,
      ctrlKey?: boolean,
    ) => {
      keyDown(code, ctrlKey);

      expect(
        container.querySelector(
          '.rc-calendar-range-left .rc-calendar-month-select',
        )?.textContent,
      ).toEqual(String(month));

      expect(
        container.querySelector(
          '.rc-calendar-selected-start-date .rc-calendar-date',
        )?.textContent,
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
    keySimulateCheck('ArrowRight', 'Sep', 30, true);
    expect(
      container.querySelector(
        '.rc-calendar-range-right .rc-calendar-year-select',
      )?.textContent,
    ).toEqual('2001');

    // 2001-09-30 ctrl+right 2000-09-30
    keySimulateCheck('ArrowLeft', 'Sep', 30, true);

    keyDown('Enter');
    expect(onChange.mock.calls[1][0][0].format(format)).toEqual('2000-09-30');
    expect(onChange.mock.calls[1][0][1].format(format)).toEqual('2000-09-30');

    expect(onSelect.mock.calls[0][0][0].format(format)).toEqual('2000-09-30');
    expect(onSelect.mock.calls[0][0][1].format(format)).toEqual('2000-09-30');
  });

  it('change input trigger calendar close', () => {
    const value = [moment(), moment().add(1, 'months')];
    const onSelect = vi.fn();

    const { container } = render(
      <RangeCalendar value={value} selectedValue={value} onSelect={onSelect} />,
    );

    const input = container.querySelectorAll('input')[0];

    fireEvent.change(input, {
      target: {
        value: '1/1/2000',
      },
    });

    expect(onSelect.mock.calls[0][1].source).toEqual('dateInput');

    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onSelect.mock.calls[1][1].source).toEqual('dateInputSelect');
  });

  it('date mode should not display same month', () => {
    const sameDay = moment('2000-01-01');
    const { container } = render(
      <RangeCalendar defaultValue={[sameDay, sameDay]} />,
    );

    const [rangeLeftMonth, rangeRightMonth] = container.querySelectorAll(
      '.rc-calendar-month-select',
    );

    // Should be different months initially
    expect(rangeLeftMonth.textContent).toEqual('Jan');
    expect(rangeRightMonth.textContent).toEqual('Feb');

    // Click right panel month selector to open month panel
    fireEvent.click(rangeRightMonth);

    // Click the first month (January) in the month panel
    const firstMonthButton = container.querySelector(
      '.rc-calendar-month-panel-month',
    );

    fireEvent.click(firstMonthButton!);

    const [updatedLeftMonth, updatedRightMonth] = container.querySelectorAll(
      '.rc-calendar-month-select',
    );
    const [updatedLeftYear, updatedRightYear] = container.querySelectorAll(
      '.rc-calendar-year-select',
    );

    expect(updatedLeftMonth.textContent).toEqual('Dec');
    expect(updatedLeftYear.textContent).toEqual('1999');
    expect(updatedRightMonth.textContent).toEqual('Jan');
    expect(updatedRightYear.textContent).toEqual('2000');

    // Now test the reverse - click left panel month selector
    fireEvent.click(updatedLeftMonth);

    // Click the first month (January) in the left panel's month panel
    const leftFirstMonthButton = container.querySelectorAll(
      '.rc-calendar-month-panel-month',
    )[0];
    fireEvent.click(leftFirstMonthButton);

    // After selecting January in left panel, verify the final state
    const [finalLeftMonth, finalRightMonth] = container.querySelectorAll(
      '.rc-calendar-month-select',
    );
    const [finalLeftYear, finalRightYear] = container.querySelectorAll(
      '.rc-calendar-year-select',
    );

    // Both panels should now show 2000, with left=Jan and right=Feb
    expect(finalLeftMonth.textContent).toEqual('Jan');
    expect(finalLeftYear.textContent).toEqual('2000');
    expect(finalRightMonth.textContent).toEqual('Feb');
    expect(finalRightYear.textContent).toEqual('2000');
  });

  it('render text correctly when range mode is both time', () => {
    const { container } = render(
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
    expect(
      container.querySelector('.rc-calendar-time-picker-btn')?.textContent,
    ).toBe('select date');
  });
});
