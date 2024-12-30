import React, { useState } from "react";
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
} from "@mui/material";

const EnseiAmenagements = () => {
  const [amenagements, setAmenagements] = useState([
    {
      id: 1,
      type: "PAP",
      student: "Jean Dupont",
      status: "Validé par l’orthophoniste",
    },
    {
      id: 2,
      type: "PAI",
      student: "Marie Curie",
      status: "En attente de validation",
    },
  ]);

  const [open, setOpen] = useState(false);
  const [currentAmenagement, setCurrentAmenagement] = useState(null);

  // Ouvre le modal pour modification
  const handleEdit = (amenagement) => {
    setCurrentAmenagement(amenagement);
    setOpen(true);
  };

  // Ferme le modal
  const handleClose = () => {
    setOpen(false);
    setCurrentAmenagement(null);
  };

  // Gestion des modifications
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentAmenagement({ ...currentAmenagement, [name]: value });
  };

  // Sauvegarde des modifications
  const handleSave = () => {
    setAmenagements((prev) =>
      prev.map((item) =>
        item.id === currentAmenagement.id ? currentAmenagement : item
      )
    );
    handleClose();
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestion des Aménagements Scolaires
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#5BA8B4" }}>
              <TableCell sx={{ color: "#fff" }}>Type</TableCell>
              <TableCell sx={{ color: "#fff" }}>Élève</TableCell>
              <TableCell sx={{ color: "#fff" }}>Statut</TableCell>
              <TableCell sx={{ color: "#fff" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {amenagements.map((amenagement) => (
              <TableRow key={amenagement.id}>
                <TableCell>{amenagement.type}</TableCell>
                <TableCell>{amenagement.student}</TableCell>
                <TableCell>{amenagement.status}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="#5BA8B4"
                    onClick={() => handleEdit(amenagement)}
                  >
                    Modifier
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal pour modification */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Modifier un Aménagement</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="type"
            label="Type d'Aménagement"
            type="text"
            fullWidth
            value={currentAmenagement?.type || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="student"
            label="Élève"
            type="text"
            fullWidth
            value={currentAmenagement?.student || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="status"
            label="Statut"
            type="text"
            fullWidth
            value={currentAmenagement?.status || ""}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleSave} color="primary">
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EnseiAmenagements;
