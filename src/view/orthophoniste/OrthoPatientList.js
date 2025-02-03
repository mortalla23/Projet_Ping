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

const OrthoPatientList = () => {
  const [patients, setPatients] = useState([]);
  const [addedPatients, setAddedPatients] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const debounceTimeout = useRef(null);
  const orthoId = localStorage.getItem("orthoId");

  useEffect(() => {
    //console.log("🎬 Démarrage de la surveillance des refus...");
    const savedAddedPatients = localStorage.getItem("addedPatients");
    if (savedAddedPatients) {
      setAddedPatients(JSON.parse(savedAddedPatients));
    }

    fetchPatients();

    // 🔥 Vérifie les invitations refusées toutes les 5 secondes sans recharger l'affichage
    const interval = setInterval(() => {
      checkRefusedInvitations();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchPatients = async (term = "") => {
    setLoading(true);
    try {
      const url = term
        ? `http://localhost:5000/api/users/patients/search?searchTerm=${term}`
        : `http://localhost:5000/api/users/patients`;

      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      setPatients(data);
      /*const { data: validatedLinks } = await axios.post(
        "http://localhost:5000/api/link/validated",
        { linkerId: parseInt(orthoId, 10) },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const validatedPatientIds = validatedLinks.map((link) => link.linkedTo);
      const filteredPatients = data.filter(
        (patient) => !validatedPatientIds.includes(patient.id)
      );

      setPatients(filteredPatients);*/
    } catch (error) {
      //console.error("Erreur API :", error);
      toast.error("Impossible de charger les patients.");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Vérifie uniquement les invitations refusées sans recharger toute la liste
  const checkRefusedInvitations = async () => {
    try {
        //console.log("🔍 Vérification rapide des invitations refusées...");

        // 1️⃣ Lancer les deux requêtes en parallèle
        const [allLinksResponse, refusedLinksResponse] = await Promise.all([
            axios.get(`http://localhost:5000/api/link/orthophoniste/${parseInt(orthoId, 10)}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            }),
            axios.post("http://localhost:5000/api/link/rejected", 
                { linkerId: parseInt(orthoId, 10) },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            )
        ]);

        const allLinks = allLinksResponse.data;
        const refusedLinks = refusedLinksResponse.data;

        //console.log("✅ Réponse API de tous les liens :", allLinks);
        //console.log("❌ Réponse API des liens refusés :", refusedLinks);

        // 2️⃣ Regrouper les liens par `linkedTo`
        const patientLinksCount = {};
        allLinks.forEach((link) => {
            patientLinksCount[link.linkedTo] = (patientLinksCount[link.linkedTo] || 0) + 1;
        });

        //console.log("📌 Nombre total de liens par patient :", patientLinksCount);

        // 3️⃣ Compter combien de ces liens sont REFUSED
        const refusedLinksCount = {};
        refusedLinks.forEach((link) => {
            refusedLinksCount[link.linkedTo] = (refusedLinksCount[link.linkedTo] || 0) + 1;
        });

        //console.log("❌ Nombre de liens refusés par patient :", refusedLinksCount);

        // 4️⃣ Trouver les patients qui ont UNIQUEMENT des liens REFUSED
        const patientsToRemove = Object.keys(refusedLinksCount).filter((patientId) => {
            return refusedLinksCount[patientId] === patientLinksCount[patientId]; // Vérifie si TOUS ses liens sont refusés
        });

        //console.log("🚀 Patients à supprimer (tous leurs liens sont refusés) :", patientsToRemove);

        // 5️⃣ Supprimer ces patients de `addedPatients`
        if (patientsToRemove.length > 0) {
            setAddedPatients((prevAddedPatients) => {
                const updated = { ...prevAddedPatients };

                patientsToRemove.forEach((patientId) => {
                    delete updated[patientId]; // Supprime uniquement si TOUS ses liens sont refusés
                    //console.log(`❌ Suppression du patient ${patientId} (tous ses liens sont refusés)`);
                });

                //console.log("📌 Nouveau état de addedPatients après suppression :", updated);
                localStorage.setItem("addedPatients", JSON.stringify(updated));
                return updated;
            });
        }
    } catch (error) {
        //console.error("❌ Erreur lors de la vérification des invitations refusées :", error);
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

      const userData = localStorage.getItem("user");
      const userObject = JSON.parse(userData); // Convertir en objet
      const role = userObject.role; 
      //console.log("📌 Rôle de l'utilisateur :", role);
      const { data: newLink } = await axios.post(
        "http://localhost:5000/api/link/create",
        {
          linkerId: parseInt(orthoId, 10),
          linkedTo: patient.id,
          role: role,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      setAddedPatients((prevAddedPatients) => ({
        ...prevAddedPatients,
        [patient.id]: newLink.id,
      }));
      localStorage.setItem(
        "addedPatients",
        JSON.stringify({ ...addedPatients, [patient.id]: newLink.id })
      );

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

      await axios.delete(`http://localhost:5000/api/link/${linkId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      setAddedPatients((prevAddedPatients) => {
        const updated = { ...prevAddedPatients };
        delete updated[patient.id];
        localStorage.setItem("addedPatients", JSON.stringify(updated));
        return updated;
      });

      toast.info(`L'ajout du patient ${patient.firstName} a été annulé.`);
    } catch (error) {
      console.error("Erreur lors de l'annulation :", error);
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
        onChange={handleSearch}
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
                    <Button variant="contained" color="error" onClick={() => handleCancel(patient)}>
                      Annuler
                    </Button>
                  ) : (
                    <Button variant="contained" color="primary" onClick={() => handleAdd(patient)}>
                      Ajouter
                    </Button>
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

export default OrthoPatientList;
