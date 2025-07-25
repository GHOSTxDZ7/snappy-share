import { useState } from "react";
import OTPInput from "./OTPInput"; // 🔢 Component to input 4-digit OTP
import RetrieveResult from "./RetrieveResult"; // 📄 Component to display file metadata and download option
import { retrieveFile, downloadFile } from "../services/fileService"; // 🔌 Supabase service methods
import "../components_css/RetrieveSection.css";

// 📦 Component for handling OTP input and file retrieval
function RetrieveSection() {
  // 🔧 State to store retrieved result (file info or error)
  const [retrieveResult, setRetrieveResult] = useState(null);

  // 🔄 State to track if a file is being retrieved (used for loading UI)
  const [isRetrieving, setIsRetrieving] = useState(false);

  // 🔑 State to store the 4-digit OTP entered by the user
  const [otp, setOtp] = useState("");

  // 🔍 Function to retrieve file metadata using the OTP
  const handleRetrieve = async () => {
    // ✅ Prevent action if OTP is incomplete
    if (otp.length !== 4) return;

    setIsRetrieving(true);      // Show spinner/loading
    setRetrieveResult(null);    // Reset previous results

    try {
      // 📡 Call backend (Supabase) to get file metadata
      const result = await retrieveFile(otp);
      setRetrieveResult(result); // ✅ Save result to display
    } catch (error) {
      // ❌ If request fails, show error
      setRetrieveResult({
        success: false,
        error: "Retrieval failed. Please try again.",
      });
    } finally {
      setIsRetrieving(false); // Hide loading state
      setOtp("");             // Clear OTP field
    }
  };

  // ⬇️ Function to actually download the file using signed URL
  const handleDownload = async () => {
    // 🚫 Exit if no file found or filename is missing
    if (!retrieveResult?.filename) return;

    try {
      // 🔐 Request download URL from Supabase
      const result = await downloadFile(retrieveResult.filename, otp);

      if (result.success && result.url) {
        // 🌐 Fetch the file data using the URL
        const response = await fetch(result.url);
        if (!response.ok) throw new Error("Failed to fetch file");

        // 📦 Convert response to a blob
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob); // ⛓️ Create a temporary link

        // 🔗 Create and trigger a hidden download link
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = retrieveResult.originalName || "download"; // Set default filename
        link.target = "_blank";
        document.body.appendChild(link);
        link.click(); // 🖱️ Trigger the download

        // 🧹 Cleanup after download
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } else {
        alert("Could not generate a valid download link.");
      }
    } catch (error) {
      console.error("Download failed:", error);

      // 🔁 Fallback: open in new tab if blob fails
      if (result?.url) {
        window.open(result.url, "_blank");
      } else {
        alert("Download failed. Please try again.");
      }
    }
  };

  return (
    <div className="card">
      {/* 🔷 Header section */}
      <div className="card-header">
        <div className="card-title">
          {/* ⬇️ Download icon */}
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

        {/* 📝 Description */}
        <div className="card-description">
          Enter the 4-digit code to download the shared file.
        </div>
      </div>

      {/* 📦 Main content: OTP input + results */}
      <div className="card-content">
        {/* 🔢 OTP Input component */}
        <OTPInput
          value={otp}
          onChange={setOtp}
          onRetrieve={handleRetrieve}
          isRetrieving={isRetrieving}
        />

        {/* 📄 Conditionally render the file metadata + download button */}
        {retrieveResult && (
          <RetrieveResult result={retrieveResult} onDownload={handleDownload} />
        )}
      </div>
    </div>
  );
}

export default RetrieveSection;
