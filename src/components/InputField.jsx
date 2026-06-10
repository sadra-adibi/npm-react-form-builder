import { Component } from "react";

/**
 * InputField — Class-based React component
 *
 * Renders a labelled text input (or textarea) with controlled state.
 *
 * Props:
 * ─────────────────────────────────────────────
 * @prop {string}   label       — Field label text displayed above the input
 * @prop {string}   placeholder — Placeholder text shown inside the input
 * @prop {string}   type        — HTML input type (default: "text"). Use "textarea" for multiline.
 * @prop {string}   value       — Controlled value (optional — component manages its own state if omitted)
 * @prop {Function} onChange    — Callback fired on every change: (value: string, name: string) => void
 * @prop {string}   name        — Field name identifier passed back in onChange
 * @prop {boolean}  required    — Shows a red asterisk next to the label
 * @prop {boolean}  disabled    — Disables the input
 * @prop {string}   hint        — Small helper text shown below the input
 */
class InputField extends Component {
  constructor(props) {
    super(props);

    // Internal state — used when the consumer does NOT pass a controlled `value` prop
    this.state = {
      internalValue: props.value ?? "",
    };

    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Sync internal state if a new controlled value is passed from the outside.
   * This keeps the component working in both controlled and uncontrolled modes.
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    // Only sync when the component is being used in controlled mode
    if (
      nextProps.value !== undefined &&
      nextProps.value !== prevState.internalValue
    ) {
      return { internalValue: nextProps.value };
    }
    return null;
  }

  /**
   * Handles every keystroke in the input / textarea.
   * Updates internal state and fires the consumer's onChange callback.
   */
  handleChange(event) {
    const newValue = event.target.value;
    const { name = "", onChange } = this.props;

    // Always keep local state in sync so the input is never uncontrolled
    this.setState({ internalValue: newValue });

    // Notify the parent with the raw string value and the field's name
    if (typeof onChange === "function") {
      onChange(newValue, name);
    }
  }

  render() {
    const {
      label,
      placeholder = "",
      type = "text",
      name = "",
      required = false,
      disabled = false,
      hint,
    } = this.props;

    const { internalValue } = this.state;

    // Decide whether to render a <textarea> or a regular <input>
    const isTextarea = type === "textarea";

    return (
      <div className="fb-field">
        {/* ── Label ── */}
        {label && (
          <label className="fb-label" htmlFor={`fb-input-${name}`}>
            {label}
            {required && <span className="fb-required">*</span>}
          </label>
        )}

        {/* ── Input Wrapper ── */}
        <div className="fb-input-wrapper">
          {isTextarea ? (
            <textarea
              id={`fb-input-${name}`}
              name={name}
              className="fb-input fb-textarea"
              placeholder={placeholder}
              value={internalValue}
              onChange={this.handleChange}
              disabled={disabled}
              required={required}
              aria-describedby={hint ? `fb-hint-${name}` : undefined}
            />
          ) : (
            <input
              id={`fb-input-${name}`}
              name={name}
              type={type}
              className="fb-input"
              placeholder={placeholder}
              value={internalValue}
              onChange={this.handleChange}
              disabled={disabled}
              required={required}
              aria-describedby={hint ? `fb-hint-${name}` : undefined}
            />
          )}
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

export default InputField;
