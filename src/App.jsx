import { Component } from "react";

// Import library components and styles directly from source
// (in a real consumer project this would be: from "npm-react-form-builder")
import { FormBuilder, InputField, SelectorField, ImageUploadField } from "./index.js";

// ─────────────────────────────────────────────────────────────────────────────
// Demo App — showcases every feature of npm-react-form-builder
// ─────────────────────────────────────────────────────────────────────────────

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // FormBuilder submission result
      submittedValues: null,
      // Individual component demo values
      inputValue: "",
      selectorValue: "",
      imageFile: null,
      // Active tab in the demo
      activeTab: "formbuilder",
    };

    this.handleFormSubmit  = this.handleFormSubmit.bind(this);
    this.handleFormReset   = this.handleFormReset.bind(this);
    this.handleTabChange   = this.handleTabChange.bind(this);
  }

  handleFormSubmit(values) {
    this.setState({ submittedValues: values });
  }

  handleFormReset() {
    this.setState({ submittedValues: null });
  }

  handleTabChange(tab) {
    this.setState({ activeTab: tab });
  }

  render() {
    const { submittedValues, activeTab } = this.state;

    // ── FormBuilder field definitions ──────────────────────────────────────
    const fields = [
      {
        type: "input",
        name: "fullName",
        label: "Full Name",
        placeholder: "e.g. Jane Doe",
        required: true,
        hint: "Enter your first and last name.",
      },
      {
        type: "input",
        name: "email",
        label: "Email Address",
        placeholder: "you@example.com",
        inputType: "email",
        required: true,
      },
      {
        type: "input",
        name: "bio",
        label: "Short Bio",
        placeholder: "Tell us a little about yourself…",
        inputType: "textarea",
        hint: "Max 200 characters.",
      },
      {
        type: "selector",
        name: "country",
        label: "Country",
        placeholder: "Select your country…",
        required: true,
        options: [
          { label: "🇺🇸 United States", value: "us" },
          { label: "🇬🇧 United Kingdom", value: "gb" },
          { label: "🇩🇪 Germany",        value: "de" },
          { label: "🇫🇷 France",         value: "fr" },
          { label: "🇯🇵 Japan",          value: "jp" },
          { label: "🇧🇷 Brazil",         value: "br" },
          { label: "🇦🇺 Australia",      value: "au" },
          { label: "🇨🇦 Canada",         value: "ca" },
        ],
        hint: "We'll use this for regional settings.",
      },
      {
        type: "selector",
        name: "role",
        label: "Role",
        placeholder: "Pick your role…",
        options: ["Frontend Developer", "Backend Developer", "Designer", "Product Manager", "DevOps Engineer", "Other"],
      },
      {
        type: "image",
        name: "avatar",
        label: "Profile Picture",
        hint: "Accepted: JPG, PNG, GIF, WEBP. Max 5 MB.",
        maxSizeMB: 5,
      },
    ];

    const tabs = [
      { key: "formbuilder", label: "FormBuilder" },
      { key: "inputfield",  label: "InputField" },
      { key: "selector",    label: "SelectorField" },
      { key: "image",       label: "ImageUploadField" },
    ];

    return (
      <div style={styles.page}>
        {/* ── Page Header ── */}
        <header style={styles.header}>
          <div style={styles.headerInner}>
            <div style={styles.headerBadge}>
              <span style={styles.npm}>npm</span> package
            </div>
            <h1 style={styles.headerTitle}>npm-react-form-builder</h1>
            <p style={styles.headerSubtitle}>
              A React form builder library with class-based components.
              Drop in ready-to-use <code style={styles.code}>InputField</code>,{" "}
              <code style={styles.code}>SelectorField</code>, and{" "}
              <code style={styles.code}>ImageUploadField</code> — or let{" "}
              <code style={styles.code}>FormBuilder</code> orchestrate them all
              from a single config array.
            </p>
            <div style={styles.installBox}>
              <span style={styles.installCmd}>
                npm install npm-react-form-builder
              </span>
            </div>
          </div>
        </header>

        <main style={styles.main}>
          {/* ── Tabs ── */}
          <div style={styles.tabBar}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                style={{
                  ...styles.tab,
                  ...(activeTab === tab.key ? styles.tabActive : {}),
                }}
                onClick={() => this.handleTabChange(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ══════════════════════════════════════════════
              TAB 1 — FormBuilder demo
          ══════════════════════════════════════════════ */}
          {activeTab === "formbuilder" && (
            <div style={styles.demoGrid}>
              {/* Left: the form itself */}
              <div style={styles.demoPanel}>
                <SectionLabel
                  title="FormBuilder Component"
                  description="Declaratively compose any form from a simple fields[] config array. FormBuilder manages state internally and calls onSubmit with all values."
                />
                <FormBuilder
                  title="Create Your Profile"
                  description="Fill in the form below — all fields are managed by FormBuilder."
                  fields={fields}
                  onSubmit={this.handleFormSubmit}
                  onReset={this.handleFormReset}
                  submitLabel="Save Profile"
                  resetLabel="Clear"
                />
              </div>

              {/* Right: submission output */}
              <div style={styles.demoPanel}>
                <SectionLabel
                  title="onSubmit Output"
                  description="The values object passed to your onSubmit callback after clicking 'Save Profile'."
                />
                <div style={styles.outputBox}>
                  {submittedValues ? (
                    <>
                      <div style={styles.outputBadge}>✅ Form submitted</div>
                      <pre style={styles.pre}>
                        {JSON.stringify(
                          Object.fromEntries(
                            Object.entries(submittedValues).map(([k, v]) => [
                              k,
                              v instanceof File
                                ? `[File] ${v.name} (${(v.size / 1024).toFixed(1)} KB)`
                                : v,
                            ])
                          ),
                          null,
                          2
                        )}
                      </pre>
                    </>
                  ) : (
                    <div style={styles.outputEmpty}>
                      <span style={styles.outputEmptyIcon}>📋</span>
                      <p style={styles.outputEmptyText}>
                        Fill in the form and click <strong>Save Profile</strong> to see the output here.
                      </p>
                    </div>
                  )}
                </div>

                {/* Usage snippet */}
                <SectionLabel
                  title="Usage Snippet"
                  description="Paste this into your project to get started instantly."
                />
                <div style={styles.codeBlock}>
                  <pre style={styles.codeBlockPre}>{`import { FormBuilder } from "npm-react-form-builder";
import "npm-react-form-builder/style.css";

const fields = [
  { type: "input",    name: "name",    label: "Name" },
  { type: "selector", name: "role",    label: "Role",
    options: ["Dev", "Designer"] },
  { type: "image",    name: "avatar",  label: "Avatar" },
];

<FormBuilder
  title="My Form"
  fields={fields}
  onSubmit={(values) => console.log(values)}
/>`}</pre>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════
              TAB 2 — InputField demo
          ══════════════════════════════════════════════ */}
          {activeTab === "inputfield" && (
            <div style={styles.demoGrid}>
              <div style={styles.demoPanel}>
                <SectionLabel
                  title="InputField Component"
                  description="A text input that works in both controlled and uncontrolled mode. Supports all HTML input types plus a multiline textarea variant."
                />
                <InputField
                  name="demo_text"
                  label="Plain Text Input"
                  placeholder="Type something…"
                  hint="This is a standard text input."
                  onChange={(val) => this.setState({ inputValue: val })}
                />
                <InputField
                  name="demo_email"
                  label="Email Input"
                  placeholder="you@example.com"
                  inputType="email"
                  required
                />
                <InputField
                  name="demo_number"
                  label="Number Input"
                  placeholder="42"
                  type="number"
                />
                <InputField
                  name="demo_textarea"
                  label="Textarea (multiline)"
                  placeholder="Write a longer text here…"
                  type="textarea"
                  hint='Pass type="textarea" to render a resizable multiline input.'
                />
                <InputField
                  name="demo_disabled"
                  label="Disabled Input"
                  placeholder="Can't edit this"
                  value="Read-only value"
                  disabled
                />
              </div>
              <div style={styles.demoPanel}>
                <SectionLabel title="Live Value" description="Updates on every keystroke." />
                <div style={styles.outputBox}>
                  <div style={styles.outputBadge}>Current value</div>
                  <pre style={styles.pre}>"{this.state.inputValue}"</pre>
                </div>
                <SectionLabel title="Component API" />
                <PropTable rows={[
                  ["label",       "string",   "–",       "Label text above the input"],
                  ["placeholder", "string",   "\"\"",    "Placeholder inside the input"],
                  ["type",        "string",   "\"text\"","HTML type or \"textarea\""],
                  ["value",       "string",   "–",       "Controlled value"],
                  ["name",        "string",   "–",       "Field identifier"],
                  ["onChange",    "function", "–",       "(value, name) => void"],
                  ["required",    "boolean",  "false",   "Shows asterisk, sets required"],
                  ["disabled",    "boolean",  "false",   "Disables the input"],
                  ["hint",        "string",   "–",       "Helper text below field"],
                ]} />
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════
              TAB 3 — SelectorField demo
          ══════════════════════════════════════════════ */}
          {activeTab === "selector" && (
            <div style={styles.demoGrid}>
              <div style={styles.demoPanel}>
                <SectionLabel
                  title="SelectorField Component"
                  description="A styled dropdown that accepts options as plain strings or { label, value } objects. Works in controlled and uncontrolled mode."
                />
                <SelectorField
                  name="demo_strings"
                  label="Simple string options"
                  options={["Apple", "Banana", "Cherry", "Date", "Elderberry"]}
                  hint="Options can be plain strings."
                  onChange={(val) => this.setState({ selectorValue: val })}
                />
                <SelectorField
                  name="demo_objects"
                  label="Object options { label, value }"
                  options={[
                    { label: "🇺🇸 United States", value: "us" },
                    { label: "🇬🇧 United Kingdom", value: "gb" },
                    { label: "🇩🇪 Germany",        value: "de" },
                    { label: "🇫🇷 France",         value: "fr" },
                  ]}
                  placeholder="Select a country…"
                  hint='Options support { label: "Display", value: "code" } shape.'
                />
                <SelectorField
                  name="demo_required"
                  label="Required selector"
                  options={["Option A", "Option B", "Option C"]}
                  required
                />
                <SelectorField
                  name="demo_disabled"
                  label="Disabled selector"
                  options={["Locked"]}
                  value="Locked"
                  disabled
                />
              </div>
              <div style={styles.demoPanel}>
                <SectionLabel title="Live Value" description="Changes on selection." />
                <div style={styles.outputBox}>
                  <div style={styles.outputBadge}>Selected value</div>
                  <pre style={styles.pre}>"{this.state.selectorValue}"</pre>
                </div>
                <SectionLabel title="Component API" />
                <PropTable rows={[
                  ["label",       "string",   "–",                "Label text"],
                  ["options",     "Array",    "[]",               "string[] or {label,value}[]"],
                  ["value",       "string",   "–",                "Controlled value"],
                  ["placeholder", "string",   "\"Select…\"",      "Empty option label"],
                  ["name",        "string",   "–",                "Field identifier"],
                  ["onChange",    "function", "–",                "(value, name) => void"],
                  ["required",    "boolean",  "false",            "Marks field as required"],
                  ["disabled",    "boolean",  "false",            "Disables the select"],
                  ["hint",        "string",   "–",                "Helper text"],
                ]} />
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════
              TAB 4 — ImageUploadField demo
          ══════════════════════════════════════════════ */}
          {activeTab === "image" && (
            <div style={styles.demoGrid}>
              <div style={styles.demoPanel}>
                <SectionLabel
                  title="ImageUploadField Component"
                  description="Drag-and-drop image upload with live preview, validation, and Change / Remove controls."
                />
                <ImageUploadField
                  name="demo_image"
                  label="Upload an Image"
                  hint="Drag & drop or click to browse. Accepts JPG, PNG, GIF, WEBP. Max 5 MB."
                  maxSizeMB={5}
                  onChange={(file) => this.setState({ imageFile: file })}
                />
              </div>
              <div style={styles.demoPanel}>
                <SectionLabel title="File Callback Value" description="The File object passed to onChange." />
                <div style={styles.outputBox}>
                  {this.state.imageFile ? (
                    <>
                      <div style={styles.outputBadge}>📎 File selected</div>
                      <pre style={styles.pre}>{JSON.stringify({
                        name: this.state.imageFile.name,
                        type: this.state.imageFile.type,
                        size: `${(this.state.imageFile.size / 1024).toFixed(1)} KB`,
                        lastModified: new Date(this.state.imageFile.lastModified).toLocaleString(),
                      }, null, 2)}</pre>
                    </>
                  ) : (
                    <div style={styles.outputEmpty}>
                      <span style={styles.outputEmptyIcon}>🖼️</span>
                      <p style={styles.outputEmptyText}>No image selected yet.</p>
                    </div>
                  )}
                </div>
                <SectionLabel title="Component API" />
                <PropTable rows={[
                  ["label",     "string",   "–",      "Label text"],
                  ["name",      "string",   "–",      "Field identifier"],
                  ["onChange",  "function", "–",      "(file: File|null, name) => void"],
                  ["accept",    "string[]", "img/*",  "Accepted MIME types array"],
                  ["maxSizeMB", "number",  "10",      "Max file size in MB"],
                  ["required",  "boolean", "false",   "Marks field as required"],
                  ["hint",      "string",  "–",       "Helper text below field"],
                ]} />
              </div>
            </div>
          )}
        </main>

        {/* ── Footer ── */}
        <footer style={styles.footer}>
          <p style={styles.footerText}>
            <strong>npm-react-form-builder</strong> — MIT License · Built with React class components · Bundled with Vite
          </p>
        </footer>
      </div>
    );
  }
}

// ── Small helper components ────────────────────────────────────────────────

function SectionLabel({ title, description }) {
  return (
    <div style={styles.sectionLabel}>
      {title && <h3 style={styles.sectionTitle}>{title}</h3>}
      {description && <p style={styles.sectionDesc}>{description}</p>}
    </div>
  );
}

function PropTable({ rows }) {
  return (
    <div style={styles.propTableWrap}>
      <table style={styles.propTable}>
        <thead>
          <tr>
            {["Prop", "Type", "Default", "Description"].map((h) => (
              <th key={h} style={styles.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([prop, type, def, desc], i) => (
            <tr key={prop} style={{ background: i % 2 === 0 ? "#fff" : "#f9fafb" }}>
              <td style={{ ...styles.td, fontFamily: "monospace", color: "#4f46e5", fontWeight: 600 }}>{prop}</td>
              <td style={{ ...styles.td, fontFamily: "monospace", color: "#059669" }}>{type}</td>
              <td style={{ ...styles.td, fontFamily: "monospace", color: "#6b7280" }}>{def}</td>
              <td style={styles.td}>{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Inline styles for the demo shell ──────────────────────────────────────

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0f0ff 0%, #fafafa 50%, #f0fff4 100%)",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: "#111827",
  },
  header: {
    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    color: "white",
    padding: "48px 24px 40px",
  },
  headerInner: {
    maxWidth: 960,
    margin: "0 auto",
  },
  headerBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: 999,
    padding: "4px 12px",
    fontSize: "0.78rem",
    fontWeight: 600,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    marginBottom: 16,
  },
  npm: {
    background: "#cc3534",
    color: "white",
    borderRadius: 4,
    padding: "1px 6px",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.02em",
  },
  headerTitle: {
    fontSize: "clamp(1.6rem, 4vw, 2.5rem)",
    fontWeight: 800,
    margin: "0 0 12px",
    letterSpacing: "-0.02em",
  },
  headerSubtitle: {
    fontSize: "1rem",
    opacity: 0.88,
    margin: "0 0 24px",
    lineHeight: 1.6,
    maxWidth: 680,
  },
  code: {
    background: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    padding: "1px 6px",
    fontFamily: "monospace",
    fontSize: "0.9em",
  },
  installBox: {
    display: "inline-block",
    background: "rgba(0,0,0,0.25)",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: 8,
    padding: "10px 18px",
  },
  installCmd: {
    fontFamily: "monospace",
    fontSize: "0.95rem",
    letterSpacing: "0.01em",
  },
  main: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "32px 24px 48px",
  },
  tabBar: {
    display: "flex",
    gap: 4,
    marginBottom: 28,
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: 4,
    boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
    flexWrap: "wrap",
  },
  tab: {
    flex: 1,
    minWidth: 120,
    padding: "8px 16px",
    fontSize: "0.875rem",
    fontWeight: 500,
    border: "none",
    borderRadius: 7,
    cursor: "pointer",
    background: "transparent",
    color: "#6b7280",
    transition: "all 150ms ease",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  tabActive: {
    background: "#4f46e5",
    color: "white",
    fontWeight: 600,
    boxShadow: "0 1px 4px rgba(79,70,229,0.35)",
  },
  demoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: 24,
    alignItems: "start",
  },
  demoPanel: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  sectionLabel: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#111827",
    margin: "0 0 4px",
  },
  sectionDesc: {
    fontSize: "0.84rem",
    color: "#6b7280",
    margin: 0,
    lineHeight: 1.55,
  },
  outputBox: {
    background: "#1e1e2e",
    borderRadius: 10,
    padding: 16,
    minHeight: 120,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  outputBadge: {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#a3e635",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  pre: {
    margin: 0,
    fontSize: "0.82rem",
    fontFamily: "monospace",
    color: "#c9d1d9",
    whiteSpace: "pre-wrap",
    wordBreak: "break-all",
    lineHeight: 1.6,
  },
  outputEmpty: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "16px 0",
  },
  outputEmptyIcon: {
    fontSize: "2rem",
  },
  outputEmptyText: {
    margin: 0,
    fontSize: "0.83rem",
    color: "#6b7280",
    textAlign: "center",
  },
  codeBlock: {
    background: "#1e1e2e",
    borderRadius: 10,
    padding: "16px",
    overflow: "auto",
  },
  codeBlockPre: {
    margin: 0,
    fontSize: "0.8rem",
    fontFamily: "monospace",
    color: "#c9d1d9",
    whiteSpace: "pre",
    lineHeight: 1.65,
  },
  propTableWrap: {
    overflowX: "auto",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  },
  propTable: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.8rem",
  },
  th: {
    padding: "8px 12px",
    textAlign: "left",
    fontWeight: 600,
    color: "#374151",
    background: "#f3f4f6",
    borderBottom: "1px solid #e5e7eb",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "7px 12px",
    color: "#374151",
    borderBottom: "1px solid #e5e7eb",
    verticalAlign: "top",
    lineHeight: 1.5,
  },
  footer: {
    borderTop: "1px solid #e5e7eb",
    padding: "20px 24px",
    textAlign: "center",
    background: "white",
  },
  footerText: {
    margin: 0,
    fontSize: "0.82rem",
    color: "#9ca3af",
  },
};

export default App;
