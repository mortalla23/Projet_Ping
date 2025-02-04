import React, { useState } from "react";
import { Box, Typography, TextField, Button, Grid, Paper, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";

const AjoutIntervenant = () => {
  // Initialisation de l'état pour l'intervenant
  const [intervenant, setIntervenant] = useState({
    name: "",
    role: "",
    contactNumber: "",
    email: "",
    address: "",
  });

  // Gestion de la modification de l'état
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIntervenant((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Gestion de l'envoi du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, vous pouvez ajouter la logique pour envoyer les données au backend
    console.log("Intervenant ajouté:", intervenant);
    toast.success("Intervenant ajouté avec succès!");
  };

  return (
    <Box sx={{ padding: 3 }}>
      <ToastContainer />
      <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 3 }}>
        Ajouter un Intervenant
      </Typography>

      <Paper sx={{ padding: 3 }}>
        <form onSubmit={handleSubmit}>
          {/* Nom de l'intervenant */}
          <Box sx={{ my: 2 }}>
            <TextField
              fullWidth
              label="Nom de l'intervenant"
              name="name"
              value={intervenant.name}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Box>

          {/* Rôle ou Spécialité */}
          <Box sx={{ my: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Rôle ou Spécialité</InputLabel>
              <Select
                name="role"
                value={intervenant.role}
                onChange={handleInputChange}
                label="Rôle ou Spécialité"
              >
                <MenuItem value="Orthophoniste">Orthophoniste</MenuItem>
                <MenuItem value="Psychologue">Psychologue</MenuItem>
                <MenuItem value="Médecin Généraliste">Médecin Généraliste</MenuItem>
                <MenuItem value="Autre">Autre</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Numéro de contact */}
          <Box sx={{ my: 2 }}>
            <TextField
              fullWidth
              label="Numéro de contact"
              name="contactNumber"
              value={intervenant.contactNumber}
              onChange={handleInputChange}
              variant="outlined"
              type="tel"
            />
          </Box>

          {/* Email */}
          <Box sx={{ my: 2 }}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={intervenant.email}
              onChange={handleInputChange}
              variant="outlined"
              type="email"
            />
          </Box>

          {/* Adresse */}
          <Box sx={{ my: 2 }}>
            <TextField
              fullWidth
              label="Adresse"
              name="address"
              value={intervenant.address}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Box>

          {/* Bouton Ajouter */}
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" color="primary" type="submit">
              Ajouter
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AjoutIntervenant;
