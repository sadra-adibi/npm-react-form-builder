import { Component } from "react";
import InputField from "./InputField";
import SelectorField from "./SelectorField";
import ImageUploadField from "./ImageUploadField";

/**
 * FormBuilder — Class-based React component
 *
 * Renders a complete, self-contained form from a declarative `fields` config array.
 * Each field entry specifies its `type` and passes through any relevant props.
 *
 * Supported field types:
 *  • "input"    → <InputField>
 *  • "selector" → <SelectorField>
 *  • "image"    → <ImageUploadField>
 *
 * Props:
 * ─────────────────────────────────────────────
 * @prop {Array}    fields        — Array of field config objects (see Field Schema below)
 * @prop {string}   title         — Optional form title shown in the header
 * @prop {string}   description   — Optional subtitle shown below the title
 * @prop {Function} onSubmit      — Called with the full form values object when the form is submitted
 * @prop {Function} onReset       — Called when the Reset button is clicked (after values are cleared)
 * @prop {string}   submitLabel   — Label for the submit button (default: "Submit")
 * @prop {string}   resetLabel    — Label for the reset button (default: "Reset")
 * @prop {boolean}  showReset     — Whether to show the Reset button (default: true)
 *
 * Field Schema:
 * ─────────────────────────────────────────────
 * {
 *   type:        "input" | "selector" | "image",   // Required — determines which component renders
 *   name:        string,                            // Unique key used in the values object
 *   label:       string,                            // Label text
 *   placeholder: string,                            // (input) placeholder
 *   inputType:   string,                            // (input) HTML input type, e.g. "email", "number"
 *   options:     Array,                             // (selector) option list
 *   accept:      string[],                          // (image) accepted MIME types
 *   maxSizeMB:   number,                            // (image) max file size
 *   required:    boolean,
 *   disabled:    boolean,
 *   hint:        string,
 *   defaultValue: any,                              // Pre-populated default value
 * }
 */
class FormBuilder extends Component {
  constructor(props) {
    super(props);

    // Initialise form values from field defaultValues
    this.state = {
      values: this.buildInitialValues(props.fields),
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleSubmit      = this.handleSubmit.bind(this);
    this.handleReset       = this.handleReset.bind(this);
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  /**
   * Builds the initial `values` map from the fields array.
   * Uses `defaultValue` if present, otherwise falls back to an empty string.
   */
  buildInitialValues(fields = []) {
    return fields.reduce((acc, field) => {
      if (field.name) {
        acc[field.name] = field.defaultValue ?? "";
      }
      return acc;
    }, {});
  }

  // ── Event Handlers ───────────────────────────────────────────────────────

  /**
   * Generic onChange handler shared by all field types.
   * @param {any}    value — the new field value (string | File | null)
   * @param {string} name  — the field's `name` key
   */
  handleFieldChange(value, name) {
    this.setState((prevState) => ({
      values: {
        ...prevState.values,
        [name]: value,
      },
    }));
  }

  /**
   * Called when the form's native submit event fires.
   * Prevents the default page reload and passes the values map to the parent.
   */
  handleSubmit(event) {
    event.preventDefault();
    const { onSubmit } = this.props;

    if (typeof onSubmit === "function") {
      // Pass a shallow copy so the parent can't mutate our state
      onSubmit({ ...this.state.values });
    }
  }

  /**
   * Resets all field values back to their defaults and notifies the parent.
   */
  handleReset() {
    const { fields = [], onReset } = this.props;
    const freshValues = this.buildInitialValues(fields);
    this.setState({ values: freshValues });

    if (typeof onReset === "function") {
      onReset();
    }
  }

  // ── Field Renderer ───────────────────────────────────────────────────────

  /**
   * Given a single field config object, renders the appropriate component.
   * Unknown types render an error badge so developers can spot mistakes quickly.
   */
  renderField(field, index) {
    const {
      type,
      name,
      label,
      placeholder,
      inputType,
      options,
      accept,
      maxSizeMB,
      required,
      disabled,
      hint,
    } = field;

    const value = this.state.values[name];
    const key = name || `fb-field-${index}`;

    switch (type) {
      case "input":
        return (
          <InputField
            key={key}
            name={name}
            label={label}
            placeholder={placeholder}
            type={inputType || "text"}
            value={value}
            onChange={this.handleFieldChange}
            required={required}
            disabled={disabled}
            hint={hint}
          />
        );

      case "selector":
        return (
          <SelectorField
            key={key}
            name={name}
            label={label}
            options={options || []}
            value={value}
            onChange={this.handleFieldChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            hint={hint}
          />
        );

      case "image":
        return (
          <ImageUploadField
            key={key}
            name={name}
            label={label}
            onChange={this.handleFieldChange}
            accept={accept}
            maxSizeMB={maxSizeMB}
            required={required}
            hint={hint}
          />
        );

      default:
        return (
          <div key={key} className="fb-unknown-field">
            ⚠ Unknown field type: <strong>"{type}"</strong>. Supported types: input, selector, image.
          </div>
        );
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────

  render() {
    const {
      fields = [],
      title,
      description,
      submitLabel = "Submit",
      resetLabel = "Reset",
      showReset = true,
    } = this.props;

    return (
      <form className="fb-form-builder" onSubmit={this.handleSubmit} noValidate>
        {/* ── Optional Header ── */}
        {(title || description) && (
          <div className="fb-form-builder__header">
            {title && (
              <h2 className="fb-form-builder__title">{title}</h2>
            )}
            {description && (
              <p className="fb-form-builder__description">{description}</p>
            )}
          </div>
        )}

        {/* ── Fields ── */}
        <div className="fb-form-builder__body">
          {fields.map((field, index) => this.renderField(field, index))}
        </div>

        {/* ── Footer with action buttons ── */}
        <div className="fb-form-builder__footer">
          {showReset && (
            <button
              type="button"
              className="fb-btn fb-btn-secondary"
              onClick={this.handleReset}
            >
              {resetLabel}
            </button>
          )}
          <button type="submit" className="fb-btn fb-btn-primary">
            {submitLabel}
          </button>
        </div>
      </form>
    );
  }
}

export default FormBuilder;
