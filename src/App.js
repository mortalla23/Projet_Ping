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
import AddStudentPage from './view/enseignant/AddStudentPage';
import Ppre from './view/enseignant/EnseiPpre' ;
import HistoriqueEducation from './view/enseignant/EnseiHistoriqueEducation';

// Composants pour les différentes sections du tableau de bord pour patient
import CompteRendus from './view/patient/CompteRendus';
import AménagementScolaire from './view/patient/AménagementScolaire';
// import PatientAnamnèse from './view/patient/PatientAnamnèse';
import AjoutIntervenant from './view/patient/AjoutIntervenant';
import ConsulDocuments from './view/patient/ConsulDocuments';
import PAPForm from './view/patient/PAPForm';
import PatientAnamnèse from './view/orthophoniste/OrthoAnamnese';

// Composants pour les différentes sections du tableau de bord pour orthophoniste
import OrthoPatients from './view/orthophoniste/OrthoPatients';
import OrthoProfile from './view/orthophoniste/OrthoProfile';
import OrthoPatientList from './view/orthophoniste/OrthoPatientList'; 
import HistoriqueEducations from './view/orthophoniste/OrthoHistoriqueEducation'; 
import Ppree from './view/orthophoniste/OrthoPpre'; 
// Composant pour les routes protégées
const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return <Navigate to="/connexion" />;
  }

  if (user.role !== role) {
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
          element={<ProtectedRoute role="TEACHER"><EnseiAccueil /></ProtectedRoute>}
        >
          <Route path="eleves" element={<EnseiEleves />} />
          <Route path="addeleves" element={<AddStudentPage />} />
          <Route path="historique" element={<EnseiHistorique />} />
          <Route path="rapports" element={<EnseiRapports />} />
          <Route path="amenagements" element={<EnseiAmenagements />} />
          <Route path="messages" element={<Messages />} />
          {/* <Route path="Ppre" element={<Ppre />} />
          <Route path='histoEdu' element= {< HistoriqueEducations/>} />
          <Route path="AménagementScolaire" element={<AménagementScolaire />} /> */}
        </Route>

        {/* Routes protégées pour le patient */}
        <Route
          path="/patient/dashboard"
          element={<ProtectedRoute role="PATIENT"><PatientAccueil /></ProtectedRoute>}
        >
          <Route path="cr" element={<CompteRendus />} />
          <Route path="ajIntervenant" element={<AjoutIntervenant />} />
          <Route path="pap" element={<PAPForm />} />
          <Route path="ascolaires" element={<AménagementScolaire />} />
          <Route path="anamnese" element={<PatientAnamnèse />} />
          <Route path="documents" element={<ConsulDocuments />} />
          <Route path="messages" element={<Messages />} />
        </Route>

        {/* Routes protégées pour l'orthophoniste */}
        <Route
          path="/ortho/dashboard"
          element={<ProtectedRoute role="ORTHOPHONIST"><OrthoAccueil /></ProtectedRoute>}
        >
          <Route path="allPatients" element={<OrthoPatients />} />
          <Route path="profile" element={<OrthoProfile />} />
          <Route path="listedespatients" element={<OrthoPatientList />} />
          <Route path="documents" element={<ConsulDocuments />} />
          <Route path="messages" element={<Messages />} />
          
        </Route>

        {/* ✅ Ajout des routes directes pour éviter l'erreur d'imbrication */}
        <Route path="/view/patient/PAPForm" element={<PAPForm />} />
        <Route path="/view/patient/AménagementScolaire" element={<AménagementScolaire />} />
        <Route path="/view/patient/HistoriqueEducatif" element={< HistoriqueEducation />} />
        <Route path="/view/patient/PPREForm" element={< Ppree />} />
        <Route path="/view/patient/EnseiHistoriqueEducation" element={< HistoriqueEducation />} />
        <Route path="/view/patient/Anamnese" element={< PatientAnamnèse />} />

        
      </Routes>
    </Router>
  );
}

export default App;
