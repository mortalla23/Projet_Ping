import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
} from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const EnseiHistorique = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    dateNaissance: '',
    niveauScolaire: '',
    mainDominante: '',
    situationFamiliale: '',
    difficulteCommunication: '',
    bilanOrthophonique: '',
    dureeDifficultes: '',
    conscienceDifficulte: '',
    souffrance: '',
    apprentissageLecture: '',
    aimeLire: '',
    aimeCompter: '',
    soutienScolaire: '',
    matieresProblématiques: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Fonction pour envoyer les données du formulaire au backend
  const handleSubmit = async () => {
  try {
    // Récupère l'ID de l'utilisateur connecté depuis localStorage
    const userId = localStorage.getItem('teacherId'); // Change 'userId' en fonction de la clé utilisée
    if (!userId) {
      toast.error("Utilisateur non connecté !");
      return;
    }

    // Créer l'objet à envoyer au backend
    const requestData = {
      userId,  // Utilise l'ID récupéré
      documentName: "Dossier de l'historique",  // Nom du document
      documentType: "Education",  // Exemple de type de document (peut être dynamique)
      isPublic: true,  // Indique si le document est public
      updatedBy: "admin",  // Utilisateur qui met à jour (peut être dynamique)
      ...formData,  // Les autres champs du formulaire
    };
    console.log("Données envoyées au backend : ", requestData);
    // Ajoute des attributs spécifiques uniquement si "Education" et "Dossier de l'historique"
    if (requestData.documentType === "Education" && requestData.documentName === "Dossier de l'historique") {
      requestData.aimelire = formData.aimelire;
      requestData.apprentissageLecture = formData.apprentissageLecture;
      requestData.bilanOrthophonique = formData.bilanOrthophonique;
      // Ajouter d'autres attributs ici selon les besoins
    }
    // Envoi des données au backend via une requête POST
    const response = await axios.post('http://localhost:5000/api/user-documents', {headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // ou sessionStorage
      'Content-Type': 'application/json',
    },},requestData);

    if (response.status === 200) {
      console.log('Données envoyées avec succès:', response.data);
      toast.success('Formulaire soumis avec succès!');
    } else {
      console.error('Erreur lors de la soumission:', response.data);
      toast.error('Erreur lors de la soumission du formulaire');
    }
  } catch (error) {
    console.error('Erreur lors de l’envoi des données :', error);
    toast.error('Erreur lors de la soumission du formulaire');
  }
};
  return (
    <Box sx={{ padding: '20px' }}>
      <ToastContainer />
      <Typography variant="h5" gutterBottom>
        Formulaire de dossier
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Prénom"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Date de naissance"
            name="dateNaissance"
            value={formData.dateNaissance}
            onChange={handleChange}
            variant="outlined"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Niveau scolaire"
            name="niveauScolaire"
            value={formData.niveauScolaire}
            onChange={handleChange}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Choisissez la main dominante</InputLabel>
            <Select
              name="mainDominante"
              value={formData.mainDominante}
              onChange={handleChange}
              label="Choisissez la main dominante"
            >
              <MenuItem value="Droitier">Droitier</MenuItem>
              <MenuItem value="Gaucher">Gaucher</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Situation familiale"
            name="situationFamiliale"
            value={formData.situationFamiliale}
            onChange={handleChange}
            variant="outlined"
            multiline
            rows={2}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Difficultés dans le domaine du langage oral, écrit ou prérequis à la communication"
            name="difficulteCommunication"
            value={formData.difficulteCommunication}
            onChange={handleChange}
            variant="outlined"
            multiline
            rows={4}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Bilan orthophonique déjà réalisé"
            name="bilanOrthophonique"
            value={formData.bilanOrthophonique}
            onChange={handleChange}
            variant="outlined"
            multiline
            rows={2}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Depuis quand les difficultés ont-elles été observées ?"
            name="dureeDifficultes"
            value={formData.dureeDifficultes}
            onChange={handleChange}
            variant="outlined"
            multiline
            rows={2}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="La personne a-t-elle conscience de ses difficultés ?"
            name="conscienceDifficulte"
            value={formData.conscienceDifficulte}
            onChange={handleChange}
            variant="outlined"
            multiline
            rows={2}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Exprime-t-elle une souffrance à ce sujet ?"
            name="souffrance"
            value={formData.souffrance}
            onChange={handleChange}
            variant="outlined"
            multiline
            rows={2}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Votre enfant a-t-il appris à lire/écrire facilement ?"
            name="apprentissageLecture"
            value={formData.apprentissageLecture}
            onChange={handleChange}
            variant="outlined"
            multiline
            rows={2}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Aime-t-elle lire ?"
            name="aimeLire"
            value={formData.aimeLire}
            onChange={handleChange}
            variant="outlined"
            multiline
            rows={2}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Aime-t-elle compter ?"
            name="aimeCompter"
            value={formData.aimeCompter}
            onChange={handleChange}
            variant="outlined"
            multiline
            rows={2}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Bénéficie-t-elle d’un soutien scolaire ?"
            name="soutienScolaire"
            value={formData.soutienScolaire}
            onChange={handleChange}
            variant="outlined"
            multiline
            rows={2}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Certaines matières sont-elles plus problématiques que d’autres ? Si oui, lesquelles ?"
            name="matieresProblématiques"
            value={formData.matieresProblématiques}
            onChange={handleChange}
            variant="outlined"
            multiline
            rows={4}
          />
        </Grid>
      </Grid>

      <Box sx={{ marginTop: '20px' }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Soumettre
        </Button>
      </Box>
    </Box>
  );
};

export default EnseiHistorique;
