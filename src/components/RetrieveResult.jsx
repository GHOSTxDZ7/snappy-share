import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { formatFileSize, timeUntilExpiry } from "../utils/formatters";
import { cleanupSingleFile } from "../utils/supabaseCleanup";

function RetrieveResult({ result, onDownload }) {
  const [timeLeft, setTimeLeft] = useState(""); // Countdown time left
  const [downloaded, setDownloaded] = useState(false); // ✅ Flag to disable button after download
  const [intervalId, setIntervalId] = useState(null); // ✅ Track interval for manual clear

  // Run countdown timer based on file expiry time
  useEffect(() => {
    if (!result?.expiresAt) return;

    setTimeLeft(timeUntilExpiry(result.expiresAt)); // Set initial value

    const interval = setInterval(async () => {
      const updated = timeUntilExpiry(result.expiresAt);
      setTimeLeft(updated);

      if (updated === "Expired") {
        clearInterval(interval); // Stop countdown
        const cleanup = await cleanupSingleFile(result.filename, result.otp); // Cleanup after expiry
        console.log("⏱️ Cleanup triggered (expired):", cleanup.message);
      }
    }, 1000); // Update every second

    setIntervalId(interval); // Store interval ID for later clearing

    return () => clearInterval(interval); // Cleanup when unmounting
  }, [result?.expiresAt]);

  // Handle file download click
  const handleDownload = async () => {
    setDownloaded(true);       // Disable button
    setTimeLeft("Expired");    // Force UI to show "Expired"
    clearInterval(intervalId); // Stop countdown

    await onDownload();        // Trigger actual file download

    // Wait 5 seconds before triggering cleanup
    setTimeout(async () => {
      const cleanup = await cleanupSingleFile(result.filename, result.otp);
      console.log("🧹 Cleanup triggered (after download):", cleanup.message);
    }, 5000);
  };

  if (!result) return null; // Guard clause

  return (
    <div
      className={`alert ${result.success ? "alert-success" : "alert-error"}`}
      style={{ marginTop: "1rem" }}
    >
      {result.success ? (
        <div>
          <div style={{ marginBottom: "1rem" }}>✅ File found!</div>

          <div className="result-success">
            {/* Display file metadata */}
            <div className="file-info">
              <p>📁 {result.originalName || "Unnamed File"}</p>
              <p>📋 {result.type || "Unknown type"}</p>
              <p>📊 {result.size ? formatFileSize(result.size) : "Unknown size"}</p>
              <p>⏰ {timeLeft}</p>
            </div>

            {/* Download Button */}
            <button
              className="button button-primary button-full"
              onClick={handleDownload}
              aria-label="Download file"
              disabled={timeLeft === "Expired" || downloaded} // Disable after click or expiry
            >
              {/* Download Icon */}
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ marginRight: "0.5rem" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {/* Button Text */}
              {timeLeft === "Expired"
                ? "Expired"
                : downloaded
                ? "File is being downloaded..."
                : "Download File"}
            </button>
          </div>
        </div>
      ) : (
        <div>❌ {result.error || "Something went wrong"}</div>
      )}
    </div>
  );
}

// ✅ Type validation using PropTypes
RetrieveResult.propTypes = {
  result: PropTypes.shape({
    success: PropTypes.bool.isRequired,
    originalName: PropTypes.string,
    size: PropTypes.number,
    type: PropTypes.string,
    expiresAt: PropTypes.string,
    filename: PropTypes.string,
    otp: PropTypes.string,
    error: PropTypes.string,
  }),
  onDownload: PropTypes.func.isRequired,
};

export default RetrieveResult;
