/**
 * Converts bytes to a human-readable file size string.
 * Also handles hex-encoded size values like '\x30' from Supabase (temporary fix).
 */
export function formatFileSize(input) {
  let bytes = input;

  // 🧪 Detect if input is a hex string (e.g., \x323339343832)
  if (typeof input === "string" && input.startsWith("\\x")) {
    try {
      const hex = input.slice(2); // Remove the '\x' prefix
      let ascii = "";

      // 🔁 Convert each hex byte (2 characters) to its ASCII equivalent
      for (let i = 0; i < hex.length; i += 2) {
        ascii += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      }

      // 📦 Parse the resulting ASCII number string to an actual number
      bytes = parseInt(ascii, 10);
    } catch {
      return "Invalid size"; // ⚠️ In case of failure in conversion
    }
  }

  // 🧮 Ensure that the bytes value is a valid number
  if (typeof bytes !== "number" || isNaN(bytes)) {
    return "Unknown size";
  }

  // 🔢 Format to human-readable units (B, KB, MB)
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(2)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}


/**
 * Calculates time left until file expiration and returns it as a readable string.
 * Automatically adjusts from UTC to local browser time.
 * @param {string} utcExpiryString - UTC timestamp of expiry
 */
export function timeUntilExpiry(utcExpiryString) {
  const expiryUTC = new Date(utcExpiryString); // 🌍 Parse UTC timestamp
  const localExpiry = new Date(
    expiryUTC.getTime() - expiryUTC.getTimezoneOffset() * 60 * 1000 // 🕓 Adjust to local timezone
  );

  const nowLocal = new Date(); // 🕒 Get current local time
  const diffMs = localExpiry.getTime() - nowLocal.getTime(); // ⏳ Time remaining in milliseconds

  if (diffMs <= 0) return "Expired"; // ⌛ If past expiry

  const minutes = Math.floor(diffMs / (1000 * 60)); // ⏱️ Minutes left
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000); // ⏱️ Seconds left

  return `Expires in ${minutes}m ${seconds}s`; // 📣 Display remaining time
}
