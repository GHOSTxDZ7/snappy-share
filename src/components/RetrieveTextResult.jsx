import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { cleanupSingleText } from "../utils/clipboardCleanup"; // 🧹 Function to delete clipboard text after view
import { Maximize2, X } from "lucide-react"; // 🔍 Icons for maximizing and closing
import "../components_css/RetrieveTextResult.css";

// 📋 Component to display retrieved text result from the clipboard
function RetrieveTextResult({ result }) {
  // 🔄 State to toggle fullscreen view
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 🧼 Automatically clean up the clipboard text 3 seconds after it's viewed
  useEffect(() => {
    // ⚠️ Exit if result is invalid or unsuccessful
    if (!result?.success || !result?.id) return;

    // ⏱️ Set a timeout to trigger cleanup
    const timeout = setTimeout(async () => {
      const cleanup = await cleanupSingleText(result.id); // Call cleanup utility
      console.log("🧹 Clipboard text cleanup:", cleanup.message);
    }, 3000); // 3 seconds delay

    // 🧹 Clear timeout if component unmounts
    return () => clearTimeout(timeout);
  }, [result]);

  // 🛑 Don't render anything if no result is present
  if (!result) return null;

  // ❌ If retrieval failed, show error message
  if (!result.success) {
    return (
      <div className="alert alert-error retrieve-text-error">
        ❌ {result.error || "Failed to load text"}
      </div>
    );
  }

  // ✅ Success state: Show retrieved text with self-destruct message
  return (
    <>
      {/* ✅ Success alert box */}
      <div className="alert alert-success retrieve-text-success">
        {/* 🔹 Title message */}
        <div className="success-heading">✅ Text Retrieved</div>

        {/* 📝 Display retrieved text in read-only textarea */}
        <div className="text-container">
          <textarea
            readOnly
            value={result.content || ""}
            rows={6}
            className="retrieve-textarea"
          />

          {/* 🔳 Button to expand textarea to fullscreen */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="maximize-button"
            title="Maximize"
          >
            <Maximize2 size={18} />
          </button>
        </div>

        {/* 🔐 Self-destruct message */}
        <div className="self-destruct-note">
          🧹 This message will self-destruct in 3 seconds after viewing to ensure privacy.
        </div>
      </div>

      {/* 🔳 Fullscreen overlay to display text in large view */}
      {isFullscreen && (
        <div className="fullscreen-overlay">
          {/* ❌ Close button */}
          <button
            onClick={() => setIsFullscreen(false)}
            className="close-button"
            title="Close"
          >
            <X />
          </button>

          {/* 📃 Large textarea for fullscreen display */}
          <textarea
            readOnly
            value={result.content || ""}
            className="fullscreen-textarea"
          />
        </div>
      )}
    </>
  );
}

// 🧪 Prop type validation to ensure data structure
RetrieveTextResult.propTypes = {
  result: PropTypes.shape({
    success: PropTypes.bool.isRequired,
    content: PropTypes.string,
    id: PropTypes.string,
    error: PropTypes.string,
  }),
};

export default RetrieveTextResult;
