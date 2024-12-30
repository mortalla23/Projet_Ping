import React, { useState } from 'react';
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
} from '@mui/material';

const EnseiEleves = () => {
  const [students, setStudents] = useState([
    { id: 1, name: 'Jean Dupont', age: 14, class: '3A' },
    { id: 2, name: 'Marie Curie', age: 15, class: '3B' },
  ]);

  const [open, setOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', age: '', class: '' });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const handleAddStudent = () => {
    if (newStudent.name && newStudent.age && newStudent.class) {
      setStudents([...students, { id: students.length + 1, ...newStudent }]);
      setNewStudent({ name: '', age: '', class: '' });
      handleClose();
    } else {
      alert('Veuillez remplir tous les champs.');
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Tous les élèves
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2, bgcolor: '#5BA8B4' }}>
        Ajouter un élève
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#5BA8B4' }}>
              <TableCell sx={{ color: '#fff' }}>#</TableCell>
              <TableCell sx={{ color: '#fff' }}>Nom</TableCell>
              <TableCell sx={{ color: '#fff' }}>Âge</TableCell>
              <TableCell sx={{ color: '#fff' }}>Classe</TableCell>
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

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Ajouter un élève</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Nom"
            type="text"
            fullWidth
            value={newStudent.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="age"
            label="Âge"
            type="number"
            fullWidth
            value={newStudent.age}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
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

export default EnseiEleves;
