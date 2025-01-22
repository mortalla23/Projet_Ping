import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const userId = "123"; // Exemple d'user_id (remplace par une valeur dynamique si nécessaire)

  const handleNavigate = () => {
    navigate(`/anamnese/${userId}`);
  };

  return (
    <div>
      <h1>Tableau de bord</h1>
      <Button variant="contained" onClick={handleNavigate}>
        Aller à l'Anamnèse
      </Button>
    </div>
  );
};

export default Dashboard;
