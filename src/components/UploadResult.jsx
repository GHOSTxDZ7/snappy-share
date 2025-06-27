import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { formatFileSize } from "../utils/formatters";

// ✅ Component displays upload result, shows OTP and countdown timer
function UploadResult({ result, onReset }) {
  if (!result) return null; // Nothing to display if result is null

  // ✅ Destructure result fields
  const { success, otp, originalName, type, size, error } = result;

  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds

  // ✅ Countdown logic for expiry display
  useEffect(() => {
    if (!success) return; // Skip timer if upload failed

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval); // Stop timer at 0
          return 0;
        }
        return prev - 1; // Decrement every second
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [success]);

  // ✅ Convert remaining seconds to "Xm Ys" format
  const formattedTime =
    timeLeft > 0
      ? `Expires in ${Math.floor(timeLeft / 60)}m ${timeLeft % 60}s`
      : "Expired";

  return (
    <div className="upload-result">
      {success ? (
        <>
          {/* ✅ Upload success message */}
          <div className="result-success">
            <strong>✅ File uploaded successfully!</strong>
          </div>

          {/* ✅ OTP display */}
          <div className="otp-display">
            <div className="otp-label">🔐 Share this OTP to allow file download:</div>
            <div className="otp-code">{otp}</div>
          </div>

          {/* ✅ File metadata display */}
          <div className="file-info">
            <p>📁 {originalName || "Unnamed File"}</p>
            <p>📋 {type || "Unknown type"}</p>
            <p>📊 {size ? formatFileSize(size) : "Unknown size"}</p>
            <p>⏰ {formattedTime}</p>
          </div>

          {/* ✅ Reset button to allow another upload */}
          <button className="button button-outline button-full" onClick={onReset}>
            Upload Another File
          </button>
        </>
      ) : (
        // ✅ Error display block
        <div className="alert alert-error">
          <strong>❌ {error || "Something went wrong. Try again."}</strong>
          <button
            className="button button-outline button-full"
            onClick={onReset}
            style={{ marginTop: "1rem" }}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

// ✅ Prop validation
UploadResult.propTypes = {
  result: PropTypes.shape({
    success: PropTypes.bool.isRequired,
    otp: PropTypes.string,
    originalName: PropTypes.string,
    type: PropTypes.string,
    size: PropTypes.number,
    error: PropTypes.string,
  }),
  onReset: PropTypes.func.isRequired,
};

export default UploadResult;
