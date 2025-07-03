import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { cleanupSingleText } from "../utils/clipboardCleanup";
import { Maximize2, X } from "lucide-react"; // 🧩 Make sure lucide-react is installed

function RetrieveTextResult({ result }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!result?.success || !result?.id) return;

    const timeout = setTimeout(async () => {
      const cleanup = await cleanupSingleText(result.id);
      console.log("🧹 Clipboard text cleanup:", cleanup.message);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [result]);

  if (!result) return null;
  if (!result.success) {
    return (
      <div className="alert alert-error" style={{ marginTop: "1rem" }}>
        ❌ {result.error || "Failed to load text"}
      </div>
    );
  }

  return (
    <>
      <div className="alert alert-success" style={{ marginTop: "1rem", position: "relative" }}>
        <div style={{ marginBottom: "0.5rem" }}>✅ Text Retrieved</div>

        <div style={{ position: "relative" }}>
          <textarea
            readOnly
            value={result.content || ""}
            rows={6}
            style={{ width: "100%", resize: "none", padding: "0.5rem" }}
          />

          {/* Maximize button */}
          <button
            onClick={() => setIsFullscreen(true)}
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            title="Maximize"
          >
            <Maximize2 size={18} />
          </button>
        </div>

        <div style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
          🧹 This message will self-destruct in 5 seconds after viewing.
        </div>
      </div>

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0, 0, 0, 0.85)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            padding: "1rem",
          }}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            style={{
              alignSelf: "flex-end",
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: "1.5rem",
              cursor: "pointer",
            }}
            title="Close"
          >
            <X />
          </button>

          <textarea
            readOnly
            value={result.content || ""}
            style={{
              flex: 1,
              width: "100%",
              resize: "none",
              padding: "1rem",
              fontSize: "1rem",
              background: "#fff",
              borderRadius: "8px",
            }}
          />
        </div>
      )}
    </>
  );
}

RetrieveTextResult.propTypes = {
  result: PropTypes.shape({
    success: PropTypes.bool.isRequired,
    content: PropTypes.string,
    id: PropTypes.string,
    error: PropTypes.string,
  }),
};

export default RetrieveTextResult;
