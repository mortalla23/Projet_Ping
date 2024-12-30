import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Connexion from './view/authentification/Connexion';
import Inscription from './view/authentification/Inscription';
import EnseiAccueil from './view/enseignant/EnseiAccueil';

// Composant pour les routes protégées
const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    // Si aucun utilisateur connecté, redirige vers la page de connexion
    return <Navigate to="/connexion" />;
  }

  if (user.role !== role) {
    // Si l'utilisateur n'a pas le bon rôle, redirige vers une page d'erreur ou par défaut
    return <Navigate to="/connexion" />;
  }

  // Si tout est bon, retourne la page demandée
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Page de connexion par défaut */}
        <Route path="/" element={<Navigate to="/connexion" />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        
        {/* Route protégée pour l'enseignant */}
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute role="TEACHER">
              <EnseiAccueil />
            </ProtectedRoute>
          }
        />
        
        {/* Ajoute d'autres routes ici si nécessaire */}
      </Routes>
    </Router>
  );
}

export default App;
