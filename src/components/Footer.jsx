import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import CampfireIllustration from '../pages/troop242-campfire';
import '../styles/footer.css';

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const FooterLink = ({ to, children }) => (
  <Link to={to} onClick={scrollToTop}>{children}</Link>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  let canViewScoutPortal = false;
  try {
    const rawUser = sessionStorage.getItem('loggedInUser');
    if (rawUser) {
      const parsedUser = JSON.parse(rawUser);
      const allowedProfiles = ['scout', 'leader', 'admin'];
      canViewScoutPortal = allowedProfiles.includes(parsedUser?.profile);
    }
  } catch {
    canViewScoutPortal = false;
  }

  return (
    <footer className="footer" style={{ position: 'relative', overflow: 'hidden' }}>
     
     {/*  <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.3, maxWidth: '2500px', width: '100%' }}>
        <CampfireIllustration />
      </div> */}

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        {/* ROW 1: Branding */}
        <div style={{ marginBottom: 40 }}>
          <div className="footer-section">
            <h3 style={{ marginBottom: 16 }}>⚜️ Troop 242</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '1500px' }}>
              Building today's youth into tomorrow's leaders through adventure, brotherhood, and service.
            </p>
          </div>
        </div>

        {/* ROW 2: 4 Columns */}
        <div className="footer-grid">
          {/* Quick Links */}
          <div className="footer-section">
            <h4 style={{ marginBottom: 12, fontSize: '0.95rem', fontWeight: 700 }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/stories">Stories</FooterLink>
              <FooterLink to="/contact">Contact Us</FooterLink>
              {/* <FooterLink to="/camping">Camping</FooterLink> */}
              {/* {canViewScoutPortal && (
                <a href="/Troop242/Games/scout-portal.html" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem', transition: 'opacity 0.2s' }}>🎮Scout Portal</a>
              )} */}
          </div>
          </div>

          {/* Guide */}
          <div className="footer-section">
            <h4 style={{ marginBottom: 12, fontSize: '0.95rem', fontWeight: 700 }}>Guide</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <FooterLink to="/scouts-bsa">What is Scouts BSA?</FooterLink>
              <FooterLink to="/new-scout">New Scout</FooterLink>
              <FooterLink to="/scout-principles">Scout Principles</FooterLink>
              <FooterLink to="/skills">Scout Skills</FooterLink>
              <FooterLink to="/ranks">Scout Ranks</FooterLink>
              <FooterLink to="/badges">Merit Badges</FooterLink>
              <FooterLink to="/camping-guide">Camping Guide</FooterLink>
              <FooterLink to="/glossary">Glossary</FooterLink>
            </div>
          </div>

          {/* Resources */}
          <div className="footer-section">
            <h4 style={{ marginBottom: 12, fontSize: '0.95rem', fontWeight: 700 }}>Resources</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href="https://www.scouting.org" target="_blank" rel="noopener noreferrer">Scouting America</a>
              <a href="https://scoutbook.scouting.org/" target="_blank" rel="noopener noreferrer">Scoutbook</a>
              <FooterLink to="/calendar">Troop Calendar</FooterLink>
              <FooterLink to="/member-login">Member Login</FooterLink>
              {canViewScoutPortal && (
                <FooterLink to="/scout-portal">Scout Portal</FooterLink>
              )}
            </div>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4 style={{ marginBottom: 12, fontSize: '0.95rem', fontWeight: 700 }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="footer-contact-item">
                <Mail size={16} style={{ color: 'var(--accent)' }} />
                <a href="mailto:troop242sanford@gmail.com">troop242sanford@gmail.com</a>
              </div>
              <div className="footer-contact-item">
                <MapPin size={16} style={{ color: 'var(--accent)' }} />
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    const encoded = encodeURIComponent('3512 S Orlando Dr, Sanford, FL 32773');
                    window.open(`https://www.google.com/maps/search/${encoded}`, '_blank');
                  }}
                  title="3512 S Orlando Dr, Sanford, FL 32773"
                >
                  Sanford, FL
                </a>
              </div>
              <div className="footer-contact-item">
                <Phone size={16} style={{ color: 'var(--accent)' }} />
                <span>Tuesdays 7:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Link */}
       <div style={{ textAlign: 'center', marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--divider)' }}>
          <FooterLink to="/appearance" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', transition: 'color 0.2s' }}>
            🎨 Appearance
          </FooterLink>
        </div>

        {/* Divider & Copyright */}
        <div style={{ borderTop: '1px solid var(--divider)', marginTop: 40, paddingTop: 24 }}>
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <p>© {currentYear} Troop 242 Sanford. Scouting America | Adventure · Brotherhood · Service</p>
            <p style={{ marginTop: 12 }}>Maintained by troop webmaster : Rakesh K</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
