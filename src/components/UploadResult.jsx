import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { formatFileSize } from "../utils/formatters";

function UploadResult({ result, onReset }) {
  if (!result) return null;

  const { success, otp, originalName, type, size, error, content } = result;

  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes

  const isFile = !!(type || size || originalName); // Detect file vs text
  const resetButtonLabel = isFile ? "Upload Another File" : "Send Another Text";

  useEffect(() => {
    if (!success || !isFile) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [success, isFile]);

  const formattedTime =
    timeLeft > 0
      ? `Expires in ${Math.floor(timeLeft / 60)}m ${timeLeft % 60}s`
      : "Expired";

  return (
    <div className="upload-result">
      {success ? (
        <>
          <div className="result-success">
            <strong>
              ✅ {isFile ? "File uploaded successfully!" : "Text shared successfully!"}
            </strong>
          </div>

          <div className="otp-display">
            <div className="otp-label">🔐 Share this OTP:</div>
            <div className="otp-code">{otp}</div>
          </div>

          {isFile && (
            <div className="file-info">
              <p>📁 {originalName || "Unnamed File"}</p>
              <p>📋 {type || "Unknown type"}</p>
              <p>📊 {size ? formatFileSize(size) : "Unknown size"}</p>
              <p>⏰ {formattedTime}</p>
            </div>
          )}

          <button className="button button-outline button-full" onClick={onReset}>
            {resetButtonLabel}
          </button>
        </>
      ) : (
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
