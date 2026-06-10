import React from 'react';

/**
 * ImageUploadField — npm-react-form-builder
 * An image upload field with drag-and-drop, live preview, and remove button.
 * Uses HTML5 drag and drop API only.
 *
 * Props:
 *   label    {string}   — field label
 *   onChange {function} — called with the File object when image is selected
 */
class ImageUploadField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      preview: null,
      fileName: null,
      dragging: false,
    };
    this.fileInputRef = React.createRef();
    this.handleDragEnter = this.handleDragEnter.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  processFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.setState({ preview: e.target.result, fileName: file.name });
    };
    reader.readAsDataURL(file);
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(file);
    }
  }

  handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ dragging: true });
  }

  handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ dragging: false });
  }

  handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ dragging: false });
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) this.processFile(file);
  }

  handleFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (file) this.processFile(file);
  }

  handleRemove(e) {
    e.stopPropagation();
    this.setState({ preview: null, fileName: null });
    if (this.fileInputRef.current) this.fileInputRef.current.value = '';
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(null);
    }
  }

  handleClick() {
    if (this.fileInputRef.current) this.fileInputRef.current.click();
  }

  render() {
    const { label } = this.props;
    const { preview, fileName, dragging } = this.state;

    return (
      <div className="nrfb-field">
        {label && <label className="nrfb-label">{label}</label>}

        {!preview && (
          <div
            className={`nrfb-upload-zone ${dragging ? 'drag-active' : ''}`}
            onClick={this.handleClick}
            onDragEnter={this.handleDragEnter}
            onDragLeave={this.handleDragLeave}
            onDragOver={this.handleDragOver}
            onDrop={this.handleDrop}
          >
            <div style={{ fontSize: '28px', marginBottom: '6px' }}>🖼️</div>
            <div className="nrfb-upload-zone-text">
              {dragging ? 'Drop image here' : 'Click or drag an image here'}
            </div>
            <div className="nrfb-upload-zone-sub">PNG, JPG, GIF, WEBP supported</div>
          </div>
        )}

        {preview && (
          <div className="nrfb-preview-wrap">
            <img src={preview} alt={fileName || 'preview'} className="nrfb-preview-img" />
            <button
              type="button"
              className="nrfb-remove-btn"
              onClick={this.handleRemove}
              title="Remove image"
            >
              ✕
            </button>
            {fileName && (
              <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                {fileName}
              </div>
            )}
          </div>
        )}

        <input
          ref={this.fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={this.handleFileChange}
        />
      </div>
    );
  }
}

export default ImageUploadField;
