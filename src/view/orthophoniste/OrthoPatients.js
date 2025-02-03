import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; // ✅ Utilisation de useNavigate pour la navigation

const OrthoPatients = () => {
  const [validatedPatients, setValidatedPatients] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const open = Boolean(anchorEl);
  const orthoId = localStorage.getItem("orthoId");
  const navigate = useNavigate(); // ✅ Utilisation de useNavigate pour la navigation

  useEffect(() => {
    const fetchValidatedPatients = async () => {
      try {
        if (!orthoId) {
          toast.error("Identifiant de l'orthophoniste introuvable.");
          setLoading(false);
          return;
        }

        // Récupération des liens validés
        const { data: validatedLinks } = await axios.post(
          "http://localhost:5000/api/link/validated",{ linkerId: parseInt(orthoId, 10) },{
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`, // ou sessionStorage
              'Content-Type': 'application/json',
            },}
        );

        if (!validatedLinks || validatedLinks.length === 0) {
          toast.info("Aucun patient validé trouvé.");
          setLoading(false);
          return;
        }

        // Filtrer uniquement les patients avec le statut VALIDATED
        const filteredValidatedLinks = validatedLinks.filter(link => link.validate === "VALIDATED" && link.role === "ORTHOPHONIST");
        const patientIds = filteredValidatedLinks.map((link) => link.linkedTo);

        // Récupérer les détails des patients
        const { data: patients } = await axios.post(
          "http://localhost:5000/api/users/details",
          { patientIds },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`, // ou sessionStorage
              'Content-Type': 'application/json',
            },}
        );

        if (!patients || patients.length === 0) {
          toast.error("Aucun détail de patient trouvé.");
          setLoading(false);
          return;
        }

        // Récupérer les enseignants liés aux patients
        const { data: teachers } = await axios.post(
          "http://localhost:5000/api/users/teachers",
          { patientIds },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`, // ou sessionStorage
              'Content-Type': 'application/json',
            },}
        );

        // Associer les enseignants aux patients
        const patientsWithTeachers = patients.map((patient) => ({
          ...patient,
          teacher: teachers.find((t) => t.studentId === patient.id) || { firstName: "N/A", lastName: "N/A" },
        }));

        setValidatedPatients(patientsWithTeachers);
      } catch (error) {
        //console.error("❌ Erreur lors du chargement :", error);
        toast.error("Erreur lors du chargement des patients.");
      } finally {
        setLoading(false);
      }
    };

    fetchValidatedPatients();
  }, [orthoId]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event, patient) => {
    setAnchorEl(event.currentTarget);
    setSelectedPatient(patient);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPatient(null);
  };

  // ✅ Fonction pour gérer les différentes actions
  const handleActionClick = (action) => {
    if (!selectedPatient) {
      toast.error("Aucun patient sélectionné.");
      return;
    }

    const url = {
     "Consulter / Modifier le PAP": `/ortho/dashboard/papPatient`,

      "Consulter / Modifier le PPRE": `/ortho/dashboard/ppre/${selectedPatient.id}`,
      "Comptes-rendus des exercices": `/view/patient/CompteRendus`,
      "Aménagements scolaires": `/ortho/dashboard/ascolairesPatient`,
      "Historique éducatif": `/ortho/dashboard/historique-education/${selectedPatient.id}`,
      "Historique santé": `/ortho/dashboard/historique-sante/${selectedPatient.id}`,
      "Anamnese": `/ortho/dashboard/anamnese/${selectedPatient.id}`,
     }[action];

    if (url) {
      navigate(url);
    } else {
      toast.warn("Action inconnue.");
      return;
    }
    const intervenantId = orthoId;
    // ✅ Envoie `selectedPatient` et `orthoId` via `state`
    navigate(url, { state: { selectedPatient, intervenantId } });
  
    handleMenuClose();
  };
  

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  if (loading) {
    return <Typography>Chargement des données...</Typography>;
  }

  return (
    <Box sx={{ padding: "20px" }}>
      <ToastContainer />
      <Typography variant="h5" gutterBottom>
        Liste des patients validés par l'orthophoniste
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Date de naissance</TableCell>
              <TableCell>Enseignant</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {validatedPatients
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((patient, index) => (
                <TableRow key={patient.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{patient.lastName}</TableCell>
                  <TableCell>{patient.firstName}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>{formatDate(patient.birthDate)}</TableCell>
                  <TableCell>
                    {patient.teacher ? `${patient.teacher.firstName} ${patient.teacher.lastName}` : "N/A"}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="more"
                      onClick={(event) => handleMenuOpen(event, patient)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={validatedPatients.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleActionClick("Consulter / Modifier le PAP")}>📄 PAP</MenuItem>
        <MenuItem onClick={() => handleActionClick("Consulter / Modifier le PPRE")}>📖 PPRE</MenuItem>
        <MenuItem onClick={() => handleActionClick("Comptes-rendus des exercices")}>📝 Exercices</MenuItem>
        <MenuItem onClick={() => handleActionClick("Aménagements scolaires")}>🏫 Aménagements scolaires</MenuItem>
        <MenuItem onClick={() => handleActionClick("Historique éducatif")}>🎓 Historique éducatif</MenuItem>
        <MenuItem onClick={() => handleActionClick("Historique santé")}>🎓 Historique sante</MenuItem>
        <MenuItem onClick={() => handleActionClick("Anamnese")}>💬 Anamnese</MenuItem>
      </Menu>
    </Box>
  );
};

export default OrthoPatients;
