import React from "react";
import { Box, Typography, Grid, Paper, Button, Divider } from "@mui/material";

const AmenagementScolaire = () => {
  // Données simulées pour les aménagements scolaires
  const amenagements = [
    {
      id: 1,
      type: "Aménagement horaire",
      description: "Extension du temps de réponse lors des examens.",
      details: "Le patient a droit à 30 minutes supplémentaires pour chaque examen afin de réduire le stress et lui permettre de bien gérer son temps.",
    },
    {
      id: 2,
      type: "Aménagement pédagogique",
      description: "Support visuel pour la compréhension des consignes.",
      details: "L'utilisation d'images ou de vidéos pour expliquer les consignes est permise afin de faciliter la compréhension pour les élèves ayant des difficultés de lecture.",
    },
    {
      id: 3,
      type: "Aménagement environnemental",
      description: "Lieu calme pour les examens et travaux scolaires.",
      details: "Le patient peut effectuer ses examens dans une salle séparée, calme, pour éviter la distraction et améliorer sa concentration.",
    },
    {
      id: 4,
      type: "Aménagement matériel",
      description: "Utilisation d'outils informatiques pour rédiger les travaux.",
      details: "L'élève peut utiliser un ordinateur ou une tablette pour rédiger ses devoirs au lieu de la méthode traditionnelle à la main.",
    },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 3 }}>
        Aménagement Scolaire
      </Typography>

      {/* Liste des aménagements scolaires */}
      {amenagements.map((amenagement) => (
        <Paper key={amenagement.id} sx={{ padding: 2, marginBottom: 2, borderRadius: 2, boxShadow: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>{amenagement.type}</Typography>
              <Typography variant="body2" color="textSecondary">{amenagement.description}</Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Button variant="outlined" color="primary" onClick={() => alert(amenagement.details)}>
                Voir Détails
              </Button>
            </Grid>
          </Grid>
          <Divider sx={{ marginTop: 2 }} />
        </Paper>
      ))}

      {/* Message de consultation uniquement
      <Box sx={{ marginTop: 3 }}>
        <Typography variant="body1" color="textSecondary">
          Cette page vous permet de consulter vos aménagements scolaires actuels. Si vous avez besoin de modifications supplémentaires, veuillez contacter votre responsable scolaire ou orthophoniste.
        </Typography>
      </Box> */}
    </Box>
  );
};

export default AmenagementScolaire;
