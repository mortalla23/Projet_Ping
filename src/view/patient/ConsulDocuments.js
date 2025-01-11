import React, { useState } from "react";
import { Box, Typography, IconButton, Collapse, Grid, Paper, Divider, Card, CardContent } from "@mui/material";
import { ExpandMore, Assignment, School } from "@mui/icons-material";

const PlanAccompagnement = () => {
  // Données simulées pour le Plan d'Accompagnement Personnalisé (PAP)
  const papData = {
    objectives: [
      "Amélioration de la compréhension orale",
      "Renforcement des compétences en lecture",
      "Développement des capacités d'expression écrite",
    ],
    resources: [
      "Aides visuelles et auditives",
      "Supports d'apprentissage personnalisés",
      "Séances de renforcement avec l'orthophoniste",
    ],
    followUp: [
      "Suivi mensuel avec l'orthophoniste",
      "Bilan annuel avec l'équipe éducative",
    ],
  };

  // Données simulées pour le Plan Personnalisé de Réussite Educative (PPRE)
  const ppreData = {
    educationalGoals: [
      "Réduire le décrochage scolaire",
      "Renforcer l'autonomie dans les apprentissages",
      "Améliorer la gestion du stress en contexte scolaire",
    ],
    pedagogicalMeasures: [
      "Accompagnement en petits groupes",
      "Aménagement des horaires de travail",
      "Adaptation des évaluations",
    ],
    assessment: [
      "Évaluation mensuelle des progrès",
      "Bilan semestriel avec l'équipe pédagogique",
    ],
  };

  // States pour gérer l'affichage du PAP et PPRE
  const [openPAP, setOpenPAP] = useState(false);
  const [openPPRE, setOpenPPRE] = useState(false);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 3, textAlign: "center" ,padding: 3}}>
        Plans d'Accompagnement
      </Typography>

      {/* Section PAP */}
      <Grid container spacing={2} sx={{ marginBottom: 3 }} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 3, cursor: "pointer", backgroundColor: "#5BA8B4" }}>
            <CardContent sx={{ textAlign: "center", color: "#fff" }}>
              <IconButton onClick={() => setOpenPAP(!openPAP)}>
                <Assignment sx={{ fontSize: 40, color: "#fff" }} />
              </IconButton>
              <Typography variant="h6" sx={{ marginTop: 1 }}>
                Plan d'Accompagnement Personnalisé (PAP)
              </Typography>
            </CardContent>
          </Card>
          <Collapse in={openPAP}>
            <Paper sx={{ padding: 2, marginTop: 2, bgcolor: "#FFFFFF", boxShadow: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Objectifs
              </Typography>
              {papData.objectives.map((objective, index) => (
                <Typography key={index} variant="body1" sx={{ marginTop: 1 }}>
                  - {objective}
                </Typography>
              ))}
              <Typography variant="h6" sx={{ fontWeight: "bold", marginTop: 2 }}>
                Ressources nécessaires
              </Typography>
              {papData.resources.map((resource, index) => (
                <Typography key={index} variant="body1" sx={{ marginTop: 1 }}>
                  - {resource}
                </Typography>
              ))}
              <Typography variant="h6" sx={{ fontWeight: "bold", marginTop: 2 }}>
                Suivi et évaluation
              </Typography>
              {papData.followUp.map((follow, index) => (
                <Typography key={index} variant="body1" sx={{ marginTop: 1 }}>
                  - {follow}
                </Typography>
              ))}
            </Paper>
          </Collapse>
        </Grid>

        {/* Section PPRE */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 3, cursor: "pointer", backgroundColor: "#5BA8B4" }}>
            <CardContent sx={{ textAlign: "center", color: "#fff" }}>
              <IconButton onClick={() => setOpenPPRE(!openPPRE)}>
                <School sx={{ fontSize: 40, color: "#fff" }} />
              </IconButton>
              <Typography variant="h6" sx={{ marginTop: 1 }}>
                Plan Personnalisé de Réussite Educative (PPRE)
              </Typography>
            </CardContent>
          </Card>
          <Collapse in={openPPRE}>
            <Paper sx={{ padding: 2, marginTop: 2, bgcolor: "#FFFFFF", boxShadow: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Objectifs éducatifs
              </Typography>
              {ppreData.educationalGoals.map((goal, index) => (
                <Typography key={index} variant="body1" sx={{ marginTop: 1 }}>
                  - {goal}
                </Typography>
              ))}
              <Typography variant="h6" sx={{ fontWeight: "bold", marginTop: 2 }}>
                Mesures pédagogiques
              </Typography>
              {ppreData.pedagogicalMeasures.map((measure, index) => (
                <Typography key={index} variant="body1" sx={{ marginTop: 1 }}>
                  - {measure}
                </Typography>
              ))}
              <Typography variant="h6" sx={{ fontWeight: "bold", marginTop: 2 }}>
                Évaluation et suivi
              </Typography>
              {ppreData.assessment.map((evaluate, index) => (
                <Typography key={index} variant="body1" sx={{ marginTop: 1 }}>
                  - {evaluate}
                </Typography>
              ))}
            </Paper>
          </Collapse>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlanAccompagnement;
