import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const EnseiAccueil = () => {
  const [open, setOpen] = useState(false);
  const [students, setStudents] = useState([
    { id: 1, name: 'Jean Dupont', age: 14, class: '3A' },
    { id: 2, name: 'Marie Curie', age: 15, class: '3B' },
  ]);
  const [newStudent, setNewStudent] = useState({
    name: '',
    age: '',
    class: '',
  });

  // Ouvre le modal
  const handleOpen = () => setOpen(true);

  // Ferme le modal
  const handleClose = () => {
    setOpen(false);
    setNewStudent({ name: '', age: '', class: '' });
  };

  // Gère les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  // Ajoute un nouvel élève
  const handleAddStudent = () => {
    if (newStudent.name && newStudent.age && newStudent.class) {
      setStudents([...students, { id: students.length + 1, ...newStudent }]);
      handleClose();
    } else {
      alert('Veuillez remplir tous les champs !');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tableau de bord de l'enseignant
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Ajouter un élève
      </Button>

      {/* Liste des élèves */}
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Âge</TableCell>
              <TableCell>Classe</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.id}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.age}</TableCell>
                <TableCell>{student.class}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal pour ajouter un élève */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Ajouter un élève</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="name"
            label="Nom"
            type="text"
            fullWidth
            value={newStudent.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="age"
            name="age"
            label="Âge"
            type="number"
            fullWidth
            value={newStudent.age}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="class"
            name="class"
            label="Classe"
            type="text"
            fullWidth
            value={newStudent.class}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleAddStudent} color="primary">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EnseiAccueil;
