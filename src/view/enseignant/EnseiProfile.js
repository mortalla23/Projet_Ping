import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EnseiProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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
      navigate("/teacher/dashboard"); // Redirige l'utilisateur vers la page /teacher/dashboard après avoir sauvegardé les informations
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUser({ ...user, photo: reader.result });
      };
      reader.readAsDataURL(file);
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
        maxWidth: "800px",
        margin: "auto",
        minHeight: "600px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}
      >
        Mon Profil
      </Typography>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img
          src={user.photo}
          alt="Profil"
          className="img-fluid rounded-circle"
          style={{ width: "150px", height: "150px", objectFit: "cover" }}
        />
        <div>
          <label htmlFor="photoInput" className="btn btn-primary btn-sm">
            Modifier la photo
          </label>
          <input
            id="photoInput"
            type="file"
            accept="image/*"
            className="d-none"
            onChange={handlePhotoChange}
          />
        </div>
      </div>

      <form>
        <TextField
          fullWidth
          label="Nom"
          name="lastName"
          value={user.lastName || ""}
          margin="normal"
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Prénom"
          name="firstName"
          value={user.firstName || ""}
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
          label="Cabinet / Hôpital"
          name="clinic"
          value={user.clinic || ""}
          margin="normal"
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Email"
          name="email"
          value={user.email || ""}
          margin="normal"
          readOnly
        />

        <TextField
          fullWidth
          label="Téléphone"
          name="phone"
          value={user.phone || ""}
          margin="normal"
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Adresse"
          name="address"
          value={user.address || ""}
          margin="normal"
          onChange={handleChange}
        />

        <Stack direction="column" spacing={2} mt={3} alignItems="center">
          <Button
            color="primary"
            variant="contained"
            size="large"
            onClick={handleSave}
            sx={{
              backgroundColor: "#5BA8B4",
              "&:hover": {
                backgroundColor: "#4c9ca3",
              },
              width: "200px",
              padding: "12px",
            }}
          >
            Enregistrer
          </Button>

          <Button
            color="secondary"
            variant="outlined"
            size="large"
            onClick={handleLogout}
            sx={{
              mt: 2,
              width: "200px",
              padding: "12px",
            }}
          >
            Déconnexion
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default EnseiProfile;
