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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  TablePagination
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EnseiEleves = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchEmail, setSearchEmail] = useState(''); // Email pour rechercher un élève
  const [foundStudent, setFoundStudent] = useState(null); // Élève trouvé
  const [teacherId, setTeacherId] = useState(null);

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
      const response = await axios.get('https://localhost:5000/api/teacher/students', {
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
      const response = await axios.get('https://localhost:5000/api/teacher/students', {
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
      await axios.post('https://localhost:5000/api/teacher/link-student-by-email', {
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

  if (loading) {
    return <Typography>Chargement des données...</Typography>;
  }

  return (
    <Box sx={{ padding: '20px' }}>
      <ToastContainer />
      <Typography variant="h5" gutterBottom>
        Liste des élèves
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2, bgcolor: '#5BA8B4' }}>
        Ajouter un élève
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#5BA8B4' }}>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>#</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Nom d'utilisateur</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Date de naissance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((student, index) => (
              <TableRow key={student.id}>  {/* Assurez-vous que student.id est unique */}
                <TableCell>{index + 1}</TableCell>
                <TableCell>{student.username || 'Non disponible'}</TableCell>
                <TableCell>{student.email || 'Non disponible'}</TableCell>
                <TableCell>{student.birthDate ? new Date(student.birthDate).toLocaleDateString() : 'Non disponible'}</TableCell>
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

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Associer un élève existant</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="searchEmail"
            label="Email de l'élève"
            type="email"
            fullWidth
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
          <Button onClick={handleSearchStudent} color="primary">
            Rechercher
          </Button>
          {foundStudent && (
            <Box mt={2}>
              <Typography variant="body1">Nom : {foundStudent.username}</Typography>
              <Typography variant="body1">Email : {foundStudent.email}</Typography>
              <Typography variant="body1">
                Date de naissance : {new Date(foundStudent.birthDate).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleAssociateStudent} color="primary" disabled={!foundStudent}>
            Associer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EnseiEleves;
