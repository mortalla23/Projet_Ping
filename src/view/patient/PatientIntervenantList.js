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

const IntervenantList = () => {
  const patientId =localStorage.getItem('patientId');
  const [intervenants, setIntervenants] = useState([]);
  const [addedIntervenants, setAddedIntervenants] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const debounceTimeout = useRef(null);

  useEffect(() => {
    const savedAddedIntervenants = localStorage.getItem("addedIntervenants");
    if (savedAddedIntervenants) {
      setAddedIntervenants(JSON.parse(savedAddedIntervenants));
    }

    fetchIntervenants();

    const interval = setInterval(() => {
      checkValidatedIntervenants();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchIntervenants = async (term = "") => {
    setLoading(true);
    try {
      const url = term
        ? `https://localhost:5000/api/users/intervenants/search?searchTerm=${term}`
        : `https://localhost:5000/api/users/intervenants/${patientId}`;

      const { data } = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      // Récupérer les liens validés pour filtrer les intervenants
      const { data: validatedLinks } = await axios.post(
        "https://localhost:5000/api/link/validated",
        { linkerId: parseInt(localStorage.getItem('patientId'), 10) }, // Assurez-vous d'utiliser le bon ID
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const validatedIntervenantIds = validatedLinks.map(link => link.linkedTo);
      const filteredIntervenants = data.filter(intervenant => !validatedIntervenantIds.includes(intervenant.id));

      setIntervenants(filteredIntervenants);
    } catch (error) {
      console.error("Erreur API :", error);
      toast.error("Impossible de charger les Intervenants.");
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

    debounceTimeout.current = setTimeout(() => fetchIntervenants(value), 300);
  };

  const handleAdd = async (intervenant) => {
    try {
      const { data: newLink } = await axios.post("https://localhost:5000/api/link/create", {
        linkerId: patientId,
        linkedTo: intervenant.id,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const updatedAddedIntervenants = { ...addedIntervenants, [intervenant.id]: newLink.id };
      setAddedIntervenants(updatedAddedIntervenants);
      localStorage.setItem("addedIntervenants", JSON.stringify(updatedAddedIntervenants));

      toast.success(`L'intervenant ${intervenant.firstName} a été ajouté avec succès.`);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'intervenant :", error);
      toast.error("Impossible d'ajouter l'intervenant.");
    }
  };

  const handleCancel = async (intervenant) => {
    try {
      const linkId = addedIntervenants[intervenant.id];
      if (!linkId) {
        toast.error("Aucun lien à annuler.");
        return;
      }

      await axios.delete(`https://localhost:5000/api/link/${linkId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const updatedAddedIntervenants = { ...addedIntervenants };
      delete updatedAddedIntervenants[intervenant.id];
      setAddedIntervenants(updatedAddedIntervenants);
      localStorage.setItem("addedIntervenants", JSON.stringify(updatedAddedIntervenants));

      toast.info(`L'ajout de l'intervenant ${intervenant.firstName} a été annulé.`);
    } catch (error) {
      console.error("Erreur lors de l'annulation :", error);
      toast.error("Impossible d'annuler l'ajout.");
    }
  };

  const checkValidatedIntervenants = async () => {
    try {
      const { data: validatedIntervenants } = await axios.post(
        "https://localhost:5000/api/link/validated",
        { linkerId: patientId },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (validatedIntervenants.length > 0) {
        const updatedIntervenants = intervenants.filter(
          (intervenant) => !validatedIntervenants.some((vp) => vp.linkedTo === intervenant.id)
        );
        setIntervenants(updatedIntervenants);

        validatedIntervenants.forEach((vp) => {
          delete addedIntervenants[vp.linkedTo];
        });
        setAddedIntervenants({ ...addedIntervenants });
        localStorage.setItem("addedIntervenants", JSON.stringify(addedIntervenants));

        toast.success("Certains Intervenants ont été validés et transférés.");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification :", error);
    }
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <ToastContainer />
      <Typography variant="h5" gutterBottom>
        Liste des Intervenants
      </Typography>
      <TextField
        label="Rechercher un Intervenant"
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
              {intervenants
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((intervenant, index) => (
                  <TableRow key={intervenant.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{intervenant.lastName}</TableCell>
                    <TableCell>{intervenant.firstName}</TableCell>
                    <TableCell>{intervenant.email}</TableCell>
                    <TableCell>
                      {addedIntervenants[intervenant.id] ? (
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleCancel(intervenant)}
                        >
                          Annuler
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleAdd(intervenant)}
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
            count={intervenants.length}
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

export default IntervenantList;