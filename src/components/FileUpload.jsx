import { useState, useRef } from "react";

// ✅ Component to handle file upload via drag-and-drop or manual selection
function FileUpload({ onFileUpload, isUploading }) {
  const [dragActive, setDragActive] = useState(false); // State to toggle drag style
  const fileInputRef = useRef(null); // Ref for hidden file input

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

  // ✅ Handles drag events to highlight drop area
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // ✅ Handles file dropped into the area
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndUpload(file);
    }
  };

  // ✅ Handles file selected manually from the file picker
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndUpload(file);
    }
  };

  // ✅ Validates file size and invokes the upload callback
  const validateAndUpload = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      alert("❌ File size exceeds 50MB limit.");
      return;
    }

    // Proceed with uploading since file size is valid
    onFileUpload(file);
  };

  // ✅ If uploading, show progress indicator
  if (isUploading) {
    return (
      <div>
        <div className="progress">
          <div className="progress-bar" />
        </div>
        <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#6b7280" }}>
          Uploading...
        </p>
      </div>
    );
  }

  // ✅ Default UI: drag-and-drop or click-to-select
  return (
    <div
      className={`file-upload ${dragActive ? "drag-active" : ""}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()} // Open file picker on click
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
    >
      <svg className="file-upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3>Drop your file here or click to browse</h3>
      <p>Supports all file types • Max 100MB</p>
      <button className="button button-primary" disabled={isUploading}>
        Choose File
      </button>
      {/* ✅ Hidden file input used by the Choose File button and click area */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="file-input"
        style={{ display: "none" }}
      />
    </div>
  );
}

export default FileUpload;
