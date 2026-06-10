import React from 'react';
import './styles/form-builder.css';

// ─── Field type registry ─────────────────────────────────────────────────────
const FIELD_TYPES = [
  { type: 'text',        label: 'Text Input',       icon: '✏️' },
  { type: 'dropdown',    label: 'Dropdown / Select', icon: '🔽' },
  { type: 'image',       label: 'Image Upload',      icon: '🖼️' },
  { type: 'checkbox',    label: 'Checkbox',          icon: '☑️' },
  { type: 'radio',       label: 'Radio Button',      icon: '🔘' },
  { type: 'date',        label: 'Date',              icon: '📅' },
  { type: 'email',       label: 'Email',             icon: '📧' },
  { type: 'file',        label: 'File Upload',       icon: '📎' },
  { type: 'multiselect', label: 'Multi Select',      icon: '📋' },
  { type: 'separator',   label: 'Separator',         icon: '➖' },
  { type: 'textbox',     label: 'Text Box',          icon: '📝' },
  { type: 'photobox',    label: 'Photo Box',         icon: '🏞️' },
];

function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

function makeField(type) {
  const base = { id: makeId(), type };
  switch (type) {
    case 'text':
      return { ...base, label: 'Text Input', placeholder: 'Enter text...', required: false };
    case 'dropdown':
      return { ...base, label: 'Dropdown', options: ['Option 1', 'Option 2', 'Option 3'] };
    case 'image':
      return { ...base, label: 'Image Upload' };
    case 'checkbox':
      return { ...base, label: 'Check this box' };
    case 'radio':
      return { ...base, label: 'Choose one', options: ['Option A', 'Option B'] };
    case 'date':
      return { ...base, label: 'Select a date', required: false };
    case 'email':
      return { ...base, label: 'Email Address', placeholder: 'you@example.com', required: false };
    case 'file':
      return { ...base, label: 'Upload File', acceptedTypes: '*' };
    case 'multiselect':
      return { ...base, label: 'Multi Select', options: ['Alpha', 'Beta', 'Gamma'] };
    case 'separator':
      return { ...base };
    case 'textbox':
      return { ...base, content: 'This is a static text block. Click edit to change this text.' };
    case 'photobox':
      return { ...base, imageUrl: '' };
    default:
      return base;
  }
}

