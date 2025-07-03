import { useState } from "react";
import OTPInput from "./OTPInput"; // Component for entering 4-digit OTP
import RetrieveResult from "./RetrieveResult"; // Component that shows file metadata and download button
import { retrieveFile, downloadFile } from "../services/fileService"; // Supabase file service methods

function RetrieveSection() {
  // ✅ Component states
  const [retrieveResult, setRetrieveResult] = useState(null); // Stores retrieved file metadata or error
  const [isRetrieving, setIsRetrieving] = useState(false); // Indicates loading state while retrieving
  const [otp, setOtp] = useState(""); // Holds the entered 4-digit OTP

  // ✅ Function to fetch file metadata by OTP
  const handleRetrieve = async () => {
    if (otp.length !== 4) return; // Skip if OTP is incomplete

    setIsRetrieving(true); // Show loading
    setRetrieveResult(null); // Clear previous result

    try {
      const result = await retrieveFile(otp); // Call Supabase to get metadata
      setRetrieveResult(result); // Show result in UI
    } catch (error) {
      // Handle failure
      setRetrieveResult({
        success: false,
        error: "Retrieval failed. Please try again.",
      });
    } finally {
      setIsRetrieving(false); // Hide loading
      setOtp("") //Clear OTP
    }
  };

  // ✅ Function to download the actual file from Supabase using signed URL
  const handleDownload = async () => {
    if (!retrieveResult?.filename) return;

    try {
      const result = await downloadFile(retrieveResult.filename, otp); // Get signed URL

      if (result.success && result.url) {
        // Download file as a blob
        const response = await fetch(result.url);
        if (!response.ok) throw new Error("Failed to fetch file");

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob); // Create temporary link

        const link = document.createElement("a"); // Create download anchor
        link.href = blobUrl;
        link.download = retrieveResult.originalName || "download"; // Set filename
        link.target = "_blank"; // For some browsers, forces download
        document.body.appendChild(link);
        link.click(); // Trigger download

        // Cleanup after download
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } else {
        alert("Could not generate a valid download link.");
      }
    } catch (error) {
      console.error("Download failed:", error);

      // Fallback: Open URL in new tab if blob download fails
      if (result?.url) {
        window.open(result.url, "_blank");
      } else {
        alert("Download failed. Please try again.");
      }
    }
  };

  return (
    <div className="card">
      {/* Header Section */}
      <div className="card-header">
        <div className="card-title">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Retrieve File
        </div>
        <div className="card-description">
          Enter the 4-digit code to download the shared file.
        </div>
      </div>

      {/* Main Content Section */}
      <div className="card-content">
        {/* OTP input component */}
        <OTPInput
          value={otp}
          onChange={setOtp}
          onRetrieve={handleRetrieve}
          isRetrieving={isRetrieving}
        />

        {/* Conditional rendering of result (file metadata + download button) */}
        {retrieveResult && (
          <RetrieveResult result={retrieveResult} onDownload={handleDownload} />
        )}
      </div>
    </div>
  );
}

export default RetrieveSection;
