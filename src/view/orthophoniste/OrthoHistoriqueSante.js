import React, { useState, useEffect,useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const HistoriqueSante = () => {
  const { userId } = useParams();
  const documentIdRef = useRef(null);
  const initialFormData = {
    antecedentsMedicaux: "",
    antecedentsFamiliaux: "",
    suiviEnCours: "",
    developpementAlimentation: "",
    difficulteAliments: "",
    respireBoucheOuverte: false,
    fatigueMatin: false,
    sucePouceTetine: false,
    ronflement: false,
    activitesExtrascolaires: "",
    tempsEcran: "",
  };

  const labels = {
    antecedentsMedicaux: "Antécédents médicaux",
    antecedentsFamiliaux: "Antécédents familiaux",
    suiviEnCours: "Suivi médical en cours",
    developpementAlimentation: "Développement de l’alimentation",
    difficulteAliments: "Difficultés au contact de certains aliments",
    respireBoucheOuverte: "Respire la bouche ouverte",
    fatigueMatin: "Fatigue le matin",
    sucePouceTetine: "Sucer le pouce ou une tétine",
    ronflement: "Ronflement",
    activitesExtrascolaires: "Activités extrascolaires",
    tempsEcran: "Temps quotidien passé devant les écrans",
  };

  const [formData, setFormData] = useState(initialFormData);


  useEffect(() => {
    const fetchHistoriqueSante = async () => {
      try {
        const userDocResponse = await fetch(
          `https://localhost:5000/api/user-documents?userId=${userId}&documentType=HistoriqueSante`
        );
        const userDocData = await userDocResponse.json();
        if (userDocData && userDocData[0].documentId) {
          documentIdRef.current=userDocData[0].id;
          const historiqueSanteResponse = await fetch(
            `https://localhost:5000/api/historique-sante/${userDocData[0].documentId}`
          );
          const historiqueSanteData = await historiqueSanteResponse.json();
          if (historiqueSanteData) {
            setFormData({
              ...initialFormData,
              ...historiqueSanteData,
            });
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'historique sante:", error);
      }
    };

    fetchHistoriqueSante();
  }, [userId]);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Afficher les données dans la console pour vérifier que tout est bien collecté
      console.log(formData);
  
      // Envoi des données au backend
      const response = await fetch('https://localhost:5000/api/historique-sante', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Envoyer toutes les données du formulaire
      });
      
      const historiqueSanteData = await response.json();
      if (historiqueSanteData) {
        console.log("Historique Sante ajoutée avec succès", historiqueSanteData);
        var id=0;  
        
        if(documentIdRef.current){
            id=documentIdRef.current;
          }
          console.log("document id "+id);
          console.log("l'histot id "+historiqueSanteData.id);
        // 2. Ajouter le user_document après avoir obtenu l'ID de l'anamnèse
        const userDocumentResponse = await fetch('https://localhost:5000/api/user-documents', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id:id,
              userId: userId, // Assure-toi que userId est valide et non 0
              documentId: historiqueSanteData.id, // Assure-toi que anamneseData.id est correct
              documentName: 'HistoriqueSante.pdf',
              documentType: 'HistoriqueSante',
              isPublic: false,
              updatedBy: localStorage.getItem('orthoId'), //à changer avec l'id de celui qui est logé
            }),
          });
      
          // Vérifier le type de contenu renvoyé par le serveur
          const contentType = userDocumentResponse.headers.get('content-type');
      
          if (contentType && contentType.includes('application/json')) {
            // Si la réponse est au format JSON
            const userDocumentData = await userDocumentResponse.json();
            console.log("Document utilisateur ajouté avec succès", userDocumentData);
          } else {
            // Si la réponse est du texte (par exemple "Document enregistré avec succès")
            const successMessage = await userDocumentResponse.text();
            console.log("Réponse du serveur : ", successMessage);
          }
        }
      // Vérifier la réponse du backend
      const contentType = response.headers.get('content-type');
  
      if (contentType && contentType.includes('application/json')) {
        // Si la réponse est au format JSON, on la parse
        alert("Historique de santé enregistré avec succès !");
      } else {
        // Si c'est du texte (ex. "Document enregistré avec succès")
        const text = await response.text();
        console.log("Message du serveur : ", text);
        alert("Historique de santé enregistré avec succès !");
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire :", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  };
  
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
        Historique de Santé
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Antécédents médicaux */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Antécédents Médicaux</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                name="antecedentsMedicaux"
                value={formData.antecedentsMedicaux}
                onChange={handleInputChange}
                label={labels.antecedentsMedicaux}
                variant="outlined"
                multiline
                rows={4}
              />
              <TextField
                fullWidth
                name="antecedentsFamiliaux"
                value={formData.antecedentsFamiliaux}
                onChange={handleInputChange}
                label={labels.antecedentsFamiliaux}
                variant="outlined"
                multiline
                rows={4}
              />
              <TextField
                fullWidth
                name="suiviEnCours"
                value={formData.suiviEnCours}
                onChange={handleInputChange}
                label={labels.suiviEnCours}
                variant="outlined"
                multiline
                rows={4}
              />
            </Box>
          </AccordionDetails>
        </Accordion>
        {/* Développement et difficultés alimentaires */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Développement et Alimentation</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                name="developpementAlimentation"
                value={formData.developpementAlimentation}
                onChange={handleInputChange}
                label={labels.developpementAlimentation}
                variant="outlined"
                multiline
                rows={4}
              />
              <TextField
                fullWidth
                name="difficulteAliments"
                value={formData.difficulteAliments}
                onChange={handleInputChange}
                label={labels.difficulteAliments}
                variant="outlined"
                multiline
                rows={4}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Comportements et habitudes */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Comportements et Habitudes</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ my: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.respireBoucheOuverte}
                    onChange={handleInputChange}
                    name="respireBoucheOuverte"
                  />
                }
                label={labels.respireBoucheOuverte}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.fatigueMatin}
                    onChange={handleInputChange}
                    name="fatigueMatin"
                  />
                }
                label={labels.fatigueMatin}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.sucePouceTetine}
                    onChange={handleInputChange}
                    name="sucePouceTetine"
                  />
                }
                label={labels.sucePouceTetine}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.ronflement}
                    onChange={handleInputChange}
                    name="ronflement"
                  />
                }
                label={labels.ronflement}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Activités extrascolaires et temps d'écran */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Activités et Temps d'Écran</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                name="activitesExtrascolaires"
                value={formData.activitesExtrascolaires}
                onChange={handleInputChange}
                label={labels.activitesExtrascolaires}
                variant="outlined"
                multiline
                rows={4}
              />
              <TextField
                fullWidth
                name="tempsEcran"
                value={formData.tempsEcran}
                onChange={handleInputChange}
                label={labels.tempsEcran}
                variant="outlined"
                multiline
                rows={4}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        <Button variant="contained" type="submit">
          Enregistrer
        </Button>
      </form>
    </Box>
  );
};

export default HistoriqueSante;