import { useEffect } from 'react';

export default function GamesLanding() {
  useEffect(() => {
    // Redirect to the HTML games hub
    window.location.href = '/Troop242/Games/scout-games-hub.html';
  }, []);

  return (
    <div style={{
      padding: '40px 20px',
      textAlign: 'center',
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div>
        <h2>Loading Scout Games...</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '16px' }}>
          If you are not redirected automatically, <a href="/Troop242/Games/scout-games-hub.html">click here</a>.
        </p>
      </div>
    </div>
  );
}
