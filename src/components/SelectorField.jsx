import { Component } from "react";

/**
 * SelectorField — Class-based React component
 *
 * Renders a labelled, styled <select> dropdown with a custom chevron icon.
 *
 * Props:
 * ─────────────────────────────────────────────
 * @prop {string}   label         — Field label text displayed above the select
 * @prop {Array}    options        — Array of option objects: { label: string, value: string|number }
 *                                  OR plain strings for quick usage
 * @prop {string}   value         — Controlled value (optional)
 * @prop {Function} onChange      — Callback fired on selection change: (value: string, name: string) => void
 * @prop {string}   name          — Field name identifier passed back in onChange
 * @prop {boolean}  required      — Shows a red asterisk next to the label
 * @prop {boolean}  disabled      — Disables the select element
 * @prop {string}   placeholder   — Placeholder option text (shown when nothing is selected)
 * @prop {string}   hint          — Small helper text shown below the select
 */
class SelectorField extends Component {
  constructor(props) {
    super(props);

    // Internal state for uncontrolled usage
    this.state = {
      internalValue: props.value ?? "",
    };

    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Sync internal state when parent passes a new controlled value.
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.value !== undefined &&
      nextProps.value !== prevState.internalValue
    ) {
      return { internalValue: nextProps.value };
    }
    return null;
  }

  /**
   * Normalises an option entry into a { label, value } shape regardless
   * of whether the consumer passed plain strings or objects.
   */
  normaliseOption(option) {
    if (typeof option === "string" || typeof option === "number") {
      return { label: String(option), value: String(option) };
    }
    return {
      label: String(option.label ?? option.value ?? ""),
      value: String(option.value ?? option.label ?? ""),
    };
  }

  /**
   * Fires on every <select> change event.
   */
  handleChange(event) {
    const newValue = event.target.value;
    const { name = "", onChange } = this.props;

    this.setState({ internalValue: newValue });

    if (typeof onChange === "function") {
      onChange(newValue, name);
    }
  }

  render() {
    const {
      label,
      options = [],
      name = "",
      required = false,
      disabled = false,
      placeholder = "Select an option…",
      hint,
    } = this.props;

    const { internalValue } = this.state;

    return (
      <div className="fb-field">
        {/* ── Label ── */}
        {label && (
          <label className="fb-label" htmlFor={`fb-select-${name}`}>
            {label}
            {required && <span className="fb-required">*</span>}
          </label>
        )}

        {/* ── Select Wrapper (contains custom chevron) ── */}
        <div className="fb-select-wrapper">
          <select
            id={`fb-select-${name}`}
            name={name}
            className="fb-select"
            value={internalValue}
            onChange={this.handleChange}
            disabled={disabled}
            required={required}
            aria-describedby={hint ? `fb-hint-${name}` : undefined}
          >
            {/* Placeholder / empty option */}
            <option value="" disabled={required}>
              {placeholder}
            </option>

            {/* Render normalised options */}
            {options.map((opt) => {
              const { label: optLabel, value: optValue } =
                this.normaliseOption(opt);
              return (
                <option key={optValue} value={optValue}>
                  {optLabel}
                </option>
              );
            })}
          </select>

          {/* Custom chevron icon (SVG, no external deps) */}
          <svg
            className="fb-select-chevron"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* ── Hint text ── */}
        {hint && (
          <span id={`fb-hint-${name}`} className="fb-hint">
            {hint}
          </span>
        )}
      </div>
    );
  }
}

export default SelectorField;
