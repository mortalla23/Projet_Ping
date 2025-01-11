import React, { useState } from "react";
import { Box, Typography, TextField, Button, Grid, FormControlLabel, Checkbox } from "@mui/material";

const PatientAnamnèse = () => {
  const [formData, setFormData] = useState({
    consultationReason: "",
    healthDetails: {
      pregnancy: "",
      birth: "",
      weight: "",
      interventions: "",
      diseases: "",
      visualAcuity: "",
      auditoryAcuity: "",
    },
    development: {
      motorSkills: "",
      language: "",
      firstWords: "",
      firstSentences: "",
    },
    behavior: {
      autonomy: false,
      character: {
        confidence: false,
        calmness: false,
        sociability: false,
        emotionalExpression: false,
      },
    },
    family: {
      situation: "",
      siblings: "",
      personalRoom: "",
      commonMeals: "",
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleHealthChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      healthDetails: {
        ...prevData.healthDetails,
        [name]: value,
      },
    }));
  };

  const handleDevelopmentChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      development: {
        ...prevData.development,
        [name]: value,
      },
    }));
  };

  const handleBehaviorChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      behavior: {
        ...prevData.behavior,
        [name]: checked,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
        Anamnèse
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Motif de la Consultation */}
        <Box sx={{ my: 2 }}>
          <Typography variant="h6">Motif de la Consultation</Typography>
          <TextField
            fullWidth
            name="consultationReason"
            value={formData.consultationReason}
            onChange={handleInputChange}
            label="Motif"
            variant="outlined"
            sx={{ my: 1 }}
          />
        </Box>

        {/* Santé */}
        <Box sx={{ my: 2 }}>
          <Typography variant="h6">Santé</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="pregnancy"
                value={formData.healthDetails.pregnancy}
                onChange={handleHealthChange}
                label="Grossesse"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="birth"
                value={formData.healthDetails.birth}
                onChange={handleHealthChange}
                label="Naissance"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="weight"
                value={formData.healthDetails.weight}
                onChange={handleHealthChange}
                label="Poids"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="interventions"
                value={formData.healthDetails.interventions}
                onChange={handleHealthChange}
                label="Interventions"
                variant="outlined"
              />
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Bilans Complémentaires
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="visualAcuity"
                value={formData.healthDetails.visualAcuity}
                onChange={handleHealthChange}
                label="Acuité visuelle"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="auditoryAcuity"
                value={formData.healthDetails.auditoryAcuity}
                onChange={handleHealthChange}
                label="Acuité auditive"
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Développement Psychomoteur */}
        <Box sx={{ my: 2 }}>
          <Typography variant="h6">Développement Psychomoteur</Typography>
          <TextField
            fullWidth
            name="motorSkills"
            value={formData.development.motorSkills}
            onChange={handleDevelopmentChange}
            label="Posture Assise"
            variant="outlined"
            sx={{ my: 1 }}
          />
          <TextField
            fullWidth
            name="language"
            value={formData.development.language}
            onChange={handleDevelopmentChange}
            label="Marche 4 pattes"
            variant="outlined"
            sx={{ my: 1 }}
          />
        </Box>

        {/* Développement du Langage */}
        <Box sx={{ my: 2 }}>
          <Typography variant="h6">Développement du Langage</Typography>
          <TextField
            fullWidth
            name="firstWords"
            value={formData.development.firstWords}
            onChange={handleDevelopmentChange}
            label="1ers Mots"
            variant="outlined"
            sx={{ my: 1 }}
          />
          <TextField
            fullWidth
            name="firstSentences"
            value={formData.development.firstSentences}
            onChange={handleDevelopmentChange}
            label="Premières Phrases"
            variant="outlined"
            sx={{ my: 1 }}
          />
        </Box>

        {/* Autonomie et Comportement */}
        <Box sx={{ my: 2 }}>
          <Typography variant="h6">Autonomie et Comportement</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.behavior.autonomy}
                onChange={handleBehaviorChange}
                name="autonomy"
              />
            }
            label="Se lave seul"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.behavior.character.confidence}
                onChange={handleBehaviorChange}
                name="confidence"
              />
            }
            label="Confiance en lui/elle"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.behavior.character.calmness}
                onChange={handleBehaviorChange}
                name="calmness"
              />
            }
            label="Calme"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.behavior.character.sociability}
                onChange={handleBehaviorChange}
                name="sociability"
              />
            }
            label="Sociable"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.behavior.character.emotionalExpression}
                onChange={handleBehaviorChange}
                name="emotionalExpression"
              />
            }
            label="Émotif/ve"
          />
        </Box>

        {/* Situation Familiale */}
        <Box sx={{ my: 2 }}>
          <Typography variant="h6">Situation Familiale</Typography>
          <TextField
            fullWidth
            name="situation"
            value={formData.family.situation}
            onChange={handleInputChange}
            label="Situation familiale"
            variant="outlined"
            sx={{ my: 1 }}
          />
          <TextField
            fullWidth
            name="commonMeals"
            value={formData.family.commonMeals}
            onChange={handleInputChange}
            label="Repas en commun"
            variant="outlined"
            sx={{ my: 1 }}
          />
        </Box>

        {/* Submit Button */}
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" type="submit">Enregistrer</Button>
        </Box>
      </form>
    </Box>
  );
};

export default PatientAnamnèse;
