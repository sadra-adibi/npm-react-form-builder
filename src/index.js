/**
 * npm-react-form-builder
 * ──────────────────────────────────────────────────────────────
 * A React form builder library using class-style components.
 *
 * Usage:
 *   import { FormBuilder, InputField, SelectorField, ImageUploadField } from "npm-react-form-builder";
 *   import "npm-react-form-builder/style.css";
 *
 * Components:
 *   • FormBuilder       — Orchestrates all field types from a `fields` config array
 *   • InputField        — Text / textarea input
 *   • SelectorField     — Dropdown selector
 *   • ImageUploadField  — Drag-and-drop image upload with preview
 * ──────────────────────────────────────────────────────────────
 */

// Import the CSS so it gets bundled into dist/style.css by Vite
import "./styles/form-builder.css";

// ── Named exports ──────────────────────────────────────────────
export { default as FormBuilder }      from "./components/FormBuilder";
export { default as InputField }       from "./components/InputField";
export { default as SelectorField }    from "./components/SelectorField";
export { default as ImageUploadField } from "./components/ImageUploadField";
