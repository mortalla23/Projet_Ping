import './App.css';

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Connexion from './view/authentification/Connexion';
import Inscription from './view/authentification/Inscription';

function App() {
    return (
        <Router>
            <Routes>
                {/* Page de connexion par défaut */}
                <Route path="/" element={<Navigate to="/connexion" />} />
                <Route path="/connexion" element={<Connexion />} />
                <Route path="/inscription" element={<Inscription />} />
                {/* Ajoute d'autres routes ici si nécessaire */}
            </Routes>
        </Router>
    );
}

export default App;



