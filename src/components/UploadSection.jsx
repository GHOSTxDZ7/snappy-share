
import { useState } from "react";
import FileUpload from "./FileUpload";         // Component for selecting/dropping files
import UploadResult from "./UploadResult";     // Component to show upload success/failure
import { uploadFile } from "../services/fileService"; // ✅ File upload service function (uploads to Supabase)
import "../components_css/UploadSection.css";

function UploadSection() {
  // 💾 Stores upload result (success or failure info)
  const [uploadResult, setUploadResult] = useState(null);

  // 🔄 Tracks if upload is currently in progress
  const [isUploading, setIsUploading] = useState(false);

  // 🔼 Handles the file once it's dropped or selected
  const handleFileUpload = async (file) => {
    setIsUploading(true);     // Start showing loading UI
    setUploadResult(null);    // Clear previous result

    try {
      // 📡 Upload the file to Supabase and save result
      const result = await uploadFile(file);
      setUploadResult(result);
    } catch (error) {
      // ❌ If upload fails, log it and update result
      console.error("Upload error:", error);
      setUploadResult({
        success: false,
        message: "Upload failed. Please try again.",
      });
    } finally {
      setIsUploading(false); // Stop loading spinner
    }
  };

  // 🔁 Allow user to reset and try uploading again
  const handleReset = () => {
    setUploadResult(null);
  };

  return (
    <div className="card">
      {/* 📦 Upload Card Header */}
      <div className="card-header">
        <div className="card-title">
          {/* Upload Icon */}
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

        {/* Description below title */}
        <div className="card-description">
          Upload any file up to 50MB. You'll receive a 4-digit code to share.
        </div>
      </div>

      {/* 📤 Upload area or result section */}
      <div className="card-content">
        {/* Show upload UI if no successful result yet */}
        {!uploadResult?.success && (
          <FileUpload onFileUpload={handleFileUpload} isUploading={isUploading} />
        )}

        {/* Show result once upload attempt is complete */}
        {uploadResult && (
          <UploadResult result={uploadResult} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}

export default UploadSection;
