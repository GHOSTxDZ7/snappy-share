// ✅ This component renders the header section of the application, including the title and tagline.

function Header() {
  return (
    <div className="header">
      {/* Main heading of the application */}
      <h1>Anonymous File Share</h1>

      {/* Subtext that describes the core feature of the app */}
      <p>Share files securely with a simple 4-digit code. No Login required.</p>
    </div>
  );
}

export default Header;
