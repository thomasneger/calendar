import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import React from 'react';
import moment from 'moment';
import { render } from '@testing-library/react';
import TimePickerPanel from '../src/TimePickerPanel';
import RangeCalendar from '../src/RangeCalendar';
import { fireEvent } from '@testing-library/react';

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
    const wrapper = render(
      <RangeCalendar hoverValue={[moment(), moment().add(1, 'months')]} />,
    );
    expect(wrapper).toMatchSnapshot();
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

    it('should combine disabledTime', () => {
      function newArray(start, end) {
        const result = [];
        for (let i = start; i < end; i++) {
          result.push(i);
        }
        return result;
      }
      function disabledTime(time, type) {
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
      const timePicker = (
        <TimePickerPanel
          defaultValue={[
            moment('00:00:00', 'HH:mm:ss'),
            moment('23:59:59', 'HH:mm:ss'),
          ]}
        />
      );
      const wrapper = mount(
        <RangeCalendar timePicker={timePicker} disabledTime={disabledTime} />,
      );

      wrapper
        .find('.rc-calendar-today')
        .at(0)
        .simulate('click')
        .simulate('click');
      wrapper
        .find('.rc-calendar-today')
        .at(0)
        .simulate('click')
        .simulate('click');
      // use timePicker's defaultValue if users haven't select a time
      expect(wrapper.find('.rc-calendar-input').at(0).getDOMNode().value).toBe(
        '3/29/2017 00:00:00',
      );
      expect(wrapper.find('.rc-calendar-input').at(1).getDOMNode().value).toBe(
        '3/29/2017 23:59:59',
      );

      wrapper.find('.rc-calendar-time-picker-btn').simulate('click');

      // update time to timePicker's time
      wrapper
        .find('.rc-calendar-range-left .rc-time-picker-panel-select ul')
        .at(0)
        .find('li')
        .at(23)
        .simulate('click');
      expect(wrapper.find('.rc-calendar-input').at(0).getDOMNode().value).toBe(
        '3/29/2017 23:00:00',
      );
      wrapper
        .find('.rc-calendar-range-left .rc-time-picker-panel-select ul')
        .at(1)
        .find('li')
        .at(25)
        .simulate('click');
      expect(wrapper.find('.rc-calendar-input').at(0).getDOMNode().value).toBe(
        '3/29/2017 23:25:00',
      );
      wrapper
        .find('.rc-calendar-range-left .rc-time-picker-panel-select ul')
        .at(2)
        .find('li')
        .at(3)
        .simulate('click');
      expect(wrapper.find('.rc-calendar-input').at(0).getDOMNode().value).toBe(
        '3/29/2017 23:25:03',
      );

      wrapper
        .find('.rc-calendar-range-right .rc-time-picker-panel-select ul')
        .at(1)
        .find('li')
        .at(25)
        .simulate('click');
      expect(wrapper.find('.rc-calendar-input').at(1).getDOMNode().value).toBe(
        '3/29/2017 23:25:59',
      );

      const disabledTimeElements = wrapper
        .find('.rc-calendar-range-right .rc-time-picker-panel-select ul')
        .at(2)
        .find('.rc-time-picker-panel-select-option-disabled');
      const disabledTimeValus = disabledTimeElements.map((item) => item.text());
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
      const wrapper = mount(<RangeCalendar timePicker={timePicker} />);
      wrapper.find('.rc-calendar-cell').at(20).simulate('click');
      wrapper.find('.rc-calendar-cell').at(10).simulate('click');
      // It can only be re-produced at second time.
      wrapper.find('.rc-calendar-cell').at(20).simulate('click');
      wrapper.find('.rc-calendar-cell').at(10).simulate('click');
      expect(wrapper.find('.rc-calendar-input').at(0).getDOMNode().value).toBe(
        '3/8/2017 00:00:00',
      );
      expect(wrapper.find('.rc-calendar-input').at(1).getDOMNode().value).toBe(
        '3/18/2017 23:59:59',
      );
    });

    it('disabledTime when same day and different hour or different minute', () => {
      // see: https://github.com/ant-design/ant-design/issues/8915
      function newArray(start, end) {
        const result = [];
        for (let i = start; i < end; i++) {
          result.push(i);
        }
        return result;
      }
      function disabledTime(time, type) {
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
      const wrapper = mount(
        <RangeCalendar timePicker={timePicker} disabledTime={disabledTime} />,
      );
      // update same day
      wrapper
        .find('.rc-calendar-today')
        .at(0)
        .simulate('click')
        .simulate('click');
      wrapper
        .find('.rc-calendar-today')
        .at(0)
        .simulate('click')
        .simulate('click');
      expect(wrapper.find('.rc-calendar-input').at(0).getDOMNode().value).toBe(
        '3/29/2017 00:00:00',
      );
      expect(wrapper.find('.rc-calendar-input').at(1).getDOMNode().value).toBe(
        '3/29/2017 23:59:59',
      );
      wrapper.find('.rc-calendar-time-picker-btn').simulate('click');
      // update same hour
      wrapper
        .find('.rc-calendar-range-left .rc-time-picker-panel-select ul')
        .at(0)
        .find('li')
        .at(11)
        .simulate('click');
      wrapper
        .find('.rc-calendar-range-left .rc-time-picker-panel-select ul')
        .at(1)
        .find('li')
        .at(4)
        .simulate('click');
      wrapper
        .find('.rc-calendar-range-left .rc-time-picker-panel-select ul')
        .at(2)
        .find('li')
        .at(4)
        .simulate('click');
      expect(wrapper.find('.rc-calendar-input').at(0).getDOMNode().value).toBe(
        '3/29/2017 11:04:04',
      );
      wrapper
        .find('.rc-calendar-range-right .rc-time-picker-panel-select ul')
        .at(0)
        .find('li')
        .at(11)
        .simulate('click');
      wrapper
        .find('.rc-calendar-range-right .rc-time-picker-panel-select ul')
        .at(1)
        .find('li')
        .at(4)
        .simulate('click');
      wrapper
        .find('.rc-calendar-range-right .rc-time-picker-panel-select ul')
        .at(2)
        .find('li')
        .at(5)
        .simulate('click');
      expect(wrapper.find('.rc-calendar-input').at(1).getDOMNode().value).toBe(
        '3/29/2017 11:04:05',
      );
      // disabled early seconds
      wrapper
        .find('.rc-calendar-range-right .rc-time-picker-panel-select ul')
        .at(2)
        .find('li')
        .at(2)
        .simulate('click');
      expect(wrapper.find('.rc-calendar-input').at(1).getDOMNode().value).toBe(
        '3/29/2017 11:04:05',
      );
      // disabledSeconds
      wrapper
        .find('.rc-calendar-range-right .rc-time-picker-panel-select ul')
        .at(2)
        .find('li')
        .at(55)
        .simulate('click');
      expect(wrapper.find('.rc-calendar-input').at(1).getDOMNode().value).toBe(
        '3/29/2017 11:04:05',
      );
      // disabled early minutes
      wrapper
        .find('.rc-calendar-range-right .rc-time-picker-panel-select ul')
        .at(1)
        .find('li')
        .at(1)
        .simulate('click');
      expect(wrapper.find('.rc-calendar-input').at(1).getDOMNode().value).toBe(
        '3/29/2017 11:04:05',
      );
      // disabledMinutes
      wrapper
        .find('.rc-calendar-range-right .rc-time-picker-panel-select ul')
        .at(1)
        .find('li')
        .at(35)
        .simulate('click');
      expect(wrapper.find('.rc-calendar-input').at(1).getDOMNode().value).toBe(
        '3/29/2017 11:04:05',
      );
      // different minutes for disabledSeconds
      wrapper
        .find('.rc-calendar-range-left .rc-time-picker-panel-select ul')
        .at(1)
        .find('li')
        .at(3)
        .simulate('click');
      wrapper
        .find('.rc-calendar-range-right .rc-time-picker-panel-select ul')
        .at(2)
        .find('li')
        .at(55)
        .simulate('click');
      expect(wrapper.find('.rc-calendar-input').at(1).getDOMNode().value).toBe(
        '3/29/2017 11:04:05',
      );
      // different hour for disabledMinutes
      wrapper
        .find('.rc-calendar-range-left .rc-time-picker-panel-select ul')
        .at(0)
        .find('li')
        .at(10)
        .simulate('click');
      wrapper
        .find('.rc-calendar-range-right .rc-time-picker-panel-select ul')
        .at(1)
        .find('li')
        .at(35)
        .simulate('click');
      expect(wrapper.find('.rc-calendar-input').at(1).getDOMNode().value).toBe(
        '3/29/2017 11:04:05',
      );
    });
  });

  describe('controlled panels', () => {
    it('render controlled panels correctly', () => {
      const RangeMonthPicker = mount(
        <RangeCalendar mode={['month', 'month']} />,
      );
      expect(RangeMonthPicker.render()).toMatchSnapshot();
      RangeMonthPicker.find('.rc-calendar-month-panel-year-select')
        .at(0)
        .simulate('click');
      RangeMonthPicker.find('.rc-calendar-month-panel-year-select')
        .at(1)
        .simulate('click');
      expect(RangeMonthPicker.find('.rc-calendar-year-panel').length).toBe(0);
      expect(RangeMonthPicker.find('.rc-calendar-month-panel').length).toBe(2);

      const RangeYearPicker = mount(<RangeCalendar mode={['year', 'year']} />);
      expect(RangeYearPicker.render()).toMatchSnapshot();
      RangeYearPicker.find('.rc-calendar-year-panel-decade-select')
        .at(0)
        .simulate('click');
      RangeYearPicker.find('.rc-calendar-year-panel-decade-select')
        .at(1)
        .simulate('click');
      expect(RangeYearPicker.find('.rc-calendar-decade-panel').length).toBe(0);
      expect(RangeYearPicker.find('.rc-calendar-year-panel').length).toBe(2);

      const RangeTimePicker = mount(<RangeCalendar mode={['time', 'time']} />);
      expect(RangeTimePicker.find('.rc-calendar-time-picker').length).toBe(2);
    });

    it('should work when start time is null in defaultValue', () => {
      let wrapper = null;
      wrapper = mount(
        <RangeCalendar defaultValue={[null, moment().endOf('month')]} />,
      );
      wrapper
        .find('.rc-calendar-range-right .rc-calendar-month-select')
        .simulate('click');
      expect(
        wrapper.find('.rc-calendar-range-left .rc-calendar-next-year-btn')
          .length,
      ).toBe(1);
      expect(
        wrapper.find('.rc-calendar-range-left .rc-calendar-next-month-btn')
          .length,
      ).toBe(1);
      wrapper = mount(<RangeCalendar />);
      wrapper
        .find('.rc-calendar-range-right .rc-calendar-year-select')
        .simulate('click');
      expect(
        wrapper.find('.rc-calendar-range-left .rc-calendar-next-year-btn')
          .length,
      ).toBe(1);
      expect(
        wrapper.find('.rc-calendar-range-left .rc-calendar-next-month-btn')
          .length,
      ).toBe(1);
    });

    it('should work when end time is null in defaultValue', () => {
      let wrapper = null;
      wrapper = mount(
        <RangeCalendar defaultValue={[moment().startOf('month'), null]} />,
      );
      wrapper
        .find('.rc-calendar-range-right .rc-calendar-month-select')
        .simulate('click');
      expect(
        wrapper.find('.rc-calendar-range-left .rc-calendar-next-year-btn')
          .length,
      ).toBe(1);
      expect(
        wrapper.find('.rc-calendar-range-left .rc-calendar-next-month-btn')
          .length,
      ).toBe(1);
      wrapper = mount(<RangeCalendar />);
      wrapper
        .find('.rc-calendar-range-right .rc-calendar-year-select')
        .simulate('click');
      expect(
        wrapper.find('.rc-calendar-range-left .rc-calendar-next-year-btn')
          .length,
      ).toBe(1);
      expect(
        wrapper.find('.rc-calendar-range-left .rc-calendar-next-month-btn')
          .length,
      ).toBe(1);
    });

    it('should work when start time is undefined in defaultValue', () => {
      let wrapper = null;
      wrapper = mount(
        <RangeCalendar defaultValue={[undefined, moment().endOf('month')]} />,
      );
      wrapper
        .find('.rc-calendar-range-right .rc-calendar-month-select')
        .simulate('click');
      expect(
        wrapper.find('.rc-calendar-range-left .rc-calendar-next-year-btn')
          .length,
      ).toBe(1);
      expect(
        wrapper.find('.rc-calendar-range-left .rc-calendar-next-month-btn')
          .length,
      ).toBe(1);
      wrapper = mount(<RangeCalendar />);
      wrapper
        .find('.rc-calendar-range-right .rc-calendar-year-select')
        .simulate('click');
      expect(
        wrapper.find('.rc-calendar-range-left .rc-calendar-next-year-btn')
          .length,
      ).toBe(1);
      expect(
        wrapper.find('.rc-calendar-range-left .rc-calendar-next-month-btn')
          .length,
      ).toBe(1);
    });

    it('should work when end time is undefined in defaultValue', () => {
      let wrapper = null;
      wrapper = mount(
        <RangeCalendar defaultValue={[moment().startOf('month'), undefined]} />,
      );
      wrapper
        .find('.rc-calendar-range-right .rc-calendar-month-select')
        .simulate('click');
      expect(
        wrapper.find('.rc-calendar-range-left .rc-calendar-next-year-btn')
          .length,
      ).toBe(1);
      expect(
        wrapper.find('.rc-calendar-range-left .rc-calendar-next-month-btn')
          .length,
      ).toBe(1);
      wrapper = mount(<RangeCalendar />);
      wrapper
        .find('.rc-calendar-range-right .rc-calendar-year-select')
        .simulate('click');
      expect(
        wrapper.find('.rc-calendar-range-left .rc-calendar-next-year-btn')
          .length,
      ).toBe(1);
      expect(
        wrapper.find('.rc-calendar-range-left .rc-calendar-next-month-btn')
          .length,
      ).toBe(1);
    });

    it('support controlled mode', () => {
      let value = null;
      class ControlledRangeCalendar extends React.Component {
        state = { mode: ['date', 'date'] };

        handlePanelChange = (v, mode) => {
          value = v;
          this.setState({ mode });
        };

        render() {
          return (
            <RangeCalendar
              mode={this.state.mode}
              onPanelChange={this.handlePanelChange}
            />
          );
        }
      }
      const wrapper = mount(<ControlledRangeCalendar />);

      wrapper.find('.rc-calendar-month-select').at(0).simulate('click');
      wrapper.find('.rc-calendar-month-select').at(1).simulate('click');
      expect(wrapper.find('.rc-calendar-month-panel').length).toBe(2);
      wrapper
        .find('.rc-calendar-month-panel-year-select')
        .at(0)
        .simulate('click');
      wrapper
        .find('.rc-calendar-month-panel-year-select')
        .at(0)
        .simulate('click');
      expect(wrapper.find('.rc-calendar-year-panel').length).toBe(2);
      wrapper
        .find('.rc-calendar-year-panel-decade-select')
        .at(0)
        .simulate('click');
      wrapper
        .find('.rc-calendar-year-panel-decade-select')
        .at(0)
        .simulate('click');
      expect(wrapper.find('.rc-calendar-decade-panel').length).toBe(2);
      expect(value[0].isSame(moment(), 'day')).toBe(true);
      expect(value[1].isSame(moment().add(1, 'month'), 'day')).toBe(true);
      wrapper
        .find('.rc-calendar-decade-panel-selected-cell')
        .at(0)
        .simulate('click');
      wrapper
        .find('.rc-calendar-decade-panel-selected-cell')
        .at(0)
        .simulate('click');
      expect(wrapper.find('.rc-calendar-decade-panel').length).toBe(0);
      wrapper
        .find('.rc-calendar-year-panel-selected-cell')
        .at(0)
        .simulate('click');
      wrapper
        .find('.rc-calendar-year-panel-selected-cell')
        .at(0)
        .simulate('click');
      expect(wrapper.find('.rc-calendar-year-panel').length).toBe(0);
      wrapper
        .find('.rc-calendar-month-panel-selected-cell')
        .at(0)
        .simulate('click');
      wrapper
        .find('.rc-calendar-month-panel-selected-cell')
        .at(0)
        .simulate('click');
      expect(wrapper.find('.rc-calendar-month-panel').length).toBe(0);
      expect(value[0].isSame(moment('2010-03-29'), 'day')).toBe(true);
      expect(value[1].isSame(moment('2010-04-29'), 'day')).toBe(true);

      wrapper.find('.rc-calendar-year-select').at(0).simulate('click');
      wrapper.find('.rc-calendar-year-select').at(1).simulate('click');
      expect(wrapper.find('.rc-calendar-year-panel').length).toBe(2);
      wrapper
        .find('.rc-calendar-year-panel-decade-select')
        .at(0)
        .simulate('click');
      wrapper
        .find('.rc-calendar-year-panel-decade-select')
        .at(0)
        .simulate('click');
      expect(wrapper.find('.rc-calendar-decade-panel').length).toBe(2);
      wrapper
        .find('.rc-calendar-decade-panel-selected-cell')
        .at(0)
        .simulate('click');
      wrapper
        .find('.rc-calendar-decade-panel-selected-cell')
        .at(0)
        .simulate('click');
      expect(wrapper.find('.rc-calendar-decade-panel').length).toBe(0);
      wrapper
        .find('.rc-calendar-year-panel-selected-cell')
        .at(0)
        .simulate('click');
      wrapper
        .find('.rc-calendar-year-panel-selected-cell')
        .at(0)
        .simulate('click');
      expect(wrapper.find('.rc-calendar-year-panel').length).toBe(0);
    });

    it('controlled value works correctly', () => {
      const wrapper = mount(<RangeCalendar value={[moment(), moment()]} />);
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

      const wrapper = mount(<Demo />);
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

      const wrapper = mount(<Demo />);
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
      const wrapper = mount(
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
      const wrapper = mount(
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
    const wrapper = mount(<RangeCalendar hoverValue={[start, end]} />);
    const nextEnd = end.clone().add(2, 'day');
    wrapper.setProps({ hoverValue: [start, nextEnd] });
    expect(wrapper.state().hoverValue[1]).toBe(nextEnd);
  });

  it('controlled selectedValue changes', () => {
    const start = moment();
    const end = moment().add(2, 'day');
    const wrapper = mount(<RangeCalendar selectedValue={[start, end]} />);
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
      wrapper = mount(
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
    const wrapper = mount(
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

    const wrapper = mount(
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
    const wrapper = mount(<RangeCalendar defaultValue={[sameDay, sameDay]} />);

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
    const RangeTimePicker = mount(
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
