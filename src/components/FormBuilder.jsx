import React from 'react';
import InputField from './InputField';
import SelectorField from './SelectorField';

/**
 * FormBuilder — npm-react-form-builder
 * Renders a complete form from a fields config array.
 * Manages its own state for all field values.
 *
 * Props:
 *   fields   {Array}    — array of field config objects
 *   onSubmit {function} — called with { fieldId: value, ... } map
 *
 * Field config shape:
 *   { type, label, placeholder, required, options, ... }
 */
class FormBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: this.initValues(props.fields || []),
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  initValues(fields) {
    const values = {};
    fields.forEach((field, idx) => {
      const key = field.id || `field_${idx}`;
      switch (field.type) {
        case 'checkbox':
          values[key] = false;
          break;
        case 'multiselect':
          values[key] = [];
          break;
        default:
          values[key] = '';
      }
    });
    return values;
  }

  handleChange(key, value) {
    this.setState((prev) => ({
      values: { ...prev.values, [key]: value },
    }));
  }

  handleSubmit(e) {
    e.preventDefault();
    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit(this.state.values);
    }
  }


  renderField(field, idx) {
    const key = field.id || `field_${idx}`;
    const value = this.state.values[key];

    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <InputField
            key={key}
            label={field.label}
            placeholder={field.placeholder}
            required={field.required}
            onChange={(val) => this.handleChange(key, val)}
          />
        );

      case 'dropdown':
        return (
          <SelectorField
            key={key}
            label={field.label}
            options={field.options || []}
            onChange={(val) => this.handleChange(key, val)}
          />
        );


      case 'checkbox':
        return (
          <div key={key} className="nrfb-field">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={value || false}
                onChange={(e) => this.handleChange(key, e.target.checked)}
                style={{ accentColor: '#2563eb', width: '15px', height: '15px' }}
              />
              <span className="nrfb-label" style={{ marginBottom: 0 }}>
                {field.label}
              </span>
            </label>
          </div>
        );

      case 'radio':
        return (
          <div key={key} className="nrfb-field">
            {field.label && <label className="nrfb-label">{field.label}</label>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(field.options || []).map((opt) => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                  <input
                    type="radio"
                    name={key}
                    value={opt}
                    checked={value === opt}
                    onChange={(e) => this.handleChange(key, e.target.value)}
                    style={{ accentColor: '#2563eb' }}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        );

      case 'date':
        return (
          <div key={key} className="nrfb-field">
            {field.label && (
              <label className="nrfb-label">
                {field.label}
                {field.required && <span className="nrfb-required">*</span>}
              </label>
            )}
            <input
              type="date"
              className="nrfb-input"
              value={value || ''}
              required={field.required}
              onChange={(e) => this.handleChange(key, e.target.value)}
            />
          </div>
        );

      case 'time':
        return (
          <div key={key} className="nrfb-field">
            {field.label && (
              <label className="nrfb-label">
                {field.label}
                {field.required && <span className="nrfb-required">*</span>}
              </label>
            )}
            <input
              type="time"
              className="nrfb-input"
              value={value || ''}
              required={field.required}
              onChange={(e) => this.handleChange(key, e.target.value)}
            />
          </div>
        );

      case 'file':
        return (
          <div key={key} className="nrfb-field">
            {field.label && <label className="nrfb-label">{field.label}</label>}
            <input
              type="file"
              accept={field.acceptedTypes || '*'}
              className="nrfb-input"
              style={{ padding: '4px 8px' }}
              onChange={(e) => this.handleChange(key, e.target.files[0])}
            />
          </div>
        );

      case 'multiselect':
        return (
          <div key={key} className="nrfb-field">
            {field.label && <label className="nrfb-label">{field.label}</label>}
            <select
              multiple
              className="nrfb-select"
              style={{ height: 'auto', minHeight: '80px' }}
              value={value || []}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
                this.handleChange(key, selected);
              }}
            >
              {(field.options || []).map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        );

      case 'separator':
        return <hr key={key} style={{ border: 'none', borderTop: '2px solid #e5e7eb', margin: '8px 0' }} />;

      case 'textbox':
        return (
          <div key={key} className="nrfb-field">
            <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
              {field.content || field.label || ''}
            </p>
          </div>
        );

      case 'photobox':
        return (
          <div key={key} className="nrfb-field">
            {field.imageUrl ? (
              <img
                src={field.imageUrl}
                alt={field.label || 'image'}
                style={{ width: '100%', borderRadius: '6px', border: '1px solid #e5e7eb' }}
              />
            ) : (
              <div style={{ padding: '20px', border: '1px dashed #d1d5db', borderRadius: '6px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
                No image URL set
              </div>
            )}
          </div>
        );

      default:
        return (
          <div key={key} className="nrfb-field">
            <span style={{ color: '#9ca3af', fontSize: '12px' }}>Unknown field type: {field.type}</span>
          </div>
        );
    }
  }

  render() {
    const fields = this.props.fields || [];

    return (
      <div className="nrfb-form-builder">
        <form onSubmit={this.handleSubmit} noValidate>
          {fields.map((field, idx) => this.renderField(field, idx))}
          <div className="nrfb-form-actions">
            <button type="submit" className="nrfb-btn nrfb-btn-submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default FormBuilder;
