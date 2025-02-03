import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Button,
} from "@mui/material";

const SectionLiens = () => {
  const [ongoingLinks, setOngoingLinks] = useState([]);
  const [linkCreators, setLinkCreators] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const patientId = localStorage.getItem("patientId");

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        console.log("Token envoyé :", localStorage.getItem("token"));
        
        const response = await fetch("http://localhost:5000/api/link/ongoing", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Erreur serveur : ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("id_user :", patientId);
        console.log("réponse_data :", data);
        
        const filteredLinks = data.filter(link => link.linkedTo == patientId);
        console.log("réponse après filtrage :", filteredLinks);
        
        setOngoingLinks(filteredLinks);
        fetchLinkCreators(filteredLinks);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, [patientId]);

  const fetchLinkCreators = async (links) => {
    const creatorData = {};
    
    for (const link of links) {
      if (!creatorData[link.linkerId]) {
        try {
          const response = await fetch(`http://localhost:5000/api/users/${link.linkerId}`, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const userData = await response.json();
            creatorData[link.linkerId] = userData;
          }
        } catch (error) {
          console.error("Erreur lors de la récupération de l'utilisateur :", error);
        }
      }
    }
    
    setLinkCreators(creatorData);
  };

  const handleValidate = async (id) => {
    try {
        
        
        const response = await fetch(`http://localhost:5000/api/link/validate?linkId=${id}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la validation du lien");
        }

        alert("✅ Lien validé avec succès !");
        
        setOngoingLinks((prev) => prev.filter((link) => link.id !== id));

    } catch (error) {
        console.error("❌ Erreur :", error);
        alert("Une erreur est survenue lors de la validation.");
    }
  };

  const handleReject = async (id) => {
    try {
        //console.log(`📌 Validation du lien avec ID: ${id}`);
        
        const response = await fetch(`http://localhost:5000/api/link/reject?linkId=${id}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la validation du lien");
        }
        /*await fetch(`http://localhost:5000/api/link/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        });*/
        
        alert("Vous avez refusé cet ajout.");
        
        setOngoingLinks((prev) => prev.filter((link) => link.id !== id));

    } catch (error) {
        console.error("❌ Erreur :", error);
        alert("Une erreur est survenue lors de la validation.");
    }
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

  return (
    <Box>
    
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Validations en attente
      </Typography>

      {ongoingLinks.length === 0 ? (
        <Typography>Aucun lien en attente de validation.</Typography>
      ) : (
        ongoingLinks.map((link) => {
          const creator = linkCreators[link.linkerId] || {};
          return (
            <Paper
              key={link.id}
              sx={{
                padding: 2,
                marginBottom: 2,
                borderRadius: 2,
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#ffffff",
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography variant="body1" sx={{ fontWeight: "bold", color: "#1976d2" }}>
                    {creator.firstName} {creator.lastName}
                  </Typography>
                  <Typography variant="body2" sx={{ fontStyle: "italic", color: "#757575" }}>
                    {creator.role === "ORTHOPNIST" ? "ORTHOPHONISTE" : creator.role === "TEACHER" ? "ENSEIGNANT" : creator.role}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4} sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleValidate(link.id)}
                  >
                    Valider
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleReject(link.id)}
                    sx={{ "&:hover": { backgroundColor: "#D32F2F" } }} // Rouge foncé (comme MUI)
                    >
                    Rejeter
                  </Button>

                </Grid>
              </Grid>
            </Paper>
          );
        })
      )}
    </Box>
  );
};

export default SectionLiens;
