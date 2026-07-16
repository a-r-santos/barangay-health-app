import React, { useState } from 'react';
import Login from './components/Login';
import StaffDashboard from './pages/Dashboard';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      {isLoggedIn ? (
        <StaffDashboard onLogout={() => setIsLoggedIn(false)} />
      ) : (
        <Login onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </>
  );
}