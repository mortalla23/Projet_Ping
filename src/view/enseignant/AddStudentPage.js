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

const AddStudentPage = () => {
  const [patients, setPatients] = useState([]); // Remarquer l'utilisation de patients ici
  const [addedStudents, setAddedStudents] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const debounceTimeout = useRef(null);
  const teacherId = localStorage.getItem("teacherId");

  useEffect(() => {
    fetchPatients(); // Appel à fetchPatients pour éviter confusion avec "students"

    const interval = setInterval(() => {
      checkValidatedPatients(); // Modification de checkValidatedStudents en checkValidatedPatients
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchPatients = async (term = "") => {
    setLoading(true);
    try {
      const url = term
        ? `http://localhost:5000/api/users/patients/search?searchTerm=${term}`
        : `http://localhost:5000/api/users/patients`;
      const { data } = await axios.get(url);

      // Récupérer les liens validés pour filtrer les patients
      const { data: validatedLinks } = await axios.post(
        "http://localhost:5000/api/link/validated",
        { linkerId: parseInt(teacherId, 10) }
      );

      const validatedPatientIds = validatedLinks.map((link) => link.linkedTo);
      const filteredPatients = data.filter(
        (patient) => !validatedPatientIds.includes(patient.id)
      );

      setPatients(filteredPatients); // Mise à jour de patients
    } catch (error) {
      console.error("Erreur API :", error);
      toast.error("Impossible de charger les élèves.");
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

    debounceTimeout.current = setTimeout(() => fetchPatients(value), 300); // Utilisation de fetchPatients ici
  };

  const handleAdd = async (patient) => { // Utilisation de patient au lieu de student
    try {
      const { data: newLink } = await axios.post(
        "http://localhost:5000/api/link/create",
        {
          teacherId: parseInt(teacherId, 10),
          patientId: patient.id, // Utilisation de patient ici
        }
      );

      const updatedAddedStudents = { ...addedStudents, [patient.id]: newLink.id }; // Mise à jour de addedStudents
      setAddedStudents(updatedAddedStudents);
      localStorage.setItem("addedStudents", JSON.stringify(updatedAddedStudents));

      toast.success(`L'élève ${patient.firstName} a été ajouté avec succès.`); // Utilisation de patient ici
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'élève :", error);
      toast.error("Impossible d'ajouter l'élève.");
    }
  };

  const handleCancel = async (patient) => { // Utilisation de patient ici aussi
    try {
      const linkId = addedStudents[patient.id];
      if (!linkId) {
        toast.error("Aucun lien à annuler.");
        return;
      }

      await axios.delete(`http://localhost:5000/api/link/${linkId}`);

      const updatedAddedStudents = { ...addedStudents };
      delete updatedAddedStudents[patient.id];
      setAddedStudents(updatedAddedStudents);
      localStorage.setItem("addedStudents", JSON.stringify(updatedAddedStudents));

      toast.info(`L'ajout de l'élève ${patient.firstName} a été annulé.`);
    } catch (error) {
      console.error("Erreur lors de l'annulation :", error);
      toast.error("Impossible d'annuler l'ajout.");
    }
  };

  const checkValidatedPatients = async () => { // Renommé pour utiliser "patients"
    try {
      const { data: validatedPatients } = await axios.post(
        "http://localhost:5000/api/link/validated",
        { params: { teacherId } }
      );

      if (validatedPatients.length > 0) {
        const updatedPatients = patients.filter(
          (patient) => !validatedPatients.some((vp) => vp.linkedTo === patient.id)
        );
        setPatients(updatedPatients);

        validatedPatients.forEach((vp) => {
          delete addedStudents[vp.linkedTo];
        });
        setAddedStudents({ ...addedStudents });
        localStorage.setItem("addedStudents", JSON.stringify(addedStudents));

        toast.success("Certains élèves ont été validés et transférés.");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification :", error);
    }
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <ToastContainer />
      <Typography variant="h5" gutterBottom>
        Liste des élèves
      </Typography>
      <TextField
        label="Rechercher un élève"
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
                      {addedStudents[patient.id] ? (
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

export default AddStudentPage;
