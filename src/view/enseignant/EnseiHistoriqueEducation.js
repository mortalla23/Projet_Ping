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
import { toast, ToastContainer } from "react-toastify";

const HistoriqueEducation = () => {
  const { userId } = useParams();
  const documentIdRef = useRef(null);
  const initialFormData = {
    nom: "",
    prenom: "",
    dateNaissance: "",
    niveauScolaire: "",
    dominant: "",
    situationFamiliale: "",
    difficulteLangage: "",
    bilanOrthophonique: false,
    dateObservationDifficultes: "",
    conscienceDifficultes: false,
    souffranceDifficultes: "",
    apprentissageLectureEcritureFacile: false,
    apprecieLecture: false,
    apprecieCalcul: false,
    soutienScolaire: "",
    matieresProblematique: "",
  };

  const labels = {
    nom: "Nom",
    prenom: "Prénom",
    dateNaissance: "Date de naissance",
    niveauScolaire: "Niveau Scolaire",
    dominant: "Droitier ou Gaucher",
    situationFamiliale: "Situation Familiale",
    difficulteLangage: "Difficultés dans le langage",
    bilanOrthophonique: "Bilan orthophonique réalisé",
    dateObservationDifficultes: "Date d'observation des difficultés",
    conscienceDifficultes: "Conscience des difficultés",
    souffranceDifficultes: "Souffrance exprimée",
    apprentissageLectureEcritureFacile: "Lecture/écriture apprise facilement",
    apprecieLecture: "Aime lire",
    apprecieCalcul: "Aime compter",
    soutienScolaire: "Soutien scolaire",
    matieresProblematique: "Matières problématiques",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
      const fetchHistoriqueEducation = async () => {
        try {
          const userDocResponse = await fetch(
            `http://localhost:5000/api/user-documents?userId=${userId}&documentType=HistoriqueEducation`,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // ou sessionStorage
                'Content-Type': 'application/json',
              },
            }
          );
          const userDocData = await userDocResponse.json();
          if (userDocData && userDocData[0].documentId) {
            documentIdRef.current=userDocData[0].id;
            const historiqueEducationResponse = await fetch(
              `http://localhost:5000/api/historique-education/${userDocData[0].documentId}`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`, // ou sessionStorage
                  'Content-Type': 'application/json',
                },
              }
            );
            const historiqueEducationData = await historiqueEducationResponse.json();
            if (historiqueEducationData) {
              setFormData({
                ...initialFormData,
                ...historiqueEducationData,
              });
            }
          }
        } catch (error) {
          console.error("Erreur lors du chargement de l'historique education:", error);
        }
      };
  
      fetchHistoriqueEducation();
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
      const response = await fetch('http://localhost:5000/api/historique-education', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // ou sessionStorage
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Envoyer toutes les données du formulaire
      });
      
      const historiqueEducationData = await response.json();
      if (historiqueEducationData) {
        console.log("Historique Education ajoutée avec succès", historiqueEducationData);
        var id=0;  
        
        if(documentIdRef.current){
            id=documentIdRef.current;
          }
          console.log("document id "+id);
          console.log("l'histot id "+historiqueEducationData.id);
        // 2. Ajouter le user_document après avoir obtenu l'ID de l'anamnèse
        const userDocumentResponse = await fetch('http://localhost:5000/api/user-documents', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`, // ou sessionStorage
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id:id,
              userId: userId, // Assure-toi que userId est valide et non 0
              documentId: historiqueEducationData.id, // Assure-toi que anamneseData.id est correct
              documentName: 'HistoriqueEducation.pdf',
              documentType: 'HistoriqueEducation',
              isPublic: false,
              updatedBy: localStorage.getItem('teacherId'), //à changer avec l'id de celui qui est logé
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
        toast.success("Historique de education enregistré avec succès !");
      } else {
        // Si c'est du texte (ex. "Document enregistré avec succès")
        const text = await response.text();
        console.log("Message du serveur : ", text);
        toast.success("Historique de education enregistré avec succès !");
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire :", error);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    }
  };
  return (
    <Box sx={{ padding: 3 }}>
      <ToastContainer />
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
        Historique éducation
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Informations Personnelles */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Informations personnelles</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                label={labels.nom}
                variant="outlined"
              />
              <TextField
                fullWidth
                name="prenom"
                value={formData.prenom}
                onChange={handleInputChange}
                label={labels.prenom}
                variant="outlined"
              />
              <TextField
                fullWidth
                name="dateNaissance"
                value={formData.dateNaissance}
                onChange={handleInputChange}
                label={labels.dateNaissance}
                variant="outlined"
                type="date"
              />
              <TextField
                fullWidth
                name="niveauScolaire"
                value={formData.niveauScolaire}
                onChange={handleInputChange}
                label={labels.niveauScolaire}
                variant="outlined"
              />
              <TextField
                fullWidth
                name="dominant"
                value={formData.dominant}
                onChange={handleInputChange}
                label={labels.dominant}
                variant="outlined"
              />
              <TextField
                fullWidth
                name="situationFamiliale"
                value={formData.situationFamiliale}
                onChange={handleInputChange}
                label={labels.situationFamiliale}
                variant="outlined"
                multiline
                rows={2}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Difficultés et Bilan Orthophonique */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Difficultés et bilan orthophonique</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                name="difficulteLangage"
                value={formData.difficulteLangage}
                onChange={handleInputChange}
                label={labels.difficulteLangage}
                variant="outlined"
                multiline
                rows={4}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.bilanOrthophonique}
                    onChange={handleInputChange}
                    name="bilanOrthophonique"
                  />
                }
                label={labels.bilanOrthophonique}
              />
              <TextField
                fullWidth
                name="dateObservationDifficultes"
                value={formData.dateObservationDifficultes}
                onChange={handleInputChange}
                label={labels.dateObservationDifficultes}
                variant="outlined"
                type="date"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.conscienceDifficultes}
                    onChange={handleInputChange}
                    name="conscienceDifficultes"
                  />
                }
                label={labels.conscienceDifficultes}
              />
              <TextField
                fullWidth
                name="souffranceDifficultes"
                value={formData.souffranceDifficultes}
                onChange={handleInputChange}
                label={labels.souffranceDifficultes}
                variant="outlined"
                multiline
                rows={2}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Apprentissage et Appréciation */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Apprentissage et appréciation</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ my: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.apprentissageLectureEcritureFacile}
                    onChange={handleInputChange}
                    name="apprentissageLectureEcritureFacile"
                  />
                }
                label={labels.apprentissageLectureEcritureFacile}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.apprecieLecture}
                    onChange={handleInputChange}
                    name="apprecieLecture"
                  />
                }
                label={labels.apprecieLecture}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.apprecieCalcul}
                    onChange={handleInputChange}
                    name="apprecieCalcul"
                  />
                }
                label={labels.apprecieCalcul}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Soutien Scolaire et Matières Problématiques */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Soutien scolaire et matières problématiques</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                name="soutienScolaire"
                value={formData.soutienScolaire}
                onChange={handleInputChange}
                label={labels.soutienScolaire}
                variant="outlined"
                multiline
                rows={3}
              />
              <TextField
                fullWidth
                name="matieresProblematique"
                value={formData.matieresProblematique}
                onChange={handleInputChange}
                label={labels.matieresProblematique}
                variant="outlined"
                multiline
                rows={3}
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

export default HistoriqueEducation;