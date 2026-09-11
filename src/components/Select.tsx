import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export type Option = { value: string; label: string };

type Props = {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  ariaLabel: string;
  placeholder?: string;
  icon?: ReactNode;
  /** Classes for the trigger button, so it can sit on the hero or on a card. */
  triggerClass?: string;
  align?: 'left' | 'right';
};

/**
 * A native <select> renders its open list through the OS, so its font, colours,
 * highlight and scrollbar cannot be styled and never match the page. This is a
 * listbox built from regular elements instead, with the keyboard behaviour a
 * <select> would have given us for free.
 */
export default function Select({
  value,
  options,
  onChange,
  ariaLabel,
  placeholder = 'Select',
  icon,
  triggerClass = '',
  align = 'left',
}: Props) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Focus never leaves the trigger, so screen readers need aria-activedescendant
  // to know which option is highlighted. Without it, arrowing through the list
  // announces nothing at all.
  const listId = useId();
  const optionId = (index: number) => `${listId}-option-${index}`;

  // Type-ahead buffer, replacing what a native <select> did for free.
  const typeAhead = useRef({ query: '', at: 0 });

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  // Close on click outside or Escape.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  // Keep the highlighted option in view while arrowing through a long list.
  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.children[activeIndex] as HTMLElement | undefined;
    node?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex]);

  const openList = () => {
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  };

  const choose = (option: Option) => {
    onChange(option.value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onTriggerKeyDown = (event: React.KeyboardEvent) => {
    if (!open) {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openList();
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, options.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (options[activeIndex]) choose(options[activeIndex]);
        break;
      case 'Tab':
        setOpen(false);
        break;
      default:
        // Type-ahead: a single printable character jumps to the next option
        // starting with it; typing several within a second matches a prefix.
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          event.preventDefault();
          const now = Date.now();
          const buffer = now - typeAhead.current.at > 1000 ? '' : typeAhead.current.query;
          const query = (buffer + event.key).toLowerCase();
          typeAhead.current = { query, at: now };

          // Start searching after the current option so repeating a letter
          // cycles through options sharing that initial.
          const start = buffer ? activeIndex : activeIndex + 1;
          const order = options.map((_, i) => (start + i) % options.length);
          const hit = order.find((i) => options[i].label.toLowerCase().startsWith(query));
          if (hit !== undefined) setActiveIndex(hit);
        }
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onTriggerKeyDown}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? optionId(activeIndex) : undefined}
        aria-label={ariaLabel}
        className={`flex w-full items-center gap-2 text-left ${triggerClass}`}
      >
        {icon}
        <span className={`flex-1 truncate ${selected ? '' : 'text-slate-400'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          className={`size-4 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          aria-hidden="true"
        >
          <path d="m4 6 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          tabIndex={-1}
          className={`dropdown-panel absolute z-50 mt-2 max-h-72 min-w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl shadow-slate-900/10 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;
            return (
              <li
                key={option.value}
                id={optionId(index)}
                role="option"
                aria-selected={isSelected}
                onClick={() => choose(option)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-brand-50 font-medium text-brand-700'
                    : isActive
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-700'
                }`}
              >
                {option.label}
                {isSelected && (
                  <svg className="size-4 shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="m3.5 8.5 3 3 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
