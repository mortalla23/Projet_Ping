import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [addedPatients, setAddedPatients] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const debounceTimeout = useRef(null);
  const orthoId = localStorage.getItem("orthoId");

  useEffect(() => {
    const savedAddedPatients = localStorage.getItem("addedPatients");
    if (savedAddedPatients) {
      setAddedPatients(JSON.parse(savedAddedPatients));
    }

    fetchPatients();

    const interval = setInterval(() => {
      checkValidatedPatients();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchPatients = async (term = "") => {
    setLoading(true);
    try {
      const url = term
        ? `https://localhost:5000/api/users/patients/search?searchTerm=${term}`
        : `https://localhost:5000/api/users/patients`;
      const { data } = await axios.get(url,{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // ou sessionStorage
          'Content-Type': 'application/json',
        },});
      
      // Récupérer les liens validés pour filtrer les patients
      const { data: validatedLinks } = await axios.post(
        "https://localhost:5000/api/link/validated",
        {linkerId: parseInt(orthoId, 10) },{
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // ou sessionStorage
            'Content-Type': 'application/json',
          },}
      );

      const validatedPatientIds = validatedLinks.map(link => link.linkedTo);
      const filteredPatients = data.filter(patient => !validatedPatientIds.includes(patient.id));
      
      setPatients(filteredPatients);
    } catch (error) {
      console.error("Erreur API :", error);
      toast.error("Impossible de charger les patients.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => fetchPatients(value), 300);
  };

  const handleAdd = async (patient) => {
    try {
      const { data: newLink } = await axios.post("https://localhost:5000/api/link/create", {
        linkerId: parseInt(orthoId, 10),
        linkedTo: patient.id,
      },{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // ou sessionStorage
          'Content-Type': 'application/json',
        },},);

      const updatedAddedPatients = { ...addedPatients, [patient.id]: newLink.id };
      setAddedPatients(updatedAddedPatients);
      localStorage.setItem("addedPatients", JSON.stringify(updatedAddedPatients));

      toast.success(`Le patient ${patient.firstName} a été ajouté avec succès.`);
    } catch (error) {
      console.error("Erreur lors de l'ajout du patient :", error);
      toast.error("Impossible d'ajouter le patient.");
    }
  };

  const handleCancel = async (patient) => {
    try {
      const linkId = addedPatients[patient.id];
      if (!linkId) {
        toast.error("Aucun lien à annuler.");
        return;
      }

      await axios.delete(`https://localhost:5000/api/link/${linkId}`,{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // ou sessionStorage
          'Content-Type': 'application/json',
        },});

      const updatedAddedPatients = { ...addedPatients };
      delete updatedAddedPatients[patient.id];
      setAddedPatients(updatedAddedPatients);
      localStorage.setItem("addedPatients", JSON.stringify(updatedAddedPatients));

      toast.info(`L'ajout du patient ${patient.firstName} a été annulé.`);
    } catch (error) {
      console.error("Erreur lors de l'annulation :", error);
      toast.error("Impossible d'annuler l'ajout.");
    }
  };

  const checkValidatedPatients = async () => {
    try {
      const { data: validatedPatients } = await axios.post(
        "https://localhost:5000/api/link/validated", { linkerId: parseInt(orthoId, 10) },{
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // ou sessionStorage
            'Content-Type': 'application/json',
          },},
       
      );

      if (validatedPatients.length > 0) {
        const updatedPatients = patients.filter(
          (patient) => !validatedPatients.some((vp) => vp.linkedTo === patient.id)
        );
        setPatients(updatedPatients);

        validatedPatients.forEach((vp) => {
          delete addedPatients[vp.linkedTo];
        });
        setAddedPatients({ ...addedPatients });
        localStorage.setItem("addedPatients", JSON.stringify(addedPatients));

        toast.success("Certains patients ont été validés et transférés.");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification :", error);
    }
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <ToastContainer />
      <Typography variant="h5" gutterBottom>
        Liste des patients
      </Typography>
      <TextField
        label="Rechercher un patient"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearch}
        autoFocus
      />
      {loading ? (
        <Typography>Chargement...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#5BA8B4" }}>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>#</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Nom</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Prénom</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((patient, index) => (
                  <TableRow key={patient.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{patient.lastName}</TableCell>
                    <TableCell>{patient.firstName}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>
                      {addedPatients[patient.id] ? (
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleCancel(patient)}
                        >
                          Annuler
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleAdd(patient)}
                        >
                          Ajouter
                        </Button>
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
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </TableContainer>
      )}
    </Box>
  );
};

export default PatientList;