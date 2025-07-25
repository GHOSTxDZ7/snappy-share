import { useEffect, useRef } from "react";
import "../components_css/OTPInput.css"

function OTPInput({ value, onChange, onRetrieve, isRetrieving }) {
  const inputRefs = useRef([]); // Store references to each input field

  // ✅ Automatically focus the first input on component mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Handles input character change
  const handleInputChange = (index, inputValue) => {
    const newValue = value.split(""); // Convert current OTP string to array
    newValue[index] = inputValue.slice(-1); // Accept only the last character typed
    const newOtp = newValue.join(""); // Join back to a string
    onChange(newOtp); // Pass new OTP back to parent

    // Auto-focus next input box if current one filled
    if (inputValue && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace and Enter key
  const handleKeyDown = (index, e) => {
    if (e.key === "Enter" && value.length === 4 && !isRetrieving) {
      onRetrieve(); // Pressing Enter triggers file retrieval
    }

    // Move focus to previous input on backspace (if current input is empty)
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste (user pastes full OTP)
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4); // Get max 4 digits
    if (/^\d+$/.test(pastedData)) {
      onChange(pastedData.padEnd(4, "")); // Set OTP with trailing blanks if needed
    }
  };

  return (
    <div>
      {/* OTP Input Label */}
      <div className="otp-container">
        <label className="otp-label">4-Digit Code</label>

        {/* OTP Input Fields */}
        <div className="otp-input-group">
          {[0, 1, 2, 3].map((index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)} // Assign ref
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="1"
              className="otp-input"
              value={value[index] || ""}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
            />
          ))}
        </div>
      </div>

      {/* Submit button */}
      <button
        className="button button-primary button-full"
        onClick={onRetrieve}
        disabled={value.length !== 4 || isRetrieving}
      >
        {isRetrieving ? "Retrieving..." : "Retrieve Data"}
      </button>
    </div>
  );
}

export default OTPInput;
