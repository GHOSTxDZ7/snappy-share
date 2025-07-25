// ✅ Import necessary React hooks and utilities
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { formatFileSize } from "../utils/formatters"; // Helper to format bytes
import "../components_css/UploadResult.css"; // Component-specific styles

// ✅ Main UploadResult component
function UploadResult({ result, onReset }) {
  // If no result is passed, return nothing (null UI)
  if (!result) return null;

  // Destructure the result object for easier access
  const { success, otp, originalName, type, size, error, content } = result;

  // State for countdown timer (5 minutes = 300 seconds)
  const [timeLeft, setTimeLeft] = useState(5 * 60);

  // Check if result represents a file (as opposed to plain text)
  const isFile = !!(type || size || originalName);

  // Button label based on type
  const resetButtonLabel = isFile ? "Upload Another File" : "Send Another Text";

  // Countdown effect for file expiration
  useEffect(() => {
    // Only run timer if success and file
    if (!success || !isFile) return;

    // Create a timer interval that counts down every second
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval); // Stop at 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup on unmount or condition change
    return () => clearInterval(interval);
  }, [success, isFile]);

  // Format the timer display (e.g. 4m 59s)
  const formattedTime =
    timeLeft > 0
      ? `Expires in ${Math.floor(timeLeft / 60)}m ${timeLeft % 60}s`
      : "Expired";

  return (
    <div className="upload-result">
      {success ? (
        <>
          {/* Success Message */}
          <div className="result-success">
            <strong>
              ✅ {isFile ? "File uploaded successfully!" : "Text shared successfully!"}
            </strong>
          </div>

          {/* OTP Display Block */}
          <div className="otp-display">
            <div className="otp-label">🔐 Share this OTP:</div>
            <div className="otp-code">{otp}</div>
          </div>

          {/* File Metadata Section (only shown for file) */}
          {isFile && (
            <div className="file-info">
              <p>📁 {originalName || "Unnamed File"}</p>
              <p>📋 {type || "Unknown type"}</p>
              <p>📊 {size ? formatFileSize(size) : "Unknown size"}</p>
              <p>⏰ {formattedTime}</p>
            </div>
          )}

          {/* Reset button */}
          <button className="button button-outline button-full" onClick={onReset}>
            {resetButtonLabel}
          </button>
        </>
      ) : (
        // If upload failed, show error alert
        <div className="alert alert-error">
          <strong>❌ {error || "Something went wrong. Try again."}</strong>
          <button
            className="button button-outline button-full try-again-button"
            onClick={onReset}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

// ✅ Prop validation for better developer experience
UploadResult.propTypes = {
  result: PropTypes.shape({
    success: PropTypes.bool.isRequired,
    otp: PropTypes.string,
    originalName: PropTypes.string,
    type: PropTypes.string,
    size: PropTypes.number,
    content: PropTypes.string,
    error: PropTypes.string,
  }),
  onReset: PropTypes.func.isRequired,
};

export default UploadResult;
