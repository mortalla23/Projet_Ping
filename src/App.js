import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Connexion from './view/authentification/Connexion';
import Inscription from './view/authentification/Inscription';
import EnseiAccueil from './view/enseignant/EnseiAccueil';
import PatientAccueil from './view/patient/PatientAccueil';
import OrthoAccueil from './view/orthophoniste/OrthoAccueil';
import Messages from './view/message/Message';

// Composants pour les différentes sections du tableau de bord pour enseignant
import EnseiEleves from './view/enseignant/EnseiEleves';
import EnseiHistorique from './view/enseignant/EnseiHistorique';
import EnseiRapports from './view/enseignant/EnseiRapports';
import EnseiAmenagements from './view/enseignant/EnseiAmenagements';
import EnseiHistoriqueEducation from './view/enseignant/EnseiHistoriqueEducation';
import EnseiPpre from './view/enseignant/EnseiPpre';

// Composants pour les différentes sections du tableau de bord pour patient
import CompteRendus from './view/patient/CompteRendus';
import  AménagementScolaire from './view/patient/AménagementScolaire';
import PatientAnamnèse from './view/patient/PatientAnamnèse';
import AjoutIntervenant from './view/patient/AjoutIntervenant';
import ConsulDocuments from './view/patient/ConsulDocuments';
import PAPForm from './view/patient/PAPForm';

import HistoriqueEducation from './view/patient/HistoriqueEducation';
import HistoriqueSante from './view/patient/HistoriqueSante';
import PatientPpre from './view/patient/PatientPpre';
 

// Composants pour les différentes sections du tableau de bord pour orthophoniste
import OrthoPatients from './view/orthophoniste/OrthoPatients';
import OrthoProfile from './view/orthophoniste/OrthoProfile';
import Anamnese from './view/orthophoniste/Anamnese';
import OrthoHistoriqueEducation from './view/orthophoniste/OrthoHistoriqueEducation';
import OrthoHistoriqueSante from './view/orthophoniste/OrthoHistoriqueSante';
import OrthoPpre from './view/orthophoniste/OrthoPpre';
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
          <Route path="historique-education/:userId" element={<EnseiHistoriqueEducation />} />
          <Route path="rapports" element={<EnseiRapports />} />
          <Route path="amenagements" element={<EnseiAmenagements />} />
          <Route path="messages" element={<Messages />} />
          <Route path="ppre/:userId" element={<EnseiPpre/>} />
          
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
          <Route path="pap" element={<PAPForm />} />
          <Route path="ascolaires" element={<AménagementScolaire />} />
          <Route path="anamnese/:userId" element={<PatientAnamnèse />} />
          <Route path="historique-education/:userId" element={<HistoriqueEducation />} />
          <Route path="historique-sante/:userId" element={<HistoriqueSante/>} />
          <Route path="ppre/:userId" element={<PatientPpre/>} />
          
          <Route path="documents" element={<ConsulDocuments />} />
          <Route path="messages" element={<Messages />} />
        </Route>
       
       {/* Routes protégées pour l'orthophoniste */}
       <Route
          path="/ortho/dashboard"
          element={
            <ProtectedRoute role="ORTHOPHONIST">
              <OrthoAccueil />
            </ProtectedRoute>
          }
        >
          {/* Sous-routes du tableau de bord */}
          <Route path="allPatients" element={<OrthoPatients />} />
          <Route path="profile" element={< OrthoProfile />} />
          <Route path="ascolaires" element={<AménagementScolaire />} />
          <Route path="anamnese/:userId" element={<Anamnese />} />
          <Route path="historique-education/:userId" element={<OrthoHistoriqueEducation />} />
          <Route path="historique-sante/:userId" element={<OrthoHistoriqueSante />} />
          <Route path="documents" element={<ConsulDocuments />} />
          <Route path="messages" element={<Messages />} />
          <Route path="ppre/:userId" element={<OrthoPpre/>} />
          
        </Route>
       
        
        {/* Ajoutez d'autres routes ici si nécessaire */}

        
      </Routes>
    </Router>
  );
}

export default App;
