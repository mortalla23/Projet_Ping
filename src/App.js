import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Connexion from './view/authentification/Connexion';
import Inscription from './view/authentification/Inscription';
import EnseiAccueil from './view/enseignant/EnseiAccueil';

// Composants pour les différentes sections du tableau de bord
import EnseiEleves from './view/enseignant/EnseiEleves';
import EnseiHistorique from './view/enseignant/EnseiHistorique';
import EnseiRapports from './view/enseignant/EnseiRapports';
import EnseiAmenagements from './view/enseignant/EnseiAmenagements';

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
        
        {/* Routes protégées pour l'enseignant */}
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute role="TEACHER">
              <EnseiAccueil />
            </ProtectedRoute>
          }
        >
          {/* Sous-routes du tableau de bord */}
          <Route path="eleves" element={<EnseiEleves />} />
          <Route path="historique" element={<EnseiHistorique />} />
          <Route path="rapports" element={<EnseiRapports />} />
          <Route path="amenagements" element={<EnseiAmenagements />} />
        </Route>
        
        {/* Ajoutez d'autres routes ici si nécessaire */}
      </Routes>
    </Router>
  );
}

export default App;
