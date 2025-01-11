import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Connexion from './view/authentification/Connexion';
import Inscription from './view/authentification/Inscription';
import EnseiAccueil from './view/enseignant/EnseiAccueil';
import PatientAccueil from './view/patient/PatientAccueil';

// Composants pour les différentes sections du tableau de bord
import EnseiEleves from './view/enseignant/EnseiEleves';
import EnseiHistorique from './view/enseignant/EnseiHistorique';
import EnseiRapports from './view/enseignant/EnseiRapports';
import EnseiAmenagements from './view/enseignant/EnseiAmenagements';

import CompteRendus from './view/patient/CompteRendus';
import  AménagementScolaire from './view/patient/AménagementScolaire';
import PatientAnamnèse from './view/patient/PatientAnamnèse';
import AjoutIntervenant from './view/patient/AjoutIntervenant';
import ConsulDocuments from './view/patient/ConsulDocuments';

import Message from './view/message/Message'; 




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
          <Route path="messages" element={<Message />} />
        </Route>

        {/* Routes protégées pour le patient  */}
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute role="PATIENT">
              <PatientAccueil />
            </ProtectedRoute>
          }
        >
          {/* Sous-routes du tableau de bord */}
          <Route path="cr" element={<CompteRendus />} />
          <Route path="ajIntervenant" element={<AjoutIntervenant />} />
          <Route path="ascolaires" element={<AménagementScolaire />} />
          <Route path="anamnese" element={<PatientAnamnèse />} />
          <Route path="documents" element={<ConsulDocuments />} />
          <Route path="messages" element={<Message />} />
        </Route>
       
        
        {/* Ajoutez d'autres routes ici si nécessaire */}

        
      </Routes>
    </Router>
  );
}

export default App;
