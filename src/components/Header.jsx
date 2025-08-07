// ✅ This component renders the header section of the application, including the title and tagline.

import "../components_css/Header.css"

function Header() {
  return (
    <div className="header">
      <h1 className="title">
        Anonymous File Share
        <div className="aurora">
          <div className="aurora__item"></div>
          <div className="aurora__item"></div>
          <div className="aurora__item"></div>
          <div className="aurora__item"></div>
        </div>
      </h1>
      <p>Share files securely with a simple 4-digit code. No Login required.</p>
    </div>
  );
}

export default Header;
