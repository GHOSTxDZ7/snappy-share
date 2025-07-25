import { useState } from "react";
import { uploadText } from "../services/clipboardService"; // 📡 Function to upload text to Supabase
import UploadResult from "./UploadResult"; // ✅ Component to show upload success/failure
import "../components_css/TextShareSection.css";

function TextShareSection() {
  // 🔐 Local state to manage text input, upload result, and loading status
  const [text, setText] = useState(""); // 📝 Stores the entered text
  const [uploadResult, setUploadResult] = useState(null); // 📦 Holds upload response (success/error)
  const [isUploading, setIsUploading] = useState(false); // 🔄 Shows loading state during upload

  // 📤 Uploads text to Supabase clipboard service
  const handleUpload = async () => {
    setIsUploading(true); // Show loading spinner or disable button
    const result = await uploadText(text); // Call API to upload text
    setUploadResult(result); // Store upload result
    setIsUploading(false); // Reset loading state
  };

  // 🔁 Resets state to allow new upload
  const handleReset = () => {
    setText("");           // 🧹 Clear textarea
    setUploadResult(null); // 🧹 Hide previous result
  };

  return (
    <div className="card">
      {/* 📋 Card Header Section */}
      <div className="card-header">
        <div className="card-title">📋 Paste & Share Text</div>
        <div className="card-description">
          Paste any code, message or text to generate a 4-digit OTP.
        </div>
      </div>

      {/* 📤 Main Card Content */}
      <div className="card-content">
        {/* 🧾 Show result component only after upload */}
        {uploadResult && <UploadResult result={uploadResult} onReset={handleReset} />}

        {/* 📝 Textarea input for user to paste text */}
        <textarea
          className="textbox textarea-textshare"
          rows="8"
          placeholder="Paste your code or message here..."
          value={text}
          onChange={(e) => setText(e.target.value)} // Update state on input
        />

        {/* 🔘 Upload button with loading and validation */}
        <button
          className="button button-primary button-full"
          onClick={handleUpload}
          disabled={!text.trim() || isUploading} // Disable if empty or uploading
        >
          {isUploading ? "Generating..." : "Generate OTP & Share"}
        </button>
      </div>
    </div>
  );
}

export default TextShareSection;
