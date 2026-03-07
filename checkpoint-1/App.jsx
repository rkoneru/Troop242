import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchWidget from './components/SearchWidget';
import Home from './pages/Home';
import Ranks from './pages/Ranks';
import Badges from './pages/Badges';
import Skills from './pages/Skills';
import Stories from './pages/Stories';
import About from './pages/About';
import Appearance from './pages/Appearance';
import Contact from './pages/Contact';
import Calendar from './pages/Calendar';
import MemberLogin from './pages/MemberLogin';
import ScoutSignup from './pages/ScoutSignup';
import LeaderDashboard from './pages/LeaderDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  return (
    <Router basename="/Troop242/">
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ranks" element={<Ranks />} />
          <Route path="/badges" element={<Badges />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/about" element={<About />} />
          <Route path="/appearance" element={<Appearance />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/member-login" element={<MemberLogin />} />
          <Route path="/scout-signup" element={<ScoutSignup />} />
          <Route path="/leader-dashboard" element={<LeaderDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

        </Routes>
        <Footer />
        <SearchWidget />
      </div>
    </Router>
  );
}

export default App;
