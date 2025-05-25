import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEventHandler,
  type MouseEventHandler,
} from 'react';
import classNames from 'classnames';
import raf from 'raf';

const scrollTo = (
  element: HTMLDivElement | null,
  to: number,
  duration: number,
) => {
  if (!element) {
    return;
  }

  // jump to target if duration zero
  if (duration <= 0) {
    raf(() => {
      element.scrollTop = to;
    });
    return;
  }
  const difference = to - element.scrollTop;
  const perTick = (difference / duration) * 10;

  raf(() => {
    element.scrollTop += perTick;
    if (element.scrollTop === to) return;
    scrollTo(element, to, duration - 10);
  });
};

interface SelectProps {
  selectedIndex: number;
  onSelect: (type: string, value: string) => void;
  type: string;
  options: { value: string; disabled?: boolean }[];
  prefixCls: string;
  onMouseEnter: (e: React.MouseEvent) => void;
  onEsc: () => void;
}

export default function Select(props: SelectProps) {
  const {
    options,
    selectedIndex,
    prefixCls,
    onEsc,
    onSelect,
    type,
    onMouseEnter,
  } = props;

  const [active, setActive] = useState(false);

  const scrollToSelected = useCallback(
    (duration: number) => {
      // move to selected item
      if (!list.current) {
        return;
      }
      let index = selectedIndex;
      if (index < 0) {
        index = 0;
      }
      const topOption = list.current.children[index] as HTMLLIElement;
      const to = topOption.offsetTop;

      scrollTo(root.current, to, duration);
    },
    [selectedIndex],
  );

  const prevSelectedIndexRef = useRef<number>(null);

  useEffect(() => {
    // Skip the initial render
    if (typeof prevSelectedIndexRef.current === 'undefined') {
      // First render - just save the value and return
      prevSelectedIndexRef.current = selectedIndex;
      scrollToSelected(0); // Only do instant scroll on mount
      return;
    }

    // Check if selectedIndex actually changed
    if (prevSelectedIndexRef.current !== selectedIndex) {
      // It changed, do the animated scroll
      scrollToSelected(120);
      // Update the ref
      prevSelectedIndexRef.current = selectedIndex;
    }
  }, [selectedIndex, scrollToSelected]);

  const handleSelect = (value: string) => {
    onSelect(type, value);
  };

  const getOptions = () => {
    return options.map((item, index) => {
      const cls = classNames({
        [`${prefixCls}-select-option-selected`]: selectedIndex === index,
        [`${prefixCls}-select-option-disabled`]: item.disabled,
      });

      const onClick = () => {
        if (item.disabled) {
          return;
        }

        handleSelect(item.value);
      };

      const onKeyDown: KeyboardEventHandler = (e) => {
        if (e.key === 'Enter') {
          onClick();
        } else if (e.key === 'Escape') {
          onEsc();
        }
      };

      return (
        <li
          role="button"
          onClick={onClick}
          className={cls}
          key={index}
          // @ts-expect-error The original code was using `disabled` as a prop, which is not valid for `li`.
          // That being said, it does apply the "disabled" attribute, hence people could have used it to style the element
          disabled={item.disabled}
          tabIndex={0}
          onKeyDown={onKeyDown}
        >
          {item.value}
        </li>
      );
    });
  };

  const handleMouseEnter: MouseEventHandler = (e) => {
    setActive(true);
    onMouseEnter(e);
  };

  const handleMouseLeave = () => {
    setActive(false);
  };

  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement | null>(null);

  if (options.length === 0) {
    return null;
  }

  const cls = classNames(`${prefixCls}-select`, {
    [`${prefixCls}-select-active`]: active,
  });

  return (
    <div
      className={cls}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={root}
    >
      <ul ref={list}>{getOptions()}</ul>
    </div>
  );
}
