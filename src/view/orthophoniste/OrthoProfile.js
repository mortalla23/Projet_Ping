import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const OrthoProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Charger les données de l'utilisateur depuis le localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/connexion"); // Rediriger vers la page de connexion si aucun utilisateur n'est trouvé
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/connexion");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSave = () => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Informations enregistrées.");
      navigate("/ortho/dashboard"); // Redirige l'utilisateur vers la page /ortho/dashboard après avoir sauvegardé les informations
    }
  };

  if (!user) {
    return <Typography>Chargement...</Typography>; // Afficher un message de chargement tant que les données ne sont pas disponibles
  }

  return (
    <Box
      sx={{
        padding: 2,
        bgcolor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 5px #00000033",
        maxWidth: "800px", // Limiter la largeur du profil
        margin: "auto", // Centrer horizontalement
        minHeight: "600px", // Hauteur minimale du formulaire
        display: "flex", // Utiliser flexbox pour une gestion plus flexible
        flexDirection: "column", // Aligner les éléments en colonne
        justifyContent: "flex-start", // Aligner les éléments au sommet
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}>
        Mon Profil
      </Typography>

      <form>
        <TextField
          fullWidth
          label="Nom"
          name="username"
          value={user.username || ""}
          margin="normal"
          onChange={handleChange}
        />
        
        <TextField
          fullWidth
          label="Date de naissance"
          name="birthDate"
          type="date"
          value={user.birthDate ? new Date(user.birthDate).toLocaleDateString("en-CA") : ""}
          margin="normal"
          onChange={handleChange}
        />
        
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={user.email || ""}
          margin="normal"
          onChange={handleChange}
        />

        <Stack direction="column" spacing={2} mt={3} alignItems="center">
          {/* Bouton Enregistrer */}
          <Button
            color="primary"
            variant="contained"
            size="large"
            onClick={handleSave}
            sx={{
              backgroundColor: '#5BA8B4', // Couleur personnalisée
              '&:hover': {
                backgroundColor: '#4c9ca3', // Couleur au survol
              },
              width: "200px", // Réduction de la largeur des boutons
              padding: "12px", // Augmentation du padding
            }}
          >
            Enregistrer
          </Button>

          {/* Bouton Déconnexion */}
          <Button
            color="secondary"
            variant="outlined"
            size="large"
            onClick={handleLogout}
            sx={{
              mt: 2,  // Ajout de marges pour espacer les boutons
              width: "200px", // Réduction de la largeur des boutons
              padding: "12px", // Augmentation du padding
            }}
          >
            Déconnexion
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default OrthoProfile;
