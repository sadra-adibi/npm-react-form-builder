import { Component, createRef } from "react";

/**
 * ImageUploadField — Class-based React component
 *
 * Renders a styled image upload zone with:
 *  • Click-to-browse file selection
 *  • Drag-and-drop support
 *  • Live image preview (object URL)
 *  • File name + size badge
 *  • Remove / Change buttons on hover over the preview
 *  • File type and size validation
 *
 * Props:
 * ─────────────────────────────────────────────
 * @prop {string}   label         — Field label text
 * @prop {Function} onChange      — Callback: (file: File | null, name: string) => void
 * @prop {string}   name          — Field name identifier
 * @prop {boolean}  required      — Shows a red asterisk next to the label
 * @prop {string}   hint          — Helper text below the dropzone
 * @prop {string[]} accept        — Accepted MIME types (default: common image types)
 * @prop {number}   maxSizeMB     — Maximum file size in MB (default: 10)
 */
class ImageUploadField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Object URL for the live preview — revoked on unmount / change
      previewUrl: null,
      // The actual File object
      file: null,
      // Whether the user is dragging a file over the dropzone
      isDragOver: false,
      // Validation error message
      error: null,
    };

    // Refs
    this.fileInputRef = createRef();        // the hidden <input type="file">
    this.changeInputRef = createRef();      // the hidden <input> inside the preview overlay

    // Bind handlers
    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.handleDragOver   = this.handleDragOver.bind(this);
    this.handleDragLeave  = this.handleDragLeave.bind(this);
    this.handleDrop       = this.handleDrop.bind(this);
    this.handleRemove     = this.handleRemove.bind(this);
    this.handleChangeClick = this.handleChangeClick.bind(this);
  }

  // ── Lifecycle ────────────────────────────────────────────────────────────

  componentWillUnmount() {
    // Always revoke object URLs to avoid memory leaks
    if (this.state.previewUrl) {
      URL.revokeObjectURL(this.state.previewUrl);
    }
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  /**
   * Formats a byte count into a human-readable string (e.g. "1.4 MB").
   */
  formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  /**
   * Validates a File object against the accept list and maxSizeMB.
   * Returns an error string or null if valid.
   */
  validateFile(file) {
    const {
      accept = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
      maxSizeMB = 10,
    } = this.props;

    if (!accept.some((type) => file.type === type || file.type.startsWith(type.replace("*", "")))) {
      return `Unsupported file type "${file.type}". Accepted: ${accept.join(", ")}`;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File is too large (${this.formatFileSize(file.size)}). Max size: ${maxSizeMB} MB.`;
    }
    return null;
  }

  /**
   * Central method that processes a validated File:
   *  1. Revokes any previous object URL
   *  2. Creates a new object URL for the preview
   *  3. Updates state
   *  4. Fires the parent's onChange callback
   */
  processFile(file) {
    const { name = "", onChange } = this.props;

    // Validate
    const error = this.validateFile(file);
    if (error) {
      this.setState({ error });
      return;
    }

    // Revoke old URL
    if (this.state.previewUrl) {
      URL.revokeObjectURL(this.state.previewUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    this.setState({ file, previewUrl, error: null });

    if (typeof onChange === "function") {
      onChange(file, name);
    }
  }

  // ── Event Handlers ───────────────────────────────────────────────────────

  /** Fired when the user picks a file via the native dialog */
  handleFileSelect(event) {
    const file = event.target.files?.[0];
    if (file) this.processFile(file);
    // Reset the input so the same file can be re-selected after removal
    event.target.value = "";
  }

  handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ isDragOver: true });
  }

  handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ isDragOver: false });
  }

  handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ isDragOver: false });

    const file = event.dataTransfer.files?.[0];
    if (file) this.processFile(file);
  }

  /** Removes the current image and notifies the parent */
  handleRemove() {
    const { name = "", onChange } = this.props;

    if (this.state.previewUrl) {
      URL.revokeObjectURL(this.state.previewUrl);
    }

    this.setState({ file: null, previewUrl: null, error: null });

    if (typeof onChange === "function") {
      onChange(null, name);
    }
  }

  /** Programmatically clicks the hidden file input in the preview overlay */
  handleChangeClick() {
    this.changeInputRef.current?.click();
  }

  // ── Render ───────────────────────────────────────────────────────────────

  render() {
    const {
      label,
      name = "",
      required = false,
      hint,
      accept = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
    } = this.props;

    const { previewUrl, file, isDragOver, error } = this.state;
    const acceptAttr = accept.join(",");
    const hasImage = Boolean(previewUrl);

    return (
      <div className="fb-field">
        {/* ── Label ── */}
        {label && (
          <label className="fb-label">
            {label}
            {required && <span className="fb-required">*</span>}
          </label>
        )}

        {/* ── Preview or Drop Zone ── */}
        {hasImage ? (
          /* ── Image Preview with overlay controls ── */
          <div className="fb-image-preview-wrapper">
            <img
              src={previewUrl}
              alt="Uploaded preview"
              className="fb-image-preview"
            />

            {/* Hover overlay with action buttons */}
            <div className="fb-preview-overlay">
              {/* Change button — triggers a hidden file input */}
              <button
                type="button"
                className="fb-preview-btn fb-btn-change"
                onClick={this.handleChangeClick}
                title="Choose a different image"
              >
                {/* Pencil icon */}
                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Change
              </button>

              {/* Hidden input for the "Change" action */}
              <input
                ref={this.changeInputRef}
                type="file"
                accept={acceptAttr}
                onChange={this.handleFileSelect}
                className="fb-image-input"
                aria-hidden="true"
                tabIndex={-1}
              />

              {/* Remove button */}
              <button
                type="button"
                className="fb-preview-btn fb-btn-remove"
                onClick={this.handleRemove}
                title="Remove image"
              >
                {/* Trash icon */}
                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Remove
              </button>
            </div>
          </div>
        ) : (
          /* ── Drop Zone ── */
          <div
            className={`fb-image-dropzone${isDragOver ? " fb-drag-over" : ""}`}
            onDragOver={this.handleDragOver}
            onDragLeave={this.handleDragLeave}
            onDrop={this.handleDrop}
            role="button"
            tabIndex={0}
            aria-label="Click or drag to upload an image"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                this.fileInputRef.current?.click();
              }
            }}
          >
            {/* Hidden file input covers the entire dropzone */}
            <input
              ref={this.fileInputRef}
              id={`fb-image-${name}`}
              type="file"
              accept={acceptAttr}
              onChange={this.handleFileSelect}
              className="fb-image-input"
              required={required && !hasImage}
              aria-describedby={hint ? `fb-hint-${name}` : undefined}
            />

            {/* Upload icon */}
            <svg
              className="fb-upload-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 15v4a2 2 0 002 2h14a2 2 0 002-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>

            <p className="fb-upload-title">
              {isDragOver ? "Drop it here!" : "Drag & drop an image"}
            </p>
            <p className="fb-upload-subtitle">or</p>

            <span className="fb-upload-btn">
              {/* Folder icon */}
              <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              </svg>
              Browse files
            </span>

            <p className="fb-upload-subtitle">
              Accepts: {accept.map((t) => t.split("/")[1].toUpperCase()).join(", ")}
            </p>
          </div>
        )}

        {/* ── File info badge (shown after a file is selected) ── */}
        {file && (
          <div className="fb-file-info">
            {/* Document icon */}
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
            <span className="fb-file-info-name">{file.name}</span>
            <span className="fb-file-info-size">{this.formatFileSize(file.size)}</span>
          </div>
        )}

        {/* ── Validation error ── */}
        {error && (
          <span className="fb-hint" style={{ color: "var(--fb-color-error)" }}>
            ⚠ {error}
          </span>
        )}

        {/* ── Hint text ── */}
        {hint && !error && (
          <span id={`fb-hint-${name}`} className="fb-hint">
            {hint}
          </span>
        )}
      </div>
    );
  }
}

export default ImageUploadField;
