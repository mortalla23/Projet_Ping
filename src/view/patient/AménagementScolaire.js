import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Tab,
  Tabs,
  Button,
  TextField,
  Divider,
} from "@mui/material";



const SectionAmenagement = () => {

   const location = useLocation(); // ✅ Récupération de `location` correctement
    // ✅ Initialisation avec `location.state` ou `localStorage`
    const [userId, setUserId] = useState(() => {
      return location.state?.selectedPatient?.id || localStorage.getItem("patientId") || null;
    });
  
    const [intervenantId, setIntervenantId] = useState(() => {
      return location.state?.orthoId || localStorage.getItem("intervenantId") || null;
    });
  
    useEffect(() => {
      console.log("📌 location.state reçu :", location.state);
  
      // ✅ Vérifier si location.state est bien défini avant mise à jour
      if (location.state?.selectedPatient?.id || location.state?.orthoId) {
        setUserId(prevUserId => location.state.selectedPatient?.id ?? prevUserId);
        setIntervenantId(prevIntervenantId => location.state.orthoId ?? prevIntervenantId);
      } else {
        // ✅ Évite les mises à jour inutiles en comparant avec l'ancien état
        setUserId(prevUserId => prevUserId ?? localStorage.getItem("patientId"));
        setIntervenantId(prevIntervenantId => prevIntervenantId ?? localStorage.getItem("intervenantId"));
      }
    }, [location.state]); // Dépendance correcte

  console.log("userId :", userId);
  console.log("intervenantId :", intervenantId);
  
  const [userRole, setUserRole] = useState(null); // État pour stocker le rôle utilisateur

useEffect(() => {
  const fetchUserRole = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${intervenantId}`);
      if (!response.ok) {
        throw new Error(`Erreur serveur : ${response.status} ${response.statusText}`);
      }
      const userData = await response.json();
      setUserRole(userData.role); // Mettre à jour l'état avec le rôle utilisateur
      console.log("Rôle de l'intervenant récupéré :", userData.role); // Affiche le rôle dans la console
    } catch (err) {
      console.error("Erreur lors de la récupération du rôle utilisateur :", err);
    }
  };

  fetchUserRole();
}, [intervenantId]); // Dépendance à intervenantId pour relancer l'effet si intervenantId change


  const [validatedAmenagements, setValidatedAmenagements] = useState([]);
  const [pendingAmenagements, setPendingAmenagements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0); // Onglet actif (0, 1, ou 2)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/amenagements/user/${userId}`);
        if (!response.ok) {
          throw new Error(`Erreur serveur : ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const validated = data.filter((item) => item.status === "VALIDATED");
        const pending = data.filter((item) => item.status === "ONGOING");
        setValidatedAmenagements(validated);
        setPendingAmenagements(pending);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const renderValidatedAmenagements = () => {
    const sections = {
      "Aménagement horaire": [],
      "Aménagement pédagogique": [],
      "Aménagement matériel": [],
      "Aménagement environnemental": [],
    };

    validatedAmenagements.forEach((amenagement) => {
      if (sections[amenagement.type]) {
        sections[amenagement.type].push(amenagement);
      } else {
        console.warn(`Type inconnu : ${amenagement.type}`);
      }
    });

    return (
      <Box>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Aménagements validés
        </Typography>
        {Object.keys(sections).map((type) => (
          <Box
            key={type}
            sx={{
              marginBottom: 6,
              padding: 2,
              backgroundColor: "#f5f5f5",
              borderRadius: 2,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: 2, color: "#333" }}>
              {type}
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />
            {sections[type].length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Aucun aménagement dans cette catégorie.
              </Typography>
            ) : (
              sections[type].map((amenagement) => (
                <Paper
                  key={amenagement.id}
                  sx={{
                    padding: 2,
                    marginBottom: 2,
                    borderRadius: 2,
                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        Motif : {amenagement.motif}
                      </Typography>
                      <Typography variant="body2">Objectifs : {amenagement.objectifs}</Typography>
                      <Typography variant="body2">
                        Période : {new Date(amenagement.dateDebut).toLocaleDateString()} -{" "}
                        {new Date(amenagement.dateFin).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="caption" color="text.secondary">
                        Créé le : {new Date(amenagement.createdAt).toLocaleDateString()}
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        Mis à jour le : {new Date(amenagement.updatedAt).toLocaleDateString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              ))
            )}
          </Box>
        ))}
      </Box>
    );
  };

  const renderPendingAmenagements = () => (
    <Box>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Aménagements en cours de validation
      </Typography>
      {pendingAmenagements.length === 0 ? (
        <Typography>Aucun aménagement en cours de validation.</Typography>
      ) : (
        pendingAmenagements.map((amenagement) => (
          <Paper
            key={amenagement.id}
            sx={{
              padding: 2,
              marginBottom: 2,
              borderRadius: 2,
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#ffffff",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Typography variant="body1" sx={{ fontWeight: "bold", color: "#1976d2" }}>
                  Type : {amenagement.type}
                </Typography>
                <Typography variant="body2">Motif : {amenagement.motif}</Typography>
                <Typography variant="body2">Objectifs : {amenagement.objectifs}</Typography>
                <Typography variant="body2">
                  Période : {new Date(amenagement.dateDebut).toLocaleDateString()} -{" "}
                  {new Date(amenagement.dateFin).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="caption" color="text.secondary">
                  Créé le : {new Date(amenagement.createdAt).toLocaleDateString()}
                </Typography>
                <br />
                <Typography variant="caption" color="text.secondary">
                  Mis à jour le : {new Date(amenagement.updatedAt).toLocaleDateString()}
                </Typography>
                <br />
                {userRole === "ORTHOPHONIST" && (
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ marginTop: 2 }}
                    onClick={async () => {
                      try {
                        const response = await fetch(
                          `http://localhost:5000/api/amenagements/validate`,
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/x-www-form-urlencoded",
                            },
                            body: `amenagementId=${amenagement.id}`,
                          }
                        );
                        if (!response.ok) {
                          throw new Error("Erreur lors de la validation de l'aménagement");
                        }
                        alert("Aménagement validé avec succès !");
                        // Optionnel : mettez à jour l'état pour retirer cet aménagement de la liste
                        setPendingAmenagements((prev) =>
                          prev.filter((item) => item.id !== amenagement.id)
                        );
                      } catch (error) {
                        alert("Une erreur est survenue lors de la validation.");
                        console.error(error);
                      }
                    }}
                  >
                    Valider
                  </Button>
                )}
              </Grid>
            </Grid>
          </Paper>
        ))
      )}
    </Box>
  );
  
  const renderPrescriptionForm = () => {
    // Variables locales pour stocker les valeurs du formulaire
    let formData = {
      type: "",
      motif: "",
      objectifs: "",
      dateDebut: "",
      dateFin: "",
    };
  
    // Fonction pour mettre à jour les données du formulaire
    const handleChange = (e) => {
      const { name, value } = e.target;
      formData[name] = value; // Mise à jour directe des données
    };
  
    // Fonction pour soumettre les données du formulaire
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const payload = {
        ...formData,
        userId, // ID utilisateur défini en dur
        idPrescripteur: intervenantId, // ID intervenant défini en dur
      };
  
      try {
        const response = await fetch("http://localhost:5000/api/amenagements/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
  
        if (!response.ok) {
          throw new Error(`Erreur serveur : ${response.status} ${response.statusText}`);
        }
  
        const responseData = await response.json();
        console.log("Aménagement créé avec succès :", responseData);
        alert("Aménagement prescrit avec succès !");
      } catch (err) {
        console.error("Erreur lors de la prescription :", err);
        alert("Une erreur est survenue lors de la prescription de l'aménagement.");
      }
    };
  
    // Affichage du formulaire
    return (
      <Box>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Prescrire un aménagement
        </Typography>
        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
          {/* Champ pour le type */}
          <TextField
            select
            name="type"
            onChange={handleChange}
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            SelectProps={{
              native: true,
            }}
            required
          >
            <option value="">-- Sélectionnez un type d'aménagement --</option>  {/* Option vide par défaut */}
            <option value="Aménagement horaire">Aménagement horaire</option>
            <option value="Aménagement pédagogique">Aménagement pédagogique</option>
            <option value="Aménagement matériel">Aménagement matériel</option>
            <option value="Aménagement environnemental">Aménagement environnemental</option>
          </TextField>
  
          {/* Champ pour le motif */}
          <TextField
            label="Motif"
            name="motif"
            onChange={handleChange}
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2, textAlign: "center"}}
            required
          />
  
          {/* Champ pour les objectifs */}
          <TextField
            label="Objectifs"
            name="objectifs"
            onChange={handleChange}
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            required
          />
  
          {/* Champ pour la date de début */}
          <TextField
            label="Date de début"
            name="dateDebut"
            type="date"
            onChange={handleChange}
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
  
          {/* Champ pour la date de fin */}
          <TextField
            label="Date de fin"
            name="dateFin"
            type="date"
            onChange={handleChange}
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
  
          {/* Bouton pour soumettre */}
          <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
            Prescrire
          </Button>
        </Box>
      </Box>
    );
  };
  
  

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ marginTop: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Définir les onglets disponibles
  const tabs = [
    { label: "Aménagements validés", render: renderValidatedAmenagements },
    { label: "En cours de validation", render: renderPendingAmenagements },
  ];

  if (userRole === "TEACHER" || userRole === "ORTHOPHONIST") {
    tabs.push({ label: "Prescrire un aménagement", render: renderPrescriptionForm });
  }

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={(event, newValue) => setActiveTab(newValue)}
        centered
        sx={{ marginBottom: 4 }}
      >
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>
      {tabs[activeTab].render()}
    </Box>
  );
};

export default SectionAmenagement;
