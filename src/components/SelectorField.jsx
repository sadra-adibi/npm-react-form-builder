import React from 'react';

/**
 * SelectorField — npm-react-form-builder
 * A dropdown/select field (class component).
 *
 * Props:
 *   label   {string}          — field label
 *   options {Array}           — array of strings or { value, label } objects
 *   onChange {function}       — called with the selected value string
 */
class SelectorField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const val = e.target.value;
    this.setState({ selected: val });
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(val);
    }
  }

  normalizeOptions(options) {
    if (!Array.isArray(options)) return [];
    return options.map((opt) => {
      if (typeof opt === 'string') return { value: opt, label: opt };
      return { value: opt.value, label: opt.label || opt.value };
    });
  }

  render() {
    const { label } = this.props;
    const { selected } = this.state;
    const options = this.normalizeOptions(this.props.options);

    return (
      <div className="nrfb-field">
        {label && <label className="nrfb-label">{label}</label>}
        <select
          className="nrfb-select"
          value={selected}
          onChange={this.handleChange}
        >
          <option value="">— Select —</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export default SelectorField;
