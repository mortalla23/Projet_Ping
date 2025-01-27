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
  TablePagination,
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';
import { MoreVert } from '@mui/icons-material'; // Icône pour le menu

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrthoPatients = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchEmail, setSearchEmail] = useState(''); // Email pour rechercher un élève
  const [foundStudent, setFoundStudent] = useState(null); // Élève trouvé
  const [orthoId, setOrthoId] = useState(null);

  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Etat pour le menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null); // Élève sélectionné pour afficher le menu

  useEffect(() => {
    const storedOrthoId = localStorage.getItem('orthoId');
    console.log('ID orthophoniste:', storedOrthoId);
    if (storedOrthoId) {
      setOrthoId(storedOrthoId);
      fetchStudents(storedOrthoId);
    } else {
      toast.error('Aucun ID orthophoniste trouvé. Veuillez vous reconnecter.');
    }
  }, []);

  const fetchStudents = async (orthoId) => {
    try {
      const response = await axios.get('https://localhost:5000/api/orthophoniste/patients',{
        params: { orthoId },
      });
      console.log('Données reçues de l\'API:', response.data); // Affiche les données reçues
      if (response.data && response.data.length > 0) {
        setStudents(response.data);
      } else {
        toast.error('Aucun élève trouvé.');
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des élèves.');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, student) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);  // Sauvegarder l'élève sélectionné
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStudent(null);
  };

  const handleActionClick = (action) => {
    // Logique pour gérer les actions
    console.log(`Action: ${action} sur l'élève: ${selectedStudent.username}`);
    handleMenuClose();
  };

  const handleSearchStudent = async () => {
    try {
      const response = await axios.get('https://localhost:5000/api/orthophoniste/patients', {
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
      await axios.post('https://localhost:5000/api/orthophoniste/patient/ajouter', {
        orthoId,
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
        Liste des patients
      </Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2, bgcolor: '#5BA8B4' }} onClick={() => setOpen(true)}>
        Ajouter un patient
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#5BA8B4' }}>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>#</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Nom d'utilisateur</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Date de naissance</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((student, index) => (
              <TableRow key={student.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{student.username || 'Non disponible'}</TableCell>
                <TableCell>{student.email || 'Non disponible'}</TableCell>
                <TableCell>{student.birthDate ? new Date(student.birthDate).toLocaleDateString() : 'Non disponible'}</TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleMenuOpen(e, student)}>
                    <MoreVert /> {/* Icône de menu */}
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

      {/* Menu déroulant d'actions */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleActionClick('Consulter / Modifier le PAP')}>Consulter / Modifier le PAP</MenuItem>
        <MenuItem onClick={() => handleActionClick('Consulter / Modifier le PPRE')}>Consulter / Modifier le PPRE</MenuItem>
        <MenuItem onClick={() => handleActionClick('Comptes-rendus des exercices')}>Comptes-rendus des exercices</MenuItem>
        <MenuItem onClick={() => handleActionClick('Aménagements scolaires')}>Aménagements scolaires</MenuItem>
        <MenuItem onClick={() => handleActionClick('Historique éducatif')}>Historique éducatif</MenuItem>
        <MenuItem onClick={() => handleActionClick('Historique santé')}>Historique santé</MenuItem>
        
      </Menu>

      {/* Dialog pour ajouter un patient */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Associer un patient existant</DialogTitle>
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
          <Button onClick={handleSearchStudent} color="primary">Rechercher</Button>
          {foundStudent && (
            <Box mt={2}>
              <Typography variant="body1">Nom : {foundStudent.username}</Typography>
              <Typography variant="body1">Email : {foundStudent.email}</Typography>
              <Typography variant="body1">Date de naissance : {new Date(foundStudent.birth_date).toLocaleDateString()}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">Annuler</Button>
          <Button onClick={handleAssociateStudent} color="primary" disabled={!foundStudent}>Associer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrthoPatients;
