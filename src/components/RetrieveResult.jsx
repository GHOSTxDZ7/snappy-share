import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { formatFileSize, timeUntilExpiry } from "../utils/formatters"; // Utility functions for formatting
import { cleanupSingleFile } from "../utils/supabaseCleanup"; // Cleanup function after expiration/download
import "../components_css/RetrieveResult.css";

// ✅ Component to display file retrieval result and allow downloading
function RetrieveResult({ result, onDownload }) {
  const [timeLeft, setTimeLeft] = useState("");            // 🕒 Countdown timer until expiry
  const [downloaded, setDownloaded] = useState(false);     // ✅ Track if file is already downloaded
  const [intervalId, setIntervalId] = useState(null);      // ⏱️ Save interval ID for clearing

  // ✅ Start countdown timer as soon as component mounts and result is available
  useEffect(() => {
    if (!result?.expiresAt) return; // ⛔ If no expiration info, stop here

    // Set initial time remaining
    setTimeLeft(timeUntilExpiry(result.expiresAt));

    // ⏳ Start timer to update time left every second
    const interval = setInterval(async () => {
      const updated = timeUntilExpiry(result.expiresAt);
      setTimeLeft(updated); // Update state

      // ❌ If file is expired, clear timer and trigger Supabase cleanup
      if (updated === "Expired") {
        clearInterval(interval);
        const cleanup = await cleanupSingleFile(result.filename, result.otp);
        console.log("⏱️ Cleanup triggered (expired):", cleanup.message);
      }
    }, 1000); // Every 1s

    setIntervalId(interval); // Save interval ID for later clearing

    // ✅ Cleanup timer when component unmounts or dependency changes
    return () => clearInterval(interval);
  }, [result?.expiresAt]);

  // ✅ Function to handle download button click
  const handleDownload = async () => {
    setDownloaded(true);       // Disable button immediately
    setTimeLeft("Expired");    // Show "Expired" in UI
    clearInterval(intervalId); // Stop countdown

    await onDownload();        // Trigger actual download logic passed as prop

    // ⏱️ Wait for 5s before cleaning up the file from Supabase
    setTimeout(async () => {
      const cleanup = await cleanupSingleFile(result.filename, result.otp);
      console.log("🧹 Cleanup triggered (after download):", cleanup.message);
    }, 5000);
  };

  // ⛔ Don't render anything if result is null
  if (!result) return null;

  return (
    <div className={`alert ${result.success ? "alert-success" : "alert-error"} retrieve-alert`}>
      {result.success ? (
        <div>
          {/* ✅ Message: File found */}
          <div className="file-found">✅ File found!</div>

          <div className="result-success">
            {/* 📁 Display basic file metadata */}
            <div className="file-info">
              <p>📁 {result.originalName || "Unnamed File"}</p>
              <p>📋 {result.type || "Unknown type"}</p>
              <p>📊 {result.size ? formatFileSize(result.size) : "Unknown size"}</p>
              <p>⏰ {timeLeft}</p>
            </div>

            {/* ⬇️ Download button */}
            <button
              className="button button-primary button-full"
              onClick={handleDownload}
              aria-label="Download file"
              disabled={timeLeft === "Expired" || downloaded} // Disable if already downloaded or expired
            >
              {/* 📥 Download Icon */}
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="download-icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>

              {/* 📝 Button text depending on status */}
              {timeLeft === "Expired"
                ? "Expired"
                : downloaded
                  ? "File is being downloaded..."
                  : "Download File"}
            </button>
          </div>
        </div>
      ) : (
        // ❌ If file was not found or failed
        <div>❌ {result.error || "Something went wrong"}</div>
      )}
    </div>
  );
}

// ✅ Prop validation to ensure correct structure is passed to component
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
