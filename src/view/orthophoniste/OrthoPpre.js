import React, { useState,useEffect,useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { toast, ToastContainer } from "react-toastify";

const Ppre = () => {
  const initialFormData = {
    objectifsEducatifs: "",
    mesuresPedagogiques: "",
    evaluationSuivi: "",
  };

  const labels = {
    objectifsEducatifs: "Objectifs Éducatifs",
    mesuresPedagogiques: "Mesures Pédagogiques",
    evaluationSuivi: "Évaluation et Suivi",
  };

  const [formData, setFormData] = useState(initialFormData);
  const { userId } = useParams();
  const documentIdRef = useRef(null);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

   useEffect(() => {
        const fetchPpre = async () => {
          try {
            const userDocResponse = await fetch(
              `http://localhost:5000/api/user-documents?userId=${userId}&documentType=PPRE`,{
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`, // ou sessionStorage
                  'Content-Type': 'application/json',
                },}
            );
            const userDocData = await userDocResponse.json();
            if (userDocData && userDocData[0].documentId) {
              documentIdRef.current=userDocData[0].id;
              console.log("userdoc Id: ",userDocData[0].documentId);
              const ppreResponse = await fetch(
                `http://localhost:5000/api/ppre/${userDocData[0].documentId}`,{
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // ou sessionStorage
                    'Content-Type': 'application/json',
                  },}
              );
              const ppreData = await ppreResponse.json();
              if (ppreData) {
                setFormData({
                  ...initialFormData,
                  ...ppreData,
                });
              }
            }
          } catch (error) {
            console.error("Erreur lors du chargement du ppre:", error);
          }
        };
    
        fetchPpre();
      }, [userId]);
    
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        // Afficher les données dans la console pour vérifier que tout est bien collecté
        console.log(formData);
    
        // Envoi des données au backend
        const response = await fetch('http://localhost:5000/api/ppre/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // ou sessionStorage
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData), // Envoyer toutes les données du formulaire
        });
        
        const ppreData = await response.json();
        if (ppreData) {
          console.log("PPre ajoutée avec succès", ppreData);
          var id=0;  
          
          if(documentIdRef.current){
              id=documentIdRef.current;
            }
            console.log("document id "+id);
            console.log("l'ppre id "+ppreData.id);
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
                documentId: ppreData.id, // Assure-toi que anamneseData.id est correct
                documentName: 'ppre.pdf',
                documentType: 'PPRE',
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
          toast.success("PPRE enregistré avec succès !");
        } else {
          // Si c'est du texte (ex. "Document enregistré avec succès")
          const text = await response.text();
          console.log("Message du serveur : ", text);
          toast.success("PPRE enregistré avec succès !");
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
        PPRE (Programme Personnalisé de Réussite Éducative)
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Objectifs éducatifs */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{labels.objectifsEducatifs}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                name="objectifsEducatifs"
                value={formData.objectifsEducatifs}
                onChange={handleInputChange}
                label={labels.objectifsEducatifs}
                variant="outlined"
                multiline
                rows={3}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Mesures pédagogiques */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{labels.mesuresPedagogiques}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                name="mesuresPedagogiques"
                value={formData.mesuresPedagogiques}
                onChange={handleInputChange}
                label={labels.mesuresPedagogiques}
                variant="outlined"
                multiline
                rows={3}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Évaluation et Suivi */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{labels.evaluationSuivi}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                name="evaluationSuivi"
                value={formData.evaluationSuivi}
                onChange={handleInputChange}
                label={labels.evaluationSuivi}
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

export default Ppre;