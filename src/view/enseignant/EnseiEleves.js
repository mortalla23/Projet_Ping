import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; // ✅ Utilisation de useNavigate pour la navigation

const EnseiEleves = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [validatedPatients, setValidatedPatients] = useState([]);
  const open = Boolean(anchorEl);
  const teacherId = localStorage.getItem("teacherId");
  const navigate = useNavigate(); // ✅ Utilisation de useNavigate pour la navigation

  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  useEffect(() => {
    const fetchValidatedPatients = async () => {
      try {
        if (!teacherId) {
          toast.error("Identifiant de l'enseignant introuvable.");
          setLoading(false);
          return;
        }

        // Récupération des liens validés
        const { data: validatedLinks } = await axios.post(
          "http://localhost:5000/api/link/validated",
          { linkerId: parseInt(teacherId, 10) },
          { headers: { "Content-Type": "application/json" } }
        );

        if (!validatedLinks || validatedLinks.length === 0) {
          toast.info("Aucun patient validé trouvé.");
          setLoading(false);
          return;
        }

        // Filtrer uniquement les patients avec le statut VALIDATED
        const filteredValidatedLinks = validatedLinks.filter(link => link.validate === "VALIDATED"&& link.role === "TEACHER");
        const patientIds = filteredValidatedLinks.map((link) => link.linkedTo);

        // Récupérer les détails des patients
        const { data: patients } = await axios.post(
          "http://localhost:5000/api/users/details",
          { patientIds },
          { headers: { "Content-Type": "application/json" } }
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
          { headers: { "Content-Type": "application/json" } }
        );

        // Associer les enseignants aux patients
        const patientsWithTeachers = patients.map((patient) => ({
          ...patient,
          teacher: teachers.find((t) => t.studentId === patient.id) || { firstName: "N/A", lastName: "N/A" },
        }));

        setValidatedPatients(patientsWithTeachers);
      } catch (error) {
        console.error("❌ Erreur lors du chargement :", error);
        toast.error("Erreur lors du chargement des patients.");
      } finally {
        setLoading(false);
      }
    };

    fetchValidatedPatients();
  }, [teacherId]);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event, student) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStudent(null);
  };

  const handleActionClick = (action) => {
    if (!selectedStudent) {
      toast.error("Aucun élève sélectionné.");
      return;
    }

    const url = {
      "Consulter / Modifier le PAP": `/view/patient/PAPForm?userId=${selectedStudent.id}&intervenantId=${teacherId}`,
      "Consulter / Modifier le PPRE": `/view/patient/PPREForm?userId=${selectedStudent.id}&intervenantId=${teacherId}`,
      "Comptes-rendus des exercices": `/view/patient/CompteRendus?userId=${selectedStudent.id}&intervenantId=${teacherId}`,
      "Aménagements scolaires": `/view/patient/AménagementScolaire?userId=${selectedStudent.id}&intervenantId=${teacherId}`,
      "Historique éducatif": `/view/patient/EnseiHistoriqueEducation?userId=${selectedStudent.id}`,
    }[action];

    if (url) {
      navigate(url);
    } else {
      toast.warn("Action inconnue.");
    }

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
    <Box sx={{ padding: '20px' }}>
      <ToastContainer />
      <Typography variant="h5" gutterBottom>
        Liste des élèves
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
              <TableCell>Orthophoniste</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {validatedPatients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((student, index) => (
              <TableRow key={student.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{student.lastName}</TableCell>
                <TableCell>{student.firstName}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{formatDate(student.birthDate)}</TableCell>
                <TableCell>
                  {student.orthophoniste ? `${student.orthophoniste.firstName} ${student.orthophoniste.lastName}` : "N/A"}
                </TableCell>
                <TableCell>
                  <IconButton
                    aria-label="more"
                    onClick={(event) => handleMenuOpen(event, student)}
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
          count={students.length}
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
      </Menu>
    </Box>
  );
};

export default EnseiEleves;
