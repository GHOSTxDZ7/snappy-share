// ✅ This component renders a set of feature cards explaining the key benefits of the app.

import "../components_css/Feature.css"

function Features() {
  return (
    <div className="features">
      {/* Feature 1: Anonymous Access */}
      <div className="feature-card">
        {/* Shield Check Icon (green color) */}
        <svg className="feature-icon green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
        <div className="feature-content">
          <h3>Anonymous</h3>
          <p>No login required</p>
        </div>
      </div>

      {/* Feature 2: Auto-Expire Functionality */}
      <div className="feature-card">
        {/* Clock Icon (blue color) */}
        <svg className="feature-icon blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="feature-content">
          <h3>Auto-Expire</h3>
          <p>Files expire in 5 minutes</p>
        </div>
      </div>

      {/* Feature 3: Fast Sharing */}
      <div className="feature-card">
        {/* Lightning Bolt Icon (purple color) */}
        <svg className="feature-icon purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        <div className="feature-content">
          <h3>Fast & Simple</h3>
          <p>Upload and share instantly</p>
        </div>
      </div>
    </div>
  );
}

export default Features;
