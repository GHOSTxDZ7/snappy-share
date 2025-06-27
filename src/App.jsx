import { useState } from "react"
import Header from "./components/Header"
import Features from "./components/Features"
import UploadSection from "./components/UploadSection"
import RetrieveSection from "./components/RetrieveSection"
import Footer from "./components/Footer"
import "./App.css" // 🎨 Global styles

function App() {
  const [activeTab, setActiveTab] = useState("upload") // 🔄 Toggle between 'upload' and 'retrieve' tabs

  return (
    <div className="app">
      <div className="container">
        {/* 🔝 Page Header */}
        <Header />

        {/* ⭐ Highlights of the app */}
        <Features />

        {/* 📁 Upload/Retrieve Toggle Tabs */}
        <div className="tabs">
          <div className="tabs-list">
            {/* 🚀 Upload Tab Button */}
            <button
              className={`tab-trigger ${activeTab === "upload" ? "active" : ""}`}
              onClick={() => setActiveTab("upload")}
            >
              Upload File
            </button>

            {/* 📥 Retrieve Tab Button */}
            <button
              className={`tab-trigger ${activeTab === "retrieve" ? "active" : ""}`}
              onClick={() => setActiveTab("retrieve")}
            >
              Retrieve File
            </button>
          </div>

          {/* 🧩 Conditional Tab Content */}
          <div className="tab-content">
            {activeTab === "upload" && <UploadSection />}     {/* ⬆️ Show Upload UI */}
            {activeTab === "retrieve" && <RetrieveSection />} {/* ⬇️ Show Retrieve UI */}
          </div>
        </div>

        {/* 👣 Footer Disclaimer */}
        <Footer />
      </div>
    </div>
  )
}

export default App
