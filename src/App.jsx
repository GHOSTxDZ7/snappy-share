// 🌟 React Hooks
import { useState } from "react";

// 🧩 UI Components
import Header from "./components/Header";                     // 🔝 Top section with app name/logo
import Features from "./components/Features";                 // 💡 Shows app features and benefits
import UploadSection from "./components/UploadSection";       // 📤 UI for uploading files
import RetrieveSection from "./components/RetrieveSection";   // 📥 UI for retrieving files via OTP
import TextShareSection from "./components/TextShareSection"; // 📝 UI for sharing clipboard text
import RetrieveTextSection from "./components/RetrieveTextSection"; // 📋 UI for retrieving shared text
import Footer from "./components/Footer";                     // 👣 Footer with branding/info

// 🎨 Global styles
import "./App.css";

function App() {
  // 🔄 Track which tab is currently active (default: 'upload')
  const [activeTab, setActiveTab] = useState("upload");

  return (
    <div className="app">
      <div className="container">
        
        {/* 🔝 App Header with title/logo */}
        <Header />

        {/* ✨ Feature Highlights */}
        <Features />

        {/* 🔘 Navigation Tabs */}
        <div className="tabs">
          <div className="tabs-list">
            {/* 📤 Upload File Button */}
            <button
              className={`tab-trigger ${activeTab === "upload" ? "active" : ""}`}
              onClick={() => setActiveTab("upload")}
            >
              Upload File
            </button>

            {/* 📝 Share Text Button */}
            <button
              className={`tab-trigger ${activeTab === "text" ? "active" : ""}`}
              onClick={() => setActiveTab("text")}
            >
              Share Text
            </button>

            {/* 📥 Retrieve File Button */}
            <button
              className={`tab-trigger ${activeTab === "retrieve" ? "active" : ""}`}
              onClick={() => setActiveTab("retrieve")}
            >
              Retrieve File
            </button>

            {/* 📋 Retrieve Shared Text Button */}
            <button
              className={`tab-trigger ${activeTab === "retrieveText" ? "active" : ""}`}
              onClick={() => setActiveTab("retrieveText")}
            >
              Retrieve Text
            </button>
          </div>

          {/* 🎯 Display Component Based on Active Tab */}
          <div className="tab-content">
            {activeTab === "upload" && <UploadSection />}         {/* Show file upload UI */}
            {activeTab === "retrieve" && <RetrieveSection />}     {/* Show file retrieval UI */}
            {activeTab === "text" && <TextShareSection />}        {/* Show text sharing UI */}
            {activeTab === "retrieveText" && <RetrieveTextSection />} {/* Show text retrieval UI */}
          </div>
        </div>

        {/* 👣 Footer with links/info */}
        <Footer />
      </div>
    </div>
  );
}

export default App;