// ─── Field Preview (read-only visual) ────────────────────────────────────────
class FieldPreview extends React.Component {
  render() {
    const { field } = this.props;
    switch (field.type) {
      case 'text':
        return (
          <div>
            <label className="fb-preview-label">
              {field.label || 'Text Input'}
              {field.required && <span className="fb-preview-required">*</span>}
            </label>
            <input className="fb-preview-input" type="text" placeholder={field.placeholder || 'Enter text...'} readOnly />
          </div>
        );
      case 'email':
        return (
          <div>
            <label className="fb-preview-label">
              {field.label || 'Email'}
              {field.required && <span className="fb-preview-required">*</span>}
            </label>
            <input className="fb-preview-input" type="email" placeholder={field.placeholder || 'you@example.com'} readOnly />
          </div>
        );
      case 'dropdown':
        return (
          <div>
            <label className="fb-preview-label">{field.label || 'Dropdown'}</label>
            <select className="fb-preview-select" disabled>
              <option>— Select —</option>
              {(field.options || []).map((o, i) => <option key={i}>{o}</option>)}
            </select>
          </div>
        );
      case 'image':
        return (
          <div>
            <label className="fb-preview-label">{field.label || 'Image Upload'}</label>
            <div className="fb-preview-upload">
              <span>🖼️</span>
              <span>Click or drag an image here</span>
            </div>
          </div>
        );
      case 'checkbox':
        return (
          <div className="fb-preview-checkbox-row">
            <input type="checkbox" className="fb-preview-checkbox" readOnly />
            <span>{field.label || 'Checkbox'}</span>
          </div>
        );
      case 'radio':
        return (
          <div>
            <label className="fb-preview-label">{field.label || 'Radio'}</label>
            <div className="fb-preview-radio-group">
              {(field.options || ['Option A', 'Option B']).map((o, i) => (
                <div className="fb-preview-radio-row" key={i}>
                  <input type="radio" className="fb-preview-radio" readOnly />
                  <span>{o}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'date':
        return (
          <div>
            <label className="fb-preview-label">
              {field.label || 'Date'}
              {field.required && <span className="fb-preview-required">*</span>}
            </label>
            <input className="fb-preview-input" type="date" readOnly />
          </div>
        );
      case 'file':
        return (
          <div>
            <label className="fb-preview-label">{field.label || 'File Upload'}</label>
            <div className="fb-preview-upload">
              <span>📎</span>
              <span>Click to upload {field.acceptedTypes && field.acceptedTypes !== '*' ? `(${field.acceptedTypes})` : ''}</span>
            </div>
          </div>
        );
      case 'multiselect':
        return (
          <div>
            <label className="fb-preview-label">{field.label || 'Multi Select'}</label>
            <div className="fb-multiselect-tags">
              {(field.options || []).slice(0, 3).map((o, i) => (
                <span className="fb-multiselect-tag" key={i}>{o}</span>
              ))}
              {(field.options || []).length > 3 && <span className="fb-multiselect-tag">+{(field.options || []).length - 3}</span>}
            </div>
          </div>
        );
      case 'separator':
        return <hr className="fb-preview-separator" />;
      case 'textbox':
        return (
          <p className="fb-preview-textbox">{field.content || 'Static text block — click Edit to change.'}</p>
        );
      case 'photobox':
        return field.imageUrl ? (
          <img src={field.imageUrl} alt="photo" className="fb-preview-photobox" />
        ) : (
          <div className="fb-preview-photobox-placeholder">
            <span style={{ fontSize: '28px' }}>🏞️</span>
            <span>No image URL set — click Edit to add one</span>
          </div>
        );
      default:
        return <div style={{ color: '#94a3b8', fontSize: '12px' }}>Unknown field: {field.type}</div>;
    }
  }
}

// ─── Inline Field Editor ──────────────────────────────────────────────────────
class FieldEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleLabelChange = this.handleLabelChange.bind(this);
    this.handlePlaceholderChange = this.handlePlaceholderChange.bind(this);
    this.handleRequiredToggle = this.handleRequiredToggle.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleImageUrlChange = this.handleImageUrlChange.bind(this);
    this.handleAcceptedTypesChange = this.handleAcceptedTypesChange.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleAddOption = this.handleAddOption.bind(this);
    this.handleRemoveOption = this.handleRemoveOption.bind(this);
  }

  handleLabelChange(e) {
    this.props.onUpdate({ label: e.target.value });
  }
  handlePlaceholderChange(e) {
    this.props.onUpdate({ placeholder: e.target.value });
  }
  handleRequiredToggle(e) {
    this.props.onUpdate({ required: e.target.checked });
  }
  handleContentChange(e) {
    this.props.onUpdate({ content: e.target.value });
  }
  handleImageUrlChange(e) {
    this.props.onUpdate({ imageUrl: e.target.value });
  }
  handleAcceptedTypesChange(e) {
    this.props.onUpdate({ acceptedTypes: e.target.value });
  }
  handleOptionChange(idx, val) {
    const opts = [...(this.props.field.options || [])];
    opts[idx] = val;
    this.props.onUpdate({ options: opts });
  }
  handleAddOption() {
    const opts = [...(this.props.field.options || []), 'New Option'];
    this.props.onUpdate({ options: opts });
  }
  handleRemoveOption(idx) {
    const opts = (this.props.field.options || []).filter((_, i) => i !== idx);
    this.props.onUpdate({ options: opts });
  }

  renderOptionsEditor() {
    const { field } = this.props;
    return (
      <div className="fb-form-group">
        <label className="fb-form-label">Options</label>
        <div className="fb-options-list">
          {(field.options || []).map((opt, idx) => (
            <div className="fb-option-row" key={idx}>
              <input
                className="fb-form-input"
                type="text"
                value={opt}
                onChange={(e) => this.handleOptionChange(idx, e.target.value)}
              />
              <button
                type="button"
                className="fb-option-remove"
                onClick={() => this.handleRemoveOption(idx)}
                title="Remove option"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="fb-add-option-btn" onClick={this.handleAddOption}>
          + Add Option
        </button>
      </div>
    );
  }

  render() {
    const { field } = this.props;

    if (field.type === 'separator') {
      return (
        <div style={{ color: '#94a3b8', fontSize: '12px', fontStyle: 'italic' }}>
          No properties to edit for a separator.
        </div>
      );
    }

    return (
      <div>
        {/* Label */}
        {field.type !== 'separator' && field.type !== 'textbox' && field.type !== 'photobox' && (
          <div className="fb-form-group">
            <label className="fb-form-label">Label</label>
            <input
              className="fb-form-input"
              type="text"
              value={field.label || ''}
              onChange={this.handleLabelChange}
            />
          </div>
        )}

        {/* Placeholder */}
        {(field.type === 'text' || field.type === 'email') && (
          <div className="fb-form-group">
            <label className="fb-form-label">Placeholder</label>
            <input
              className="fb-form-input"
              type="text"
              value={field.placeholder || ''}
              onChange={this.handlePlaceholderChange}
            />
          </div>
        )}

        {/* Required toggle */}
        {(field.type === 'text' || field.type === 'email' || field.type === 'date') && (
          <div className="fb-form-group">
            <div className="fb-toggle-row">
              <label className="fb-toggle">
                <input
                  type="checkbox"
                  checked={field.required || false}
                  onChange={this.handleRequiredToggle}
                />
                <span className="fb-toggle-slider" />
              </label>
              <span className="fb-toggle-label">Required field</span>
            </div>
          </div>
        )}

        {/* Options list */}
        {(field.type === 'dropdown' || field.type === 'radio' || field.type === 'multiselect') && (
          this.renderOptionsEditor()
        )}

        {/* Accepted file types */}
        {field.type === 'file' && (
          <div className="fb-form-group">
            <label className="fb-form-label">Accepted File Types</label>
            <input
              className="fb-form-input"
              type="text"
              value={field.acceptedTypes || '*'}
              placeholder=".pdf,.doc,.jpg or *"
              onChange={this.handleAcceptedTypesChange}
            />
          </div>
        )}

        {/* Text box content */}
        {field.type === 'textbox' && (
          <div className="fb-form-group">
            <label className="fb-form-label">Text Content</label>
            <textarea
              className="fb-form-textarea"
              value={field.content || ''}
              onChange={this.handleContentChange}
              placeholder="Enter the static text to display..."
            />
          </div>
        )}

        {/* Photo box URL */}
        {field.type === 'photobox' && (
          <div className="fb-form-group">
            <label className="fb-form-label">Image URL</label>
            <input
              className="fb-form-input"
              type="text"
              value={field.imageUrl || ''}
              placeholder="https://example.com/photo.jpg"
              onChange={this.handleImageUrlChange}
            />
          </div>
        )}
      </div>
    );
  }
}

// ─── Field Card ───────────────────────────────────────────────────────────────
class FieldCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editing: false, dragOverPos: null };
    this.toggleEdit = this.toggleEdit.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
  }

  toggleEdit() {
    this.setState((s) => ({ editing: !s.editing }));
  }

  handleDragStart(e) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({ source: 'canvas', id: this.props.field.id }));
    this.props.onDragStart(this.props.field.id);
  }

