# Troop 242 Scouting Portal ⚜️

A comprehensive web application designed for **Troop 242** (Central Florida) to manage scouting activities, track advancements, and provide interactive educational resources for scouts and leaders.

## 🚀 Overview

The Troop 242 Scouting Portal serves as a digital hub for everything scouting. It empowers scouts to take ownership of their advancement journey while providing leaders with the tools needed to manage troop operations effectively.

## ✨ Key Features

### 🏆 Advancement Tracking
- **Rank Tracker:** Interactive wizard to track progress from Scout to Eagle Rank.
- **Merit Badge Tracker:** Manage and track progress for over 145 merit badges.
- **Skills Tracker:** Document and verify scouting skills.
- **Misc Awards:** Support for additional awards beyond standard ranks.

### 📊 Dashboards
- **Scout Dashboard:** Personalized view of advancement, upcoming events, and quick tools.
- **Leader Dashboard:** Overview of troop progress, attendance, and scout management.
- **Admin Dashboard:** High-level troop settings, stats management, and user roles.

### 🎮 Interactive Learning
- **Games Hub:** A collection of scouting-themed games including:
  - Knot Quiz
  - Morse Code Challenge
  - First Aid Scenarios
  - Navigation Challenge
  - Rank Trivia
- **Camping Guide & Animations:** Visual and interactive guides for outdoor preparation.

### 🛠️ Troop Management
- **Finances:** Track troop dues and expenses.
- **Invitations:** Send and manage invitations for new members.
- **Calendar:** Keep track of meetings, campouts, and community service.
- **Glossary:** A comprehensive reference for scouting terminology.

## 🛠️ Tech Stack

- **Frontend:** [React](https://reactjs.org/) with [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & CSS Modules
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Backend/Auth:** [Firebase](https://firebase.google.com/)
- **Testing:** [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## 🏁 Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/Troop242.git
   cd Troop242
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root and add your Firebase configuration (see `src/firebase/config.js` for required fields).

### Development

Start the development server:
```bash
npm run dev
```

### Building for Production

Build the project:
```bash
npm run build
```
The output will be in the `dist` directory.

## 🧪 Testing

Run the test suite:
```bash
npm test
```

## 📂 Project Structure

```text
src/
├── components/     # Reusable UI components
├── contexts/       # React Contexts (Auth, etc.)
├── data/           # Static data and constants
├── firebase/       # Firebase configuration and services
├── hooks/          # Custom React hooks
├── pages/          # Page components
├── styles/         # Global styles and themes
└── utils/          # Helper functions and business logic
Games/              # Legacy and standalone HTML/JS games
public/             # Static assets
```

## 📄 License

This project is private and intended for the use of Troop 242.
