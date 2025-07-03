import { useState } from "react";
import { uploadText } from "../services/clipboardService";
import UploadResult from "./UploadResult";

function TextShareSection() {
  const [text, setText] = useState("");
  const [uploadResult, setUploadResult] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    setIsUploading(true);
    const result = await uploadText(text);
    setUploadResult(result);
    setIsUploading(false);
  };

  const handleReset = () => {
  setText("");            // ✅ Clear the text box
  setUploadResult(null);  // ✅ Hide the UploadResult
};

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">📋 Paste & Share Text</div>
        <div className="card-description">Paste any code, message or text to generate a 4-digit OTP.</div>
      </div>

      <div className="card-content">
        {uploadResult && <UploadResult result={uploadResult} onReset={handleReset} />}
        <textarea
          className="textbox"
          rows="8"
          placeholder="Paste your code or message here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ width: "100%", padding: "0.5rem" }}
        />
        <button
          className="button button-primary button-full"
          onClick={handleUpload}
          disabled={!text.trim() || isUploading}
        >
          {isUploading ? "Generating..." : "Generate OTP & Share"}
        </button>

    
      </div>
    </div>
  );
}

export default TextShareSection;