  handleDragEnd() {
    this.props.onDragEnd();
    this.setState({ dragOverPos: null });
  }

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const rect = e.currentTarget.getBoundingClientRect();
    const mid = rect.top + rect.height / 2;
    this.setState({ dragOverPos: e.clientY < mid ? 'top' : 'bottom' });
  }

  handleDragLeave() {
    this.setState({ dragOverPos: null });
  }

  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    const pos = this.state.dragOverPos;
    this.setState({ dragOverPos: null });
    const raw = e.dataTransfer.getData('text/plain');
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      this.props.onDrop(data, this.props.field.id, pos);
    } catch (_) {}
  }

  render() {
    const { field, isDragging, onUpdate, onDelete } = this.props;
    const { editing, dragOverPos } = this.state;
    const typeInfo = FIELD_TYPES.find((t) => t.type === field.type) || {};

    let cardClass = 'fb-field-card';
    if (isDragging) cardClass += ' drag-source';
    if (dragOverPos === 'top') cardClass += ' drag-over-top';
    if (dragOverPos === 'bottom') cardClass += ' drag-over-bottom';
    if (editing) cardClass += ' editing';

    return (
      <div
        className={cardClass}
        onDragOver={this.handleDragOver}
        onDragLeave={this.handleDragLeave}
        onDrop={this.handleDrop}
      >
        {/* Card header */}
        <div className="fb-card-header">
          <span
            className="fb-card-drag-handle"
            draggable
            onDragStart={this.handleDragStart}
            onDragEnd={this.handleDragEnd}
            title="Drag to reorder"
          >
            ⠿⠿
          </span>
          <span className="fb-card-type-badge">{typeInfo.label || field.type}</span>
          <span className="fb-card-title">
            {field.label || field.content || (field.type === 'separator' ? '— separator —' : 'Untitled')}
          </span>
          <div className="fb-card-actions">
            {field.type !== 'separator' && (
              <button
                type="button"
                className={`fb-icon-btn ${editing ? 'edit-active' : ''}`}
                onClick={this.toggleEdit}
                title={editing ? 'Close editor' : 'Edit field'}
              >
                ✏️
              </button>
            )}
            <button
              type="button"
              className="fb-icon-btn danger"
              onClick={() => onDelete(field.id)}
              title="Remove field"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="fb-card-preview">
          <FieldPreview field={field} />
        </div>

        {/* Inline editor */}
        {editing && (
          <div className="fb-card-edit">
            <FieldEditor field={field} onUpdate={(changes) => onUpdate(field.id, changes)} />
          </div>
        )}
      </div>
    );
  }
}

