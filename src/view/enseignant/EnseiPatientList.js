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
  // 📌 Récupération des infos utilisateur
  const userData = JSON.parse(localStorage.getItem("user"));
  const userRole = userData?.role;
  const userId = userRole === "ORTHOPHONIST" ? userData.id : localStorage.getItem("teacherId");

  // 📌 Clé unique pour stocker les patients ajoutés par l'utilisateur
  const STORAGE_KEY = `addedPatients_${userId}`;

  // 📌 États
  const [patients, setPatients] = useState([]);
  const [addedPatients, setAddedPatients] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const debounceTimeout = useRef(null);

  // 📌 Chargement des patients et surveillance des refus
  useEffect(() => {
    //console.log(`🎬 Démarrage de la surveillance des refus pour ${userRole} ${userId}...`);
    fetchPatients();

    const interval = setInterval(() => {
      checkRefusedInvitations();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 📌 Récupération des patients
  const fetchPatients = async (term = "") => {
    setLoading(true);
    try {
      const url = term
        ? `https://localhost:5000/api/users/patients/search?searchTerm=${term}`
        : `https://localhost:5000/api/users/patients`;

      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      setPatients(data);
    } catch (error) {
      //console.error("Erreur API :", error);
      toast.error("Impossible de charger les patients.");
    } finally {
      setLoading(false);
    }
  };

  // 📌 Vérification des invitations refusées
  const checkRefusedInvitations = async () => {
    try {
      //console.log(`🔍 Vérification des invitations refusées pour ${userRole} ${userId}...`);

      const [allLinksResponse, refusedLinksResponse] = await Promise.all([
        axios.get(`https://localhost:5000/api/link/orthophoniste/${parseInt(userId, 10)}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }),
        axios.post(
          "https://localhost:5000/api/link/rejected",
          { linkerId: parseInt(userId, 10) },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        ),
      ]);

      const allLinks = allLinksResponse.data;
      const refusedLinks = refusedLinksResponse.data;

      //console.log("✅ Tous les liens :", allLinks);
      //console.log("❌ Liens refusés :", refusedLinks);

      const patientLinksCount = {};
      allLinks.forEach((link) => {
        patientLinksCount[link.linkedTo] = (patientLinksCount[link.linkedTo] || 0) + 1;
      });

      const refusedLinksCount = {};
      refusedLinks.forEach((link) => {
        refusedLinksCount[link.linkedTo] = (refusedLinksCount[link.linkedTo] || 0) + 1;
      });

      const patientsToRemove = Object.keys(refusedLinksCount).filter(
        (patientId) => refusedLinksCount[patientId] === patientLinksCount[patientId]
      );

      //console.log(`🚀 Patients à supprimer pour ${userRole} ${userId} :`, patientsToRemove);

      if (patientsToRemove.length > 0) {
        setAddedPatients((prevAddedPatients) => {
          const updated = { ...prevAddedPatients };

          patientsToRemove.forEach((patientId) => {
            delete updated[patientId];
          });

          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
      }
    } catch (error) {
      //console.error(`❌ Erreur lors de la vérification des refus pour ${userRole} ${userId} :`, error);
    }
  };

  // 📌 Ajout d'un patient
  const handleAdd = async (patient) => {
    try {
      const { data: newLink } = await axios.post(
        "https://localhost:5000/api/link/create",
        {
          linkerId: parseInt(userId, 10),
          linkedTo: patient.id,
          role: userRole,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      setAddedPatients((prevAddedPatients) => {
        const updated = { ...prevAddedPatients, [patient.id]: newLink.id };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });

      toast.success(`Le patient ${patient.firstName} a été ajouté avec succès.`);
    } catch (error) {
      //console.error("Erreur lors de l'ajout du patient :", error);
      toast.error("Impossible d'ajouter le patient.");
    }
  };

  // 📌 Annulation d'un ajout
  const handleCancel = async (patient) => {
    try {
      const linkId = addedPatients[patient.id];
      if (!linkId) {
        toast.error("Aucun lien à annuler.");
        return;
      }

      await axios.delete(`https://localhost:5000/api/link/${linkId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      setAddedPatients((prevAddedPatients) => {
        const updated = { ...prevAddedPatients };
        delete updated[patient.id];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });

      toast.info(`L'ajout du patient ${patient.firstName} a été annulé.`);
    } catch (error) {
      //console.error("Erreur lors de l'annulation :", error);
      toast.error("Impossible d'annuler l'ajout.");
    }
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <ToastContainer />
      <Typography variant="h5" gutterBottom>
        Liste des élèves
      </Typography>
      <TextField
        label="Rechercher un patient"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        autoFocus
      />
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
            {patients.map((patient, index) => (
              <TableRow key={patient.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{patient.lastName}</TableCell>
                <TableCell>{patient.firstName}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>
                  {addedPatients[patient.id] ? (
                    <Button variant="contained" color="error" onClick={() => handleCancel(patient)}>Annuler</Button>
                  ) : (
                    <Button variant="contained" color="primary" onClick={() => handleAdd(patient)}>Ajouter</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PatientList;
