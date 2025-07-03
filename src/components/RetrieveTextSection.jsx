// components/RetrieveTextSection.jsx
import { useState } from "react";
import OTPInput from "./OTPInput";
import { retrieveText } from "../services/clipboardService";
import RetrieveTextResult from "./RetrieveTextResult"; // ✅ Handles cleanup + display

function RetrieveTextSection() {
  const [otp, setOtp] = useState("");
  const [retrieveResult, setRetrieveResult] = useState(null);
  const [isRetrieving, setIsRetrieving] = useState(false);

  const handleRetrieve = async () => {
    if (otp.length !== 4) return;
    setIsRetrieving(true);
    setRetrieveResult(null);

    const result = await retrieveText(otp);
    setRetrieveResult(result);
    setIsRetrieving(false);
    setOtp("")
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">📋 Retrieve Text</div>
        <div className="card-description">Enter 4-digit code to view shared text</div>
      </div>

      <div className="card-content">
        <OTPInput
          value={otp}
          onChange={setOtp}
          onRetrieve={handleRetrieve}
          isRetrieving={isRetrieving}
        />

        {/* ✅ Result will handle its own cleanup */}
        {retrieveResult && <RetrieveTextResult result={retrieveResult} />}
      </div>
    </div>
  );
}

export default RetrieveTextSection;
