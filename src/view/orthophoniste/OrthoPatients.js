import React, { useState, useEffect, useRef } from "react";
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
  Button,
  TablePagination,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material"; // Icône pour le menu
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PatientList() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [patients, setPatients] = useState([]); // Liste des patients
  const [loading, setLoading] = useState(true); // Chargement
  const [sortOrder, setSortOrder] = useState("desc"); // Trier les patients
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null); // État pour le menu

  const dropdownRef = useRef(null);

  // Récupération des patients via API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orthophoniste/patients");
        console.log("Patients reçus :", response.data);
        const sortedPatients = sortPatients(response.data, sortOrder);
        setPatients(sortedPatients);
      } catch (error) {
        console.error("Erreur lors de la récupération des patients :", error);
        toast.error("Erreur lors du chargement des patients.");
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [sortOrder]);

  const sortPatients = (patients, order) => {
    return patients.sort((a, b) => {
      const dateA = new Date(a.lastConsultation);
      const dateB = new Date(b.lastConsultation);
      return order === "desc" ? dateB - dateA : dateA - dateB;
    });
  };

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleSortOrderChange = () => {
    const newOrder = sortOrder === "desc" ? "asc" : "desc";
    setSortOrder(newOrder);
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
    <Box sx={{ padding: "20px" }}>
      <ToastContainer />
      <Typography variant="h5" gutterBottom>
        Liste des patients
      </Typography>

      {/* Bouton pour trier */}
      <Box sx={{ textAlign: "right", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSortOrderChange}
          sx={{ bgcolor: "#5BA8B4" }}
        >
          Trier par date : {sortOrder === "desc" ? "Du plus récent au plus ancien" : "Du plus ancien au plus récent"}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#5BA8B4" }}>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>#</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Nom</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Prénom</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Date de naissance</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Dernière consultation</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((patient, index) => (
              <TableRow key={patient.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{patient.lastName}</TableCell>
                <TableCell>{patient.firstName}</TableCell>
                <TableCell>{new Date(patient.birthDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  {patient.lastConsultation ? new Date(patient.lastConsultation).toLocaleDateString() : "Non disponible"}
                </TableCell>
                <TableCell ref={dropdownRef} style={{ position: "relative" }}>
                  <IconButton onClick={(e) => toggleDropdown(patient.id)}>
                    <MoreVert />
                  </IconButton>
                  {activeDropdown === patient.id && (
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={() => setAnchorEl(null)}
                    >
                      <MenuItem>Modifier</MenuItem>
                      <MenuItem>Supprimer</MenuItem>
                    </Menu>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={patients.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
}

export default PatientList;
