import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import ProfilePage from './pages/ProfilePage';
import ConsultancyPage from './pages/ConsultancyPage';
import { SignIn, SignUp } from './pages/AuthPages';
import MainPage from './pages/MainPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/consultancy" element={<ConsultancyPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
