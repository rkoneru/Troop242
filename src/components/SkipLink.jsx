
export default function SkipLink() {
  const handleSkip = (e) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
    }
  };

  return (
    <a
      href="#main-content"
      onClick={handleSkip}
      className="sr-only sr-only-focusable"
      style={{
        zIndex: 9999,
        background: 'var(--accent)',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '0 0 8px 8px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontWeight: 700,
        textDecoration: 'none'
      }}
    >
      Skip to main content
    </a>
  );
}
