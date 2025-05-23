import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import DeckBuilder from './pages/DeckBuilder';
import Marketplace from './pages/Marketplace';
import ShillDashboard from './pages/ShillDashboard';
import Profile from './pages/Profile';

// Context
import { WalletProvider } from './context/WalletContext';
import { GameDataProvider } from './context/GameDataContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <WalletProvider>
        <GameDataProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-primary-light dark:bg-primary-dark text-text-light dark:text-text-dark">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/deck-builder" element={<DeckBuilder />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/shill-dashboard" element={<ShillDashboard />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </main>
              <Footer />
            </div>
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </Router>
        </GameDataProvider>
      </WalletProvider>
    </ThemeProvider>
  );
}

export default App;