// ─── JSON Modal ───────────────────────────────────────────────────────────────
class JsonModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { copied: false };
    this.handleCopy = this.handleCopy.bind(this);
  }

  handleCopy() {
    navigator.clipboard.writeText(this.props.json).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    });
  }

  render() {
    const { json, onClose } = this.props;
    const { copied } = this.state;
    return (
      <div className="fb-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="fb-modal">
          <div className="fb-modal-header">
            <div>
              <div className="fb-modal-title">📋 Form JSON</div>
              <div className="fb-modal-subtitle">Copy and store this JSON to reconstruct the form later</div>
            </div>
            <button type="button" className="fb-icon-btn" onClick={onClose} title="Close">✕</button>
          </div>
          <div className="fb-modal-body">
            <pre className="fb-code-block">{json}</pre>
          </div>
          <div className="fb-modal-footer">
            {copied && <span className="fb-copy-success">✅ Copied!</span>}
            <button type="button" className="fb-btn fb-btn-secondary" onClick={onClose}>Close</button>
            <button type="button" className="fb-btn fb-btn-primary" onClick={this.handleCopy}>
              📋 Copy to Clipboard
            </button>
          </div>
        </div>
      </div>
    );
  }
}

// ─── HTML Modal ───────────────────────────────────────────────────────────────
class HtmlModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { copied: false };
    this.handleCopy = this.handleCopy.bind(this);
  }

  handleCopy() {
    navigator.clipboard.writeText(this.props.html).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    });
  }

  render() {
    const { html, onClose } = this.props;
    const { copied } = this.state;
    return (
      <div className="fb-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="fb-modal">
          <div className="fb-modal-header">
            <div>
              <div className="fb-modal-title">🌐 Published HTML</div>
              <div className="fb-modal-subtitle">Embed this self-contained snippet in any website</div>
            </div>
            <button type="button" className="fb-icon-btn" onClick={onClose} title="Close">✕</button>
          </div>
          <div className="fb-modal-body">
            <pre className="fb-code-block">{html}</pre>
          </div>
          <div className="fb-modal-footer">
            {copied && <span className="fb-copy-success">✅ Copied!</span>}
            <button type="button" className="fb-btn fb-btn-secondary" onClick={onClose}>Close</button>
            <button type="button" className="fb-btn fb-btn-primary" onClick={this.handleCopy}>
              📋 Copy to Clipboard
            </button>
          </div>
        </div>
      </div>
    );
  }
}

