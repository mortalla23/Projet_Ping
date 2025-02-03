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
  Autocomplete,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const PatientAnamnèse = () => {
  const userId= localStorage.getItem('patientId');
  const documentIdRef = useRef(null);
  const initialFormData = {
    consultationDemandePar: null,
    motifConsultation: null,
    partageInfosEquipePedagogique: false,
    partageInfosAutresSoignants: false,
    suiviOrthophonie: false,
    suiviOrthophonieDetails: null,
    grossesse: "Normale",
    naissanceATerme: false,
    poidsNaissance: 0,
    perimetreCranien: 0,
    interventionVegetations: false,
    interventionAutres: null,
    interventionAmygdales: false,
    hospitalisations: false,
    hospitalisationsDetails: null,
    angines: false,
    rhinoPharyngites: false,
    otites: false,
    asthme: false,
    bronchites: false,
    problemePulmonaires: false,
    allergies: false,
    allergiesDetails: "",
    autresMaladies: "",
    bilansAcuiteVisuelle: false,
    bilansAcuiteVisuelleDate: null,
    bilansAcuiteAuditive: false,
    bilansAcuiteAuditiveDate: null,
    autresBilans: null,
    postureAssiseDateAge: null,
    marcheQuatrePattesDateAge: null,
    marcheDateAge: null,
    propreJourDateAge: null,
    propreNuitDateAge: null,
    premiersMotsDateAge: null,
    premieresPhrasesDateAge: null,
    difficulteSignalees: null,
    habilleSeul: false,
    laveSeul: false,
    sucePouceTetine: false,
    jouetPeluchePourDormir: false,
    caractereVolontaire: false,
    caractereSeDecourage: false,
    caractereAnxieux: false,
    caractereNerveux: false,
    caractereAgite: false,
    caractereCalme: false,
    caractereTimide: false,
    caractereConfiance: false,
    caractereRapide: false,
    caractereLent: false,
    caractereRongeOngles: false,
    caractereTics: false,
    caractereSociable: false,
    caractereServiable: false,
    caractereCalin: false,
    caractereEmotif: false,
    caractereSensible: false,
    caractereJaloux: false,
    caractereRaconteFacilement: false,
    caractereAutres: null,
    situationFamiliale: null,
    freres: "1",
    soeurs: "1",
    chambrePartagee: false,
    repasCommuns: null,
    activitesExtrascolaires: false,
    activitesExtrascolairesDetails: null,
    activitesPreferees: null,
  };

  const labels = {
    consultationDemandePar: "Consultation demandée par",
    motifConsultation: "Motif de la consultation",
    partageInfosEquipePedagogique: "Partage d'informations avec l'équipe pédagogique",
    partageInfosAutresSoignants: "Partage d'informations avec d'autres soignants",
    suiviOrthophonie: "Suivi orthophonie",
    suiviOrthophonieDetails: "Détails du suivi orthophonie",
    grossesse: "Grossesse",
    naissanceATerme: "Naissance à terme",
    poidsNaissance: "Poids à la naissance (en g)",
    perimetreCranien: "Périmètre crânien (en cm)",
    interventionVegetations: "Intervention pour végétations",
    interventionAutres: "Autres interventions",
    interventionAmygdales: "Intervention pour amygdales",
    hospitalisations: "Hospitalisations",
    hospitalisationsDetails: "Détails des hospitalisations",
    angines: "Angines",
    rhinoPharyngites: "Rhino-pharyngites",
    otites: "Otites",
    asthme: "Asthme",
    bronchites: "Bronchites",
    problemePulmonaires: "Problèmes pulmonaires",
    allergies: "Allergies",
    allergiesDetails: "Précisez les allergies",
    autresMaladies: "Autres maladies",
    bilansAcuiteVisuelle: "Bilan de l'acuité visuelle",
    bilansAcuiteVisuelleDate: "Date du bilan de l'acuité visuelle",
    bilansAcuiteAuditive: "Bilan de l'acuité auditive",
    bilansAcuiteAuditiveDate: "Date du bilan de l'acuité auditive",
    autresBilans: "Autres bilans",
    postureAssiseDateAge: "Posture assise (date/âge)",
    marcheQuatrePattesDateAge: "Marche à quatre pattes (date/âge)",
    marcheDateAge: "Date d'apprentissage de la marche",
    propreJourDateAge: "Propreté de jour (date/âge)",
    propreNuitDateAge: "Propreté de nuit (date/âge)",
    premiersMotsDateAge: "Premiers mots (date/âge)",
    premieresPhrasesDateAge: "Premières phrases (date/âge)",
    difficulteSignalees: "Difficultés signalées",
    habilleSeul: "S'habille seul",
    laveSeul: "Se lave seul",
    sucePouceTetine: "Sucer le pouce ou la tétine",
    jouetPeluchePourDormir: "Jouet ou peluche pour dormir",
    caractereVolontaire: "Caractère volontaire",
    caractereSeDecourage: "Caractère se décourage facilement",
    caractereAnxieux: "Caractère anxieux",
    caractereNerveux: "Caractère nerveux",
    caractereAgite: "Caractère agité",
    caractereCalme: "Caractère calme",
    caractereTimide: "Caractère timide",
    caractereConfiance: "Caractère confiant",
    caractereRapide: "Caractère rapide",
    caractereLent: "Caractère lent",
    caractereRongeOngles: "Ronger les ongles",
    caractereTics: "Tics",
    caractereSociable: "Caractère sociable",
    caractereServiable: "Caractère serviable",
    caractereCalin: "Caractère câlin",
    caractereEmotif: "Caractère émotif",
    caractereSensible: "Caractère sensible",
    caractereJaloux: "Caractère jaloux",
    caractereRaconteFacilement: "Raconte facilement",
    caractereAutres: "Autres caractères",
    situationFamiliale: "Situation familiale",
    freres: "Nombre de frères",
    soeurs: "Nombre de sœurs",
    chambrePartagee: "Chambre partagée",
    repasCommuns: "Repas communs",
    activitesExtrascolaires: "Activités extrascolaires",
    activitesExtrascolairesDetails: "Détails des activités extrascolaires",
    activitesPreferees: "Activités préférées",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [expanded, setExpanded] = useState(false);
 // const [selectedCaracteres, setSelectedCaracteres] = useState([]);
  
  // Liste des caractères prédéfinis
  const caracteresOptions = [
    "Volontaire",
    "Se décourage facilement",
    "Anxieux",
    "Nerveux",
    "Agité",
    "Calme",
    "Timide",
    "Confiant",
    "Rapide",
    "Lent",
    "Ronge les ongles",
    "Tics",
    "Sociable",
    "Serviable",
    "Câlin",
    "Émotif",
    "Sensible",
    "Jaloux",
    "Raconte facilement",
  ];

  useEffect(() => {
    const fetchAnamnese = async () => {
      try {
        const userDocResponse = await fetch(
          `http://localhost:5000/api/user-documents?userId=${userId}&documentType=Anamnese`,{
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`, // ou sessionStorage
              'Content-Type': 'application/json',
            },}
        );
        const userDocData = await userDocResponse.json();
        if (userDocData && userDocData[0].documentId) {
          documentIdRef.current=userDocData[0].id;
          const anamneseResponse = await fetch(
            `http://localhost:5000/api/anamnese/${userDocData[0].documentId}`,{
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // ou sessionStorage
                'Content-Type': 'application/json',
              },}
          );
          const anamneseData = await anamneseResponse.json();
          if (anamneseData) {
            setFormData({
              ...initialFormData,
              ...anamneseData,
            });
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'anamnèse:", error);
      }
    };

    fetchAnamnese();
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
      // Envoi de la demande d'anamnèse
    const anamneseResponse = await fetch('http://localhost:5000/api/anamnese/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // ou sessionStorage
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Envoyer les données de l'anamnèse en JSON
      });
      const anamneseData = await anamneseResponse.json();
  
      if (anamneseData) {
        console.log("Anamnèse ajoutée avec succès", anamneseData);
        var id=0;  
        
        if(documentIdRef.current){
            id=documentIdRef.current;
          }
          console.log("document id "+id);
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
              documentId: anamneseData.id, // Assure-toi que anamneseData.id est correct
              documentName: 'Anamnese.pdf',
              documentType: 'Anamnese',
              isPublic: false,
              updatedBy: localStorage.getItem('patientId'),
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
    } catch (error) {
      console.error('Erreur lors du traitement du formulaire:', error);
    }
  };
  

  const handleAutocompleteChange = (event, value) => {
    // Réinitialiser tous les caractères à false
    const updatedFormData = {
      ...formData,
      caractereVolontaire: false,
      caractereSeDecourage: false,
      caractereAnxieux: false,
      caractereNerveux: false,
      caractereAgite: false,
      caractereCalme: false,
      caractereTimide: false,
      caractereConfiance: false,
      caractereRapide: false,
      caractereLent: false,
      caractereRongeOngles: false,
      caractereTics: false,
      caractereSociable: false,
      caractereServiable: false,
      caractereCalin: false,
      caractereEmotif: false,
      caractereSensible: false,
      caractereJaloux: false,
      caractereRaconteFacilement: false,
    };
  
    // Mettre à jour les caractères choisis à true
    value.forEach((caractere) => {
      updatedFormData[`caractere${caractere}`] = true;
    });
  
    setFormData(updatedFormData);
  };
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
        Anamnèse
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Informations générales */}
        <Accordion
          expanded={expanded === 'panel1'}
          onChange={handleAccordionChange('panel1')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Informations générales</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                name="consultationDemandePar"
                value={formData.consultationDemandePar || ""}
                onChange={handleInputChange}
                label={labels.consultationDemandePar}
                variant="outlined"
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                name="motifConsultation"
                value={formData.motifConsultation || ""}
                onChange={handleInputChange}
                label={labels.motifConsultation}
                variant="outlined"
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.partageInfosEquipePedagogique || false}
                    onChange={handleInputChange}
                    name="partageInfosEquipePedagogique"
                  />
                }
                label={labels.partageInfosEquipePedagogique}
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.partageInfosAutresSoignants || false}
                    onChange={handleInputChange}
                    name="partageInfosAutresSoignants"
                  />
                }
                label={labels.partageInfosAutresSoignants}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Santé */}
        <Accordion
          expanded={expanded === 'panel2'}
          onChange={handleAccordionChange('panel2')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Santé</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                name="grossesse"
                value={formData.grossesse || ""}
                onChange={handleInputChange}
                label={labels.grossesse}
                variant="outlined"
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.naissanceATerme || false}
                    onChange={handleInputChange}
                    name="naissanceATerme"
                  />
                }
                label={labels.naissanceATerme}
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                name="poidsNaissance"
                value={formData.poidsNaissance || ""}
                onChange={handleInputChange}
                label={labels.poidsNaissance}
                variant="outlined"
                type="number"
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                name="perimetreCranien"
                value={formData.perimetreCranien || ""}
                onChange={handleInputChange}
                label={labels.perimetreCranien}
                variant="outlined"
                type="number"
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.interventionVegetations || false}
                    onChange={handleInputChange}
                    name="interventionVegetations"
                  />
                }
                label={labels.interventionVegetations}
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                name="interventionAutres"
                value={formData.interventionAutres || ""}
                onChange={handleInputChange}
                label={labels.interventionAutres}
                variant="outlined"
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.interventionAmygdales || false}
                    onChange={handleInputChange}
                    name="interventionAmygdales"
                  />
                }
                label={labels.interventionAmygdales}
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.hospitalisations || false}
                    onChange={handleInputChange}
                    name="hospitalisations"
                  />
                }
                label={labels.hospitalisations}
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                name="hospitalisationsDetails"
                value={formData.hospitalisationsDetails || ""}
                onChange={handleInputChange}
                label={labels.hospitalisationsDetails}
                variant="outlined"
              />
            </Box>
          </AccordionDetails>
        </Accordion>
 {/* Maladies */}
 <Accordion
          expanded={expanded === 'panel7'}
          onChange={handleAccordionChange('panel7')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Maladies</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ my: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.angines || false}
                    onChange={handleInputChange}
                    name="angines"
                  />
                }
                label={labels.angines}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.rhinoPharyngites || false}
                    onChange={handleInputChange}
                    name="rhinoPharyngites"
                  />
                }
                label={labels.rhinoPharyngites}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.otites || false}
                    onChange={handleInputChange}
                    name="otites"
                  />
                }
                label={labels.otites}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.asthme || false}
                    onChange={handleInputChange}
                    name="asthme"
                  />
                }
                label={labels.asthme}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.bronchites || false}
                    onChange={handleInputChange}
                    name="bronchites"
                  />
                }
                label={labels.bronchites}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.problemePulmonaires || false}
                    onChange={handleInputChange}
                    name="problemePulmonaires"
                  />
                }
                label={labels.problemePulmonaires}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.allergies || false}
                    onChange={handleInputChange}
                    name="allergies"
                  />
                }
                label={labels.allergies}
              />
              {formData.allergies && (
                <TextField
                  fullWidth
                  name="allergiesDetails"
                  value={formData.allergiesDetails || ""}
                  onChange={handleInputChange}
                  label={labels.allergiesDetails}
                  variant="outlined"
                />
              )}
              <Box sx={{ my: 2 }}>
                <TextField
                  fullWidth
                  name="autresMaladies"
                  value={formData.autresMaladies || ""}
                  onChange={handleInputChange}
                  label={labels.autresMaladies}
                  variant="outlined"
                  multiline
                  rows={4}
                />
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
        {/* Bilans */}
        <Accordion
          expanded={expanded === 'panel8'}
          onChange={handleAccordionChange('panel8')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Bilans</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ my: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.bilansAcuiteVisuelle || false}
                    onChange={handleInputChange}
                    name="bilansAcuiteVisuelle"
                  />
                }
                label={labels.bilansAcuiteVisuelle}
              />
              <TextField
                fullWidth
                name="bilansAcuiteVisuelleDate"
                value={formData.bilansAcuiteVisuelleDate || ""}
                onChange={handleInputChange}
                label={labels.bilansAcuiteVisuelleDate}
                variant="outlined"
                type="date"
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.bilansAcuiteAuditive || false}
                    onChange={handleInputChange}
                    name="bilansAcuiteAuditive"
                  />
                }
                label={labels.bilansAcuiteAuditive}
              />
              <TextField
                fullWidth
                name="bilansAcuiteAuditiveDate"
                value={formData.bilansAcuiteAuditiveDate || ""}
                onChange={handleInputChange}
                label={labels.bilansAcuiteAuditiveDate}
                variant="outlined"
                type="date"
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                name="autresBilans"
                value={formData.autresBilans || ""}
                onChange={handleInputChange}
                label={labels.autresBilans}
                variant="outlined"
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Développement psychomoteur */}
        <Accordion
          expanded={expanded === 'panel3'}
          onChange={handleAccordionChange('panel3')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Développement psychomoteur</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                name="postureAssiseDateAge"
                value={formData.postureAssiseDateAge || ""}
                onChange={handleInputChange}
                label={labels.postureAssiseDateAge}
                variant="outlined"
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                name="marcheQuatrePattesDateAge"
                value={formData.marcheQuatrePattesDateAge || ""}
                onChange={handleInputChange}
                label={labels.marcheQuatrePattesDateAge}
                variant="outlined"
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                name="marcheDateAge"
                value={formData.marcheDateAge || ""}
                onChange={handleInputChange}
                label={labels.marcheDateAge}
                variant="outlined"
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                name="propreJourDateAge"
                value={formData.propreJourDateAge || ""}
                onChange={handleInputChange}
                label={labels.propreJourDateAge}
                variant="outlined"
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                name="propreNuitDateAge"
                value={formData.propreNuitDateAge || ""}
                onChange={handleInputChange}
                label={labels.propreNuitDateAge}
                variant="outlined"
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Développement du langage */}
        <Accordion
          expanded={expanded === 'panel4'}
          onChange={handleAccordionChange('panel4')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Développement du langage</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                name="premiersMotsDateAge"
                value={formData.premiersMotsDateAge || ""}
                onChange={handleInputChange}
                label={labels.premiersMotsDateAge}
                variant="outlined"
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                name="premieresPhrasesDateAge"
                value={formData.premieresPhrasesDateAge || ""}
                onChange={handleInputChange}
                label={labels.premieresPhrasesDateAge}
                variant="outlined"
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                name="difficulteSignalees"
                value={formData.difficulteSignalees || ""}
                onChange={handleInputChange}
                label={labels.difficulteSignalees}
                variant="outlined"
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Autonomie */}
        <Accordion
          expanded={expanded === 'panel5'}
          onChange={handleAccordionChange('panel5')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Autonomie</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ my: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.habilleSeul || false}
                    onChange={handleInputChange}
                    name="habilleSeul"
                  />
                }
                label={labels.habilleSeul}
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.laveSeul || false}
                    onChange={handleInputChange}
                    name="laveSeul"
                  />
                }
                label={labels.laveSeul}
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.sucePouceTetine || false}
                    onChange={handleInputChange}
                    name="sucePouceTetine"
                  />
                }
                label={labels.sucePouceTetine}
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.jouetPeluchePourDormir || false}
                    onChange={handleInputChange}
                    name="jouetPeluchePourDormir"
                  />
                }
                label={labels.jouetPeluchePourDormir}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Caractère */}
        <Accordion
          expanded={expanded === 'panel6'}
          onChange={handleAccordionChange('panel6')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Caractère</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ my: 2 }}>
              <Autocomplete
                multiple
                options={caracteresOptions}
                onChange={handleAutocompleteChange}
                renderInput={(params) => (
                  <TextField {...params} label="Choisissez les caractères" variant="outlined" />
                )}
                freeSolo
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                name="caractereAutres"
                value={formData.caractereAutres || ""}
                onChange={handleInputChange}
                label={labels.caractereAutres}
                variant="outlined"
              />
            </Box>
          </AccordionDetails>
        </Accordion>


        {/* Situation familiale */}
        <Accordion
          expanded={expanded === 'panel7'}
          onChange={handleAccordionChange('panel7')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Situation familiale</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                name="situationFamiliale"
                value={formData.situationFamiliale || ""}
                onChange={handleInputChange}
                label={labels.situationFamiliale}
                variant="outlined"
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                name="freres"
                value={formData.freres || ""}
                onChange={handleInputChange}
                label={labels.freres}
                variant="outlined"
                type="number"
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                name="soeurs"
                value={formData.soeurs || ""}
                onChange={handleInputChange}
                label={labels.soeurs}
                variant="outlined"
                type="number"
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.chambrePartagee || false}
                    onChange={handleInputChange}
                    name="chambrePartagee"
                  />
                }
                label={labels.chambrePartagee}
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                name="repasCommuns"
                value={formData.repasCommuns || ""}
                onChange={handleInputChange}
                label={labels.repasCommuns}
                variant="outlined"
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.activitesExtrascolaires || false}
                    onChange={handleInputChange}
                    name="activitesExtrascolaires"
                  />
                }
                label={labels.activitesExtrascolaires}
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                name="activitesExtrascolairesDetails"
                value={formData.activitesExtrascolairesDetails || ""}
                onChange={handleInputChange}
                label={labels.activitesExtrascolairesDetails}
                variant="outlined"
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                name="activitesPreferees"
                value={formData.activitesPreferees || ""}
                onChange={handleInputChange}
                label={labels.activitesPreferees}
                variant="outlined"
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

export default PatientAnamnèse;
