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
//import EnseiEleves from './view/enseignant/EnseiEleves';
// import EnseiRapports from './view/enseignant/EnseiRapports';
import EnseiAmenagements from './view/enseignant/EnseiAmenagements';
import AddStudentPage from './view/enseignant/AddStudentPage';
import EnseiHistoriqueEducation from './view/enseignant/EnseiHistoriqueEducation';
import EnseiPpre from './view/enseignant/EnseiPpre';
import EnseiPatients from './view/enseignant/EnseiPatients';
import EnseiPatientsList from './view/enseignant/EnseiPatientList';
import EnseiProfile from './view/enseignant/EnseiProfile';


// Composants pour les différentes sections du tableau de bord pour patient
import CompteRendus from './view/patient/CompteRendus';
import AménagementScolaire from './view/patient/AménagementScolaire';
import PatientAnamnèse from './view/patient/PatientAnamnèse';
import AjoutIntervenant from './view/patient/AjoutIntervenant';
import ConsulDocuments from './view/patient/ConsulDocuments';
import PAPForm from './view/patient/PAPForm';
import PatientIntervenantList from './view/patient/PatientIntervenantList'
import HistoriqueEducation from './view/patient/HistoriqueEducation';
import HistoriqueSante from './view/patient/HistoriqueSante';
import PatientPpre from './view/patient/PatientPpre';
import SectionLiens from './view/patient/Lien';

 

// Composants pour les différentes sections du tableau de bord pour orthophoniste
import OrthoPatients from './view/orthophoniste/OrthoPatients';
import OrthoProfile from './view/orthophoniste/OrthoProfile';
import Anamnese from './view/orthophoniste/Anamnese';
import OrthoHistoriqueEducation from './view/orthophoniste/OrthoHistoriqueEducation';
import OrthoHistoriqueSante from './view/orthophoniste/OrthoHistoriqueSante';
import OrthoPpre from './view/orthophoniste/OrthoPpre';
import OrthoPatientList from './view/orthophoniste/OrthoPatientList'; 



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
          <Route path="allPatients" element={<EnseiPatients />} />
          <Route path="profile" element={< EnseiProfile />} />
          <Route path="ascolairesEleve" element={<AménagementScolaire />} />
          <Route path="papEleve" element={<PAPForm />} />
          <Route path="addeleves" element={<AddStudentPage />} />
          <Route path="historique-education/:userId" element={<EnseiHistoriqueEducation />} />
          <Route path="listedespatients" element={<EnseiPatientsList />} />
          <Route path="documents" element={<ConsulDocuments />} />
          <Route path="messages" element={<Messages />} />
          <Route path="ppre/:userId" element={<EnseiPpre/>} />
          {/* <Route path="rapports/:userId" element={<EnseiRapports/>} /> */}
          
        </Route>

        {/* Routes protégées pour le patient */}
        <Route
          path="/patient/dashboard"
          element={<ProtectedRoute role="PATIENT"><PatientAccueil /></ProtectedRoute>}
        >
          <Route path="cr" element={<CompteRendus />} />
          <Route path="ajIntervenant" element={<AjoutIntervenant />} />
          <Route path="intervenants" element={<PatientIntervenantList />} />
          <Route path="pap" element={<PAPForm />} />
          <Route path="ascolaires" element={<AménagementScolaire />} />
          <Route path="anamnese" element={<PatientAnamnèse />} />
          <Route path="historique-education" element={<HistoriqueEducation />} />
          <Route path="historique-sante" element={<HistoriqueSante/>} />
          <Route path="ppre" element={<PatientPpre/>} />
          <Route path="ajouts" element={<SectionLiens/>} />
          
          <Route path="documents" element={<ConsulDocuments />} />
          <Route path="messages" element={<Messages />} />
        </Route>

        {/* Routes protégées pour l'orthophoniste */}
        <Route
          path="/ortho/dashboard"
          element={<ProtectedRoute role="ORTHOPHONIST"><OrthoAccueil /></ProtectedRoute>}
        >
          <Route path="allPatients" element={<OrthoPatients />} />
          <Route path="profile" element={< OrthoProfile />} />
          <Route path="ascolairesPatient" element={<AménagementScolaire />} />
          <Route path="papPatient" element={<PAPForm />} />
          <Route path="anamnese/:userId" element={<Anamnese />} />
          <Route path="historique-education/:userId" element={<OrthoHistoriqueEducation />} />
          <Route path="historique-sante/:userId" element={<OrthoHistoriqueSante />} />
          <Route path="profile" element={<OrthoProfile />} />
          <Route path="listedespatients" element={<OrthoPatientList />} />
          <Route path="documents" element={<ConsulDocuments />} />
          <Route path="messages" element={<Messages />} />
          <Route path="ppre/:userId" element={<OrthoPpre/>} />
          
        </Route>

        {/* ✅ Ajout des routes directes pour éviter l'erreur d'imbrication */}
        <Route path="/view/patient/PAPForm" element={<PAPForm />} />
        <Route path="/view/patient/AménagementScolaire" element={<AménagementScolaire />} />

      </Routes>
    </Router>
  );
}

export default App;