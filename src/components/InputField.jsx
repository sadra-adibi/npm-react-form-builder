import React from 'react';

/**
 * InputField — npm-react-form-builder
 * A controlled text input field (class component).
 *
 * Props:
 *   label       {string}   — field label
 *   placeholder {string}   — input placeholder
 *   onChange    {function} — called with the new string value
 *   required    {boolean}  — shows asterisk & sets HTML required
 *   disabled    {boolean}  — disables the input
 */
class InputField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const val = e.target.value;
    this.setState({ value: val });
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(val);
    }
  }

  render() {
    const { label, placeholder, required, disabled } = this.props;
    const { value } = this.state;

    return (
      <div className="nrfb-field">
        {label && (
          <label className="nrfb-label">
            {label}
            {required && <span className="nrfb-required">*</span>}
          </label>
        )}
        <input
          type="text"
          className="nrfb-input"
          placeholder={placeholder || ''}
          value={value}
          onChange={this.handleChange}
          required={required || false}
          disabled={disabled || false}
        />
      </div>
    );
  }
}

export default InputField;
