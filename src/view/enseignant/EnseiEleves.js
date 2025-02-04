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
  const [searchEmail, setSearchEmail] = useState('');
  const [foundStudent, setFoundStudent] = useState(null);
  const [open, setOpen] = useState(false);
  //const open = Boolean(anchorEl);
  
  const [teacherId, setTeacherId] = localStorage.getItem("teacherId");
  const navigate = useNavigate(); // ✅ Utilisation de useNavigate pour la navigation

  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  useEffect(() => {
    const storedTeacherId = localStorage.getItem('teacherId');
    console.log('ID enseignant récupéré depuis localStorage :', storedTeacherId);
    if (storedTeacherId) {
      setTeacherId(storedTeacherId);
      fetchStudents(storedTeacherId);
    } else {
      toast.error('Aucun ID enseignant trouvé. Veuillez vous reconnecter.');
    }
  }, []);


  const fetchStudents = async (teacherId) => {
    try {
      const response = await axios.get('http://localhost:5000/api/teacher/students', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // ou sessionStorage
          'Content-Type': 'application/json',
        },
        params: { teacherId },
      });
      console.log('Données reçues :', response.data); 
      // Si la réponse n'est pas déjà un tableau, on l'encapsule dans un tableau
      setStudents(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (error) {
      console.error('Erreur lors du chargement des élèves :', error);
      toast.error('Erreur lors du chargement des élèves.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchStudent = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/teacher/students', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // ou sessionStorage
          'Content-Type': 'application/json',
        },
        params: { email: searchEmail },
      });
      setFoundStudent(response.data);
      toast.success('Élève trouvé.');
    } catch (error) {
      console.error('Erreur lors de la recherche de l’élève :', error);
      toast.error('Aucun élève trouvé avec cet email.');
    }
  };

  

  const handleAssociateStudent = async () => {
    if (!foundStudent) {
      toast.error('Aucun élève à associer.');
      return;
    }
    const studentEmail = foundStudent.email; // Utiliser l'email de l'élève au lieu de l'ID
    if (!studentEmail) {
      toast.error("L'email de l'élève est manquant.");
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/teacher/link-student-by-email', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // ou sessionStorage
          'Content-Type': 'application/json',
        },
        teacherId,
        studentEmail,
        studentId: foundStudent.id,
      });
      
      setStudents([...students, foundStudent]); // Ajouter l'élève à la liste locale
      setFoundStudent(null); // Réinitialiser la recherche
      setSearchEmail(''); // Réinitialiser l'email
      handleClose();
      toast.success('Élève associé avec succès.');
    } catch (error) {
      console.error('Erreur lors de l’association de l’élève :', error);
      toast.error('Erreur lors de l’association de l’élève.');
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFoundStudent(null);
    setSearchEmail('');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

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
