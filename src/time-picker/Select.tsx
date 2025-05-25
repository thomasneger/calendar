import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEventHandler,
  type MouseEventHandler,
} from 'react';
import classNames from 'classnames';

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
    (smooth: boolean) => {
      if (!list.current) {
        return;
      }

      const index = selectedIndex < 0 ? 0 : selectedIndex;
      if (index >= list.current.children.length) {
        return;
      }

      const option = list.current.children[index] as HTMLLIElement;

      option.scrollIntoView({
        behavior: smooth ? 'smooth' : 'instant',
        block: 'start',
      });
    },
    [selectedIndex],
  );

  const prevSelectedIndexRef = useRef<number>(null);

  useEffect(() => {
    // Skip the initial render
    if (prevSelectedIndexRef.current === null) {
      prevSelectedIndexRef.current = selectedIndex;
      scrollToSelected(false); // Use instant scroll for first render
      return;
    }

    if (prevSelectedIndexRef.current !== selectedIndex) {
      scrollToSelected(true); // Use smooth scroll for updates
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