// ─── Main App ─────────────────────────────────────────────────────────────────
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formTitle: '',
      formDescription: '',
      formType: 'contact',
      fields: [],
      draggingPanelType: null,  // type being dragged from panel
      draggingCardId: null,     // id being dragged from canvas
      canvasDragOver: false,
      jsonModal: null,
      htmlModal: null,
    };

    this.handlePanelDragStart = this.handlePanelDragStart.bind(this);
    this.handlePanelDragEnd = this.handlePanelDragEnd.bind(this);
    this.handleCanvasDragOver = this.handleCanvasDragOver.bind(this);
    this.handleCanvasDragLeave = this.handleCanvasDragLeave.bind(this);
    this.handleCanvasDrop = this.handleCanvasDrop.bind(this);
    this.handleCardDragStart = this.handleCardDragStart.bind(this);
    this.handleCardDragEnd = this.handleCardDragEnd.bind(this);
    this.handleCardDrop = this.handleCardDrop.bind(this);
    this.handleUpdateField = this.handleUpdateField.bind(this);
    this.handleDeleteField = this.handleDeleteField.bind(this);
    this.handleSaveJson = this.handleSaveJson.bind(this);
    this.handlePublishHtml = this.handlePublishHtml.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  // ── Panel drag ──
  handlePanelDragStart(e, type) {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', JSON.stringify({ source: 'panel', type }));
    this.setState({ draggingPanelType: type });
  }

  handlePanelDragEnd() {
    this.setState({ draggingPanelType: null });
  }

  // ── Canvas drop zone ──
  handleCanvasDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    this.setState({ canvasDragOver: true });
  }

  handleCanvasDragLeave(e) {
    // Only fire if leaving the drop-area itself (not a child)
    if (!e.currentTarget.contains(e.relatedTarget)) {
      this.setState({ canvasDragOver: false });
    }
  }

  handleCanvasDrop(e) {
    e.preventDefault();
    this.setState({ canvasDragOver: false });
    const raw = e.dataTransfer.getData('text/plain');
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      if (data.source === 'panel') {
        this.setState((s) => ({ fields: [...s.fields, makeField(data.type)] }));
      }
      // canvas-to-canvas handled by card drop handlers
    } catch (_) {}
  }

  // ── Card drag (reorder) ──
  handleCardDragStart(id) {
    this.setState({ draggingCardId: id });
  }

  handleCardDragEnd() {
    this.setState({ draggingCardId: null });
  }

  handleCardDrop(data, targetId, position) {
    if (data.source === 'panel') {
      // Dropped from panel onto a card — insert relative to target
      const newField = makeField(data.type);
      this.setState((s) => {
        const idx = s.fields.findIndex((f) => f.id === targetId);
        if (idx === -1) return { fields: [...s.fields, newField] };
        const list = [...s.fields];
        list.splice(position === 'top' ? idx : idx + 1, 0, newField);
        return { fields: list };
      });
    } else if (data.source === 'canvas') {
      // Reorder
      const sourceId = data.id;
      if (sourceId === targetId) return;
      this.setState((s) => {
        const list = s.fields.filter((f) => f.id !== sourceId);
        const moved = s.fields.find((f) => f.id === sourceId);
        if (!moved) return {};
        const targetIdx = list.findIndex((f) => f.id === targetId);
        if (targetIdx === -1) return { fields: [...list, moved] };
        list.splice(position === 'top' ? targetIdx : targetIdx + 1, 0, moved);
        return { fields: list };
      });
    }
  }

  // ── Field update / delete ──
  handleUpdateField(id, changes) {
    this.setState((s) => ({
      fields: s.fields.map((f) => (f.id === id ? { ...f, ...changes } : f)),
    }));
  }

  handleDeleteField(id) {
    this.setState((s) => ({ fields: s.fields.filter((f) => f.id !== id) }));
  }

  // ── JSON export ──
  handleSaveJson() {
    const { fields, formTitle, formDescription, formType } = this.state;
    const output = fields.map(({ id, ...rest }) => rest); // omit internal id
    const payload = {
      title: formTitle,
      description: formDescription,
      formType,
      fields: output,
    };
    this.setState({ jsonModal: JSON.stringify(payload, null, 2) });
  }

  // ── HTML export ──
  handlePublishHtml() {
    const { fields, formTitle, formDescription } = this.state;

    const renderFieldHtml = (field) => {
      switch (field.type) {
        case 'text':
          return `
    <div class="field-group">
      <label>${field.label || 'Text Input'}${field.required ? ' <span class="req">*</span>' : ''}</label>
      <input type="text" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''} />
    </div>`;
        case 'email':
          return `
    <div class="field-group">
      <label>${field.label || 'Email'}${field.required ? ' <span class="req">*</span>' : ''}</label>
      <input type="email" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''} />
    </div>`;
        case 'dropdown':
          return `
    <div class="field-group">
      <label>${field.label || 'Dropdown'}</label>
      <select>
        <option value="">— Select —</option>
        ${(field.options || []).map((o) => `<option value="${o}">${o}</option>`).join('\n        ')}
      </select>
    </div>`;
        case 'checkbox':
          return `
    <div class="field-group check-group">
      <label><input type="checkbox" /> ${field.label || 'Checkbox'}</label>
    </div>`;
        case 'radio':
          return `
    <div class="field-group">
      <label>${field.label || 'Radio'}</label>
      ${(field.options || []).map((o) => `<label class="radio-opt"><input type="radio" name="field_${field.type}" value="${o}" /> ${o}</label>`).join('\n      ')}
    </div>`;
        case 'date':
          return `
    <div class="field-group">
      <label>${field.label || 'Date'}${field.required ? ' <span class="req">*</span>' : ''}</label>
      <input type="date" ${field.required ? 'required' : ''} />
    </div>`;
        case 'file':
          return `
    <div class="field-group">
      <label>${field.label || 'File Upload'}</label>
      <input type="file" accept="${field.acceptedTypes || '*'}" />
    </div>`;
        case 'multiselect':
          return `
    <div class="field-group">
      <label>${field.label || 'Multi Select'}</label>
      <select multiple size="4">
        ${(field.options || []).map((o) => `<option value="${o}">${o}</option>`).join('\n        ')}
      </select>
    </div>`;
        case 'separator':
          return `\n    <hr style="border:none;border-top:2px solid #e2e8f0;margin:12px 0;" />`;
        case 'textbox':
          return `\n    <p class="textbox">${field.content || ''}</p>`;
        case 'photobox':
          return field.imageUrl
            ? `\n    <div class="field-group"><img src="${field.imageUrl}" alt="photo" style="max-width:100%;border-radius:6px;border:1px solid #e2e8f0;" /></div>`
            : '';
        default:
          return '';
      }
    };

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${formTitle || 'Form'}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f1f5f9;
      min-height: 100vh;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 40px 16px;
    }
    .form-card {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.1);
      padding: 36px 40px;
      width: 100%;
      max-width: 600px;
    }
    .form-title {
      font-size: 22px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 6px;
    }
    .form-desc {
      font-size: 14px;
      color: #64748b;
      margin-bottom: 28px;
    }
    .field-group {
      margin-bottom: 18px;
    }
    label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 5px;
    }
    .req { color: #ef4444; }
    input[type=text], input[type=email], input[type=date], input[type=file], select, textarea {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
      color: #111827;
      background: #fff;
      outline: none;
      transition: border-color 0.18s;
    }
    input:focus, select:focus, textarea:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
    }
    .check-group label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
    }
    .radio-opt {
      display: flex !important;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 400;
      margin-bottom: 5px;
      cursor: pointer;
    }
    .textbox {
      font-size: 14px;
      color: #374151;
      line-height: 1.7;
      margin-bottom: 18px;
    }
    .form-submit {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 10px;
    }
    button[type=submit] {
      padding: 10px 24px;
      background: #2563eb;
      color: #fff;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: background 0.18s;
    }
    button[type=submit]:hover { background: #1d4ed8; }
    button[type=reset] {
      padding: 10px 24px;
      background: #fff;
      color: #374151;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
    }
  </style>
</head>
<body>
  <div class="form-card">
    ${formTitle ? `<h1 class="form-title">${formTitle}</h1>` : ''}
    ${formDescription ? `<p class="form-desc">${formDescription}</p>` : ''}
    <form novalidate>
      ${fields.map(renderFieldHtml).join('')}
      <div class="form-submit">
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </div>
    </form>
  </div>
</body>
</html>`;

    this.setState({ htmlModal: html });
  }

  closeModal() {
    this.setState({ jsonModal: null, htmlModal: null });
  }

  render() {
    const {
      formTitle, formDescription, formType,
      fields, draggingCardId, canvasDragOver,
      jsonModal, htmlModal,
    } = this.state;

    return (
      <div className="fb-root">
        {/* ── Top bar ── */}
        <header className="fb-topbar">
          <div className="fb-topbar-brand">
            <div className="fb-topbar-brand-icon">⚡</div>
            <span className="fb-topbar-brand-name">Form Builder</span>
          </div>
          <div className="fb-topbar-divider" />
          <input
            className="fb-topbar-input"
            type="text"
            placeholder="Form Title…"
            value={formTitle}
            onChange={(e) => this.setState({ formTitle: e.target.value })}
          />
          <input
            className="fb-topbar-input"
            type="text"
            placeholder="Description (optional)…"
            value={formDescription}
            onChange={(e) => this.setState({ formDescription: e.target.value })}
          />
          <select
            className="fb-topbar-select"
            value={formType}
            onChange={(e) => this.setState({ formType: e.target.value })}
          >
            <option value="contact">Contact Form</option>
            <option value="survey">Survey</option>
            <option value="registration">Registration</option>
            <option value="feedback">Feedback</option>
            <option value="order">Order Form</option>
            <option value="application">Application</option>
            <option value="other">Other</option>
          </select>
        </header>

        {/* ── Main layout ── */}
        <div className="fb-layout">
          {/* ── Left Panel ── */}
          <aside className="fb-panel">
            <div className="fb-panel-header">
              <div className="fb-panel-title">Field Types</div>
              <div className="fb-panel-subtitle">Drag a field onto the canvas →</div>
            </div>
            <div className="fb-panel-list">
              {FIELD_TYPES.map((ft) => (
                <div
                  key={ft.type}
                  className={`fb-field-item ${this.state.draggingPanelType === ft.type ? 'dragging' : ''}`}
                  draggable
                  onDragStart={(e) => this.handlePanelDragStart(e, ft.type)}
                  onDragEnd={this.handlePanelDragEnd}
                >
                  <span className="fb-field-icon">{ft.icon}</span>
                  <span className="fb-field-label">{ft.label}</span>
                  <span className="fb-field-drag-hint">drag</span>
                </div>
              ))}
            </div>
          </aside>

          {/* ── Right Canvas ── */}
          <main className="fb-canvas">
            <div className="fb-canvas-header">
              <span className="fb-canvas-title">Canvas</span>
              <span className="fb-canvas-count">
                {fields.length} field{fields.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="fb-canvas-drop-zone">
              <div
                className={`fb-drop-area ${canvasDragOver ? 'drag-over' : ''}`}
                onDragOver={this.handleCanvasDragOver}
                onDragLeave={this.handleCanvasDragLeave}
                onDrop={this.handleCanvasDrop}
              >
                {fields.length === 0 && (
                  <div className="fb-canvas-empty">
                    <div className="fb-canvas-empty-icon">📋</div>
                    <div className="fb-canvas-empty-title">Drag a field here to start building</div>
                    <div className="fb-canvas-empty-sub">Choose a field type from the left panel and drop it here</div>
                  </div>
                )}

                {fields.map((field) => (
                  <FieldCard
                    key={field.id}
                    field={field}
                    isDragging={draggingCardId === field.id}
                    onDragStart={this.handleCardDragStart}
                    onDragEnd={this.handleCardDragEnd}
                    onDrop={this.handleCardDrop}
                    onUpdate={this.handleUpdateField}
                    onDelete={this.handleDeleteField}
                  />
                ))}
              </div>
            </div>
          </main>
        </div>

        {/* ── Bottom bar ── */}
        <footer className="fb-bottom-bar">
          <span className="fb-field-count-info">
            {fields.length === 0
              ? 'No fields yet — drag some from the left panel'
              : `${fields.length} field${fields.length !== 1 ? 's' : ''} in form`}
          </span>
          <button
            type="button"
            className="fb-btn fb-btn-secondary"
            onClick={this.handleSaveJson}
            disabled={fields.length === 0}
          >
            💾 Save as JSON
          </button>
          <button
            type="button"
            className="fb-btn fb-btn-primary"
            onClick={this.handlePublishHtml}
            disabled={fields.length === 0}
          >
            🌐 Publish as HTML
          </button>
        </footer>

        {/* ── Modals ── */}
        {jsonModal && <JsonModal json={jsonModal} onClose={this.closeModal} />}
        {htmlModal && <HtmlModal html={htmlModal} onClose={this.closeModal} />}
      </div>
    );
  }
}

export default App;
