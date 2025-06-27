import { useState } from "react";
import FileUpload from "./FileUpload";         // 🔄 Component for selecting/dropping files
import UploadResult from "./UploadResult";     // ✅ Component to show upload success/failure
import { uploadFile } from "../services/fileService"; // 📡 Function to handle Supabase upload

function UploadSection() {
  const [uploadResult, setUploadResult] = useState(null); // 💾 Store upload response result
  const [isUploading, setIsUploading] = useState(false);  // 🔄 Track if upload is in progress

  // 🔼 Triggered when user selects or drops a file
  const handleFileUpload = async (file) => {
    setIsUploading(true);     // Show loading indicator
    setUploadResult(null);    // Clear previous result

    try {
      const result = await uploadFile(file); // Upload to Supabase
      setUploadResult(result);               // Save response (success or error)
    } catch (error) {
      console.error("Upload error:", error);
      setUploadResult({
        success: false,
        message: "Upload failed. Please try again.",
      });
    } finally {
      setIsUploading(false); // Reset uploading state
    }
  };

  // 🔁 Allow re-upload by resetting result
  const handleReset = () => {
    setUploadResult(null);
  };

  return (
    <div className="card">
      {/* 📦 Card Header */}
      <div className="card-header">
        <div className="card-title">
          {/* Upload icon */}
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          Upload Your File
        </div>
        <div className="card-description">
          Upload any file up to 50MB. You'll receive a 4-digit code to share.
        </div>
      </div>

      {/* 📤 File Upload or Result UI */}
      <div className="card-content">
        {/* ✅ Show upload area only if not uploaded yet */}
        {!uploadResult?.success && (
          <FileUpload onFileUpload={handleFileUpload} isUploading={isUploading} />
        )}
        {/* ✅ Show upload result once available */}
        {uploadResult && (
          <UploadResult result={uploadResult} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}

export default UploadSection;
