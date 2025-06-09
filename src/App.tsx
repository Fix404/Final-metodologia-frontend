import React from 'react';
import './App.css';
import { AppRouter } from './AppRouter';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
    <AppRouter/>
    </AuthProvider>
  );
};


export default App;