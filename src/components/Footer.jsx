// ✅ This component displays a footer message about file auto-deletion policy.

import "../components_css/Footer.css"

function Footer() {
  return (
    <div className="footer">
      {/* Informational text about file expiration for user awareness */}
      <p>Files are automatically deleted after 5 Minutes for your privacy and security.</p>
    </div>
  );
}

export default Footer;
