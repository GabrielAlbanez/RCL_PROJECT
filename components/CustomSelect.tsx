'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';

export type CustomSelectOption = { value: string; label: string } | [string, string];

// Normalize to { value, label }
function normalizeOption(opt: CustomSelectOption): { value: string; label: string } {
  if (Array.isArray(opt)) return { value: opt[0], label: opt[1] };
  return opt;
}

type CustomSelectProps = {
  /** Field name (form submission). */
  name: string;
  /** Field id (form label association). */
  id: string;
  /** List of options rendered in the dropdown. */
  options: CustomSelectOption[];
  /** Placeholder shown when no option is selected. */
  placeholder: string;
  /** Label for the "clear selection" button. */
  clearLabel?: string;
  /** Current value (controlled). */
  value: string;
  /** Called when the selection changes. */
  onChange: (value: string) => void;
  /** Marks the field as invalid for ARIA + styling. */
  invalid?: boolean;
  /** id of the element that describes the field (error message). */
  describedBy?: string;
};

/**
 * CustomSelect — accessible, single-select combobox that replaces a native
 * <select> for the contact form's "challenge" field.
 *
 * Features:
 *  - Custom visual style (not a native dropdown).
 *  - Full keyboard navigation: Enter, Space, ArrowUp/Down, Home/End, Esc.
 *  - ARIA combobox/listbox pattern: aria-expanded, aria-controls, role=option, aria-selected.
 *  - Animation when the listbox opens (slide + fade).
 *  - Clear-selection button.
 *
 * Why not a native <select>? Native dropdowns cannot be styled consistently
 * across browsers/operating systems and look out of place on a brand-driven design.
 */
export default function CustomSelect({
  name,
  id,
  options,
  placeholder,
  clearLabel = 'Clear',
  value,
  onChange,
  invalid,
  describedBy,
}: CustomSelectProps) {
  const listboxId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = useMemo(
    () => options.find((option) => normalizeOption(option).value === value) ?? null,
    [options, value]
  );

  // Close when clicking outside.
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // Focus the first option when the listbox opens.
  useEffect(() => {
    if (open) {
      setActiveIndex((index) => (index >= 0 ? index : 0));
    } else {
      setActiveIndex(-1);
    }
  }, [open]);

  // Keep the highlighted option visible inside the scrollable listbox.
  useEffect(() => {
    if (!open || activeIndex < 0 || !listRef.current) return;
    const item = listRef.current.children[activeIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const commit = (optionValue: string) => {
    onChange(optionValue);
    setOpen(false);
    // Return focus to the trigger so screen readers announce the change.
    requestAnimationFrame(() => buttonRef.current?.focus());
  };

  const handleTriggerKey = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen(true);
    }
  };

  const handleListKey = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => (options.length === 0 ? -1 : (index + 1) % options.length));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => (options.length === 0 ? -1 : (index - 1 + options.length) % options.length));
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(options.length - 1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (activeIndex >= 0 && activeIndex < options.length) commit(normalizeOption(options[activeIndex]).value);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Tab') {
      setOpen(false);
    }
  };

  return (
    <div
      className={`custom-select${open ? ' is-open' : ''}${invalid ? ' is-invalid' : ''}`}
      ref={containerRef}
    >
      {/* Visually hidden native input — keeps form submission and the existing
          server-action contract unchanged. */}
      <input type="hidden" name={name} value={value ?? ''} />

      <button
        ref={buttonRef}
        type="button"
        id={id}
        className="custom-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleTriggerKey}
      >
        <span className={`custom-select-value${selectedOption ? '' : ' is-placeholder'}`}>
          {selectedOption ? normalizeOption(selectedOption).label : placeholder}
        </span>
        <span className="custom-select-caret" aria-hidden="true">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {value && !open && (
        <button
          type="button"
          className="custom-select-clear"
          aria-label={clearLabel}
          onClick={() => onChange('')}
          tabIndex={-1}
        >
          ×
        </button>
      )}

      <div className="custom-select-popover" role="presentation" hidden={!open}>
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          className="custom-select-list"
          aria-label={placeholder}
          onKeyDown={handleListKey}
        >
          {options.length === 0 ? (
            <li key="no-results" className="custom-select-empty" role="option" aria-label="No results found">
              No options
            </li>
          ) : (
            options.map((option, index) => {
              const normalized = normalizeOption(option);
              const isSelected = normalized.value === value;
              const isActive = index === activeIndex;
              return (
                <li
                  key={normalized.value}
                  id={`${listboxId}-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  className={`custom-select-option${isSelected ? ' is-selected' : ''}${isActive ? ' is-active' : ''}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => commit(normalized.value)}
                >
                  <span>{normalized.label}</span>
                  {isSelected && (
                    <span className="custom-select-check" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
