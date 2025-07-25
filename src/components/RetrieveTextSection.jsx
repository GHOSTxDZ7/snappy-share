import { useState } from "react";
import OTPInput from "./OTPInput"; // 🔢 Component to enter 4-digit OTP
import { retrieveText } from "../services/clipboardService"; // 📡 Service to retrieve shared text from Supabase
import RetrieveTextResult from "./RetrieveTextResult"; // 📋 Component to display the retrieved text and auto-clean it
import "../components_css/RetrieveTextSection.css";

// 📄 Main component for text retrieval using OTP
function RetrieveTextSection() {
  // 🔐 State to hold the 4-digit OTP
  const [otp, setOtp] = useState("");

  // 📬 State to hold the result of retrieval (success or error)
  const [retrieveResult, setRetrieveResult] = useState(null);

  // 🔄 State to show a loading indicator while retrieving
  const [isRetrieving, setIsRetrieving] = useState(false);

  // 🔍 Handles the process of retrieving text using OTP
  const handleRetrieve = async () => {
    if (otp.length !== 4) return; // ✅ Guard clause: only proceed if OTP is complete

    setIsRetrieving(true);       // Show loading spinner
    setRetrieveResult(null);     // Clear any previous result

    const result = await retrieveText(otp); // 📡 Call the backend (Supabase)
    setRetrieveResult(result);   // 📝 Store the response (success or error)
    setIsRetrieving(false);      // Stop loading spinner
    setOtp("");                  // Clear OTP input field
  };

  return (
    <div className="card">
      {/* 🔷 Card header with title and description */}
      <div className="card-header">
        <div className="card-title">📋 Retrieve Text</div>
        <div className="card-description">Enter 4-digit code to view shared text</div>
      </div>

      {/* 📦 Main card content */}
      <div className="card-content">
        {/* 🔢 OTP input component */}
        <OTPInput
          value={otp}
          onChange={setOtp}
          onRetrieve={handleRetrieve}
          isRetrieving={isRetrieving}
        />

        {/* 📄 If result is available, render the result UI */}
        {retrieveResult && <RetrieveTextResult result={retrieveResult} />}
      </div>
    </div>
  );
}

export default RetrieveTextSection;
