import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./PAPForm.css";


const PAPForm = () => {
  
  const location = useLocation(); // ✅ Récupération de `location` correctement
  // ✅ Initialisation avec `location.state` ou `localStorage`
  const [userId, setUserId] = useState(() => {
    return location.state?.selectedPatient?.id || localStorage.getItem("patientId") || null;
  });

  const [intervenantId, setIntervenantId] = useState(() => {
    return location.state?.orthoId || localStorage.getItem("intervenantId") || null;
  });

  useEffect(() => {
    console.log("📌 location.state reçu :", location.state);

    // ✅ Vérifier si location.state est bien défini avant mise à jour
    if (location.state?.selectedPatient?.id || location.state?.orthoId) {
      setUserId(prevUserId => location.state.selectedPatient?.id ?? prevUserId);
      setIntervenantId(prevIntervenantId => location.state.orthoId ?? prevIntervenantId);
    } else {
      // ✅ Évite les mises à jour inutiles en comparant avec l'ancien état
      setUserId(prevUserId => prevUserId ?? localStorage.getItem("patientId"));
      setIntervenantId(prevIntervenantId => prevIntervenantId ?? localStorage.getItem("intervenantId"));
    }
  }, [location.state]); // Dépendance correcte

  /*const [userId, setUserId] = useState(null);
  const [intervenantId, setIntervenantId] = useState(null);
  

  useEffect(() => {
    console.log("📌 location.state reçu :", location.state);

    // Si `location.state` existe, récupérer les valeurs
    if (location.state?.selectedPatient?.id || location.state?.orthoId) {
      setUserId(location.state.selectedPatient?.id);
      setIntervenantId(location.state.orthoId);
    } else {
      // Sinon, récupérer depuis `localStorage`
      const storedUserId = localStorage.getItem("patientId");
      setUserId(localStorage.getItem("patientId"));
      setIntervenantId(localStorage.getItem("patientId"));
    }
  }, [location.state]);*/
  /*const userId = localStorage.getItem('patientId');
  const intervenantId = localStorage.getItem('patientId');*/
  


  // Récupération des paramètres depuis l'URL
  //const userId = localStorage.getItem('patientId');
  //const intervenantId = localStorage.getItem('patientId');

  // Si intervenantId n'est pas fourni, on le définit sur userId
  /*if (!intervenantId) {
    intervenantId = userId;
  }*/

  console.log("userId :", userId);
  console.log("intervenantId :", intervenantId);

  const [role, setRole] = useState(null); // État pour stocker le rôle utilisateur

useEffect(() => {
  const fetchUserRole = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${intervenantId}`);
      if (!response.ok) {
        throw new Error(`Erreur serveur : ${response.status} ${response.statusText}`);
      }
      const userData = await response.json();
      setRole(userData.role); // Mettre à jour l'état avec le rôle utilisateur
      console.log("Rôle de l'intervenant récupéré :", userData.role); // Affiche le rôle dans la console
    } catch (err) {
      console.error("Erreur lors de la récupération du rôle utilisateur :", err);
    }
  };

  fetchUserRole();
}, [intervenantId]); // Dépendance à intervenantId pour relancer l'effet si intervenantId change

  const [formData, setFormData] = useState({
    responsables: "",
    challenges: "",
    strengths: "",
    history: "",
    shortTermGoals: "",
    longTermGoals: "",
    progressEvaluation: "",
    ressourcesNeeded: "",
    observations: "",
    followUp: "",
  });

  const [userInfo, setUserInfo] = useState({
    username: "",
    birthDate: "",
  });

  const [papId, setPapId] = useState(null); // ID du PAP
  const [successMessage, setSuccessMessage] = useState(null); // Message de succès
  const [papExists, setPapExists] = useState(false); // Indique si le PAP existe

  // Fonction pour formater la date en YYYY-MM-DD
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    // Récupération des données du PAP
    axios
      .get(`http://localhost:5000/api/pap/user/${userId}`)
      .then((response) => {
        console.log("Données récupérées depuis l'API :", response.data);
        if (Array.isArray(response.data) && response.data.length > 0) {
          setFormData(response.data[0]);
          setPapId(response.data[0].id); // Stocker l'ID du PAP
          setPapExists(true); // Le PAP existe
        } else {
          console.log("Le PAP n'existe pas pour cet utilisateur.");
          setPapExists(false); // Le PAP n'existe pas
        }
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des données du PAP :", error);
        setPapExists(false); // En cas d'erreur, considérer que le PAP n'existe pas
      });

    // Récupération des informations de l'utilisateur
    axios
      .get(`http://localhost:5000/api/users/${userId}`)
      .then((response) => {
        console.log("Informations utilisateur récupérées :", response.data);
        setUserInfo({
          username: response.data.username || "",
          birthDate: formatDate(response.data.birthDate),
          lastName: response.data.lastName || "",
          firstName: response.data.firstName || "",// Conversion au bon format
        });
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des informations utilisateur :", error);
      });
  }, [userId]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (papId) {
      axios
        .put(`http://localhost:5000/api/pap/update/${papId}`, formData)
        .then((response) => {
          console.log("Mise à jour réussie :", response.data);
          alert("Le document a été modifié avec succès.");
        })
        .catch((error) => {
          console.error("Erreur lors de la mise à jour du PAP :", error);
          alert("Une erreur est survenue lors de la mise à jour du document.");
        });
    } else {
      console.error("ID du PAP introuvable, impossible de mettre à jour.");
      alert("Impossible de mettre à jour le document : ID introuvable.");
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:5000/api/pap/create`, { ...formData, userId })
      .then(() => {
        alert("Le PAP a été créé avec succès.");
        window.location.reload(); // Recharge la page après la création
      })
      .catch((error) => {
        console.error("Erreur lors de la création du PAP :", error);
        alert("Une erreur est survenue lors de la création.");
      });
  };


    // Condition pour rendre le formulaire modifiable
    const isEditable = !papExists || role === "ORTHOPHONIST";


  return (
    <div className="container">
      <h1>Plan d'Accompagnement Personnalisé</h1>

      {successMessage && <div className="success-message">{successMessage}</div>}

      {papExists ? (
        // Formulaire pour afficher et mettre à jour le PAP existant
        role === "ORTHOPHONIST" ? (
          <form onSubmit={handleSubmit}>
            <h2>Informations de l'élève</h2>
            <label htmlFor="name">Nom :</label>
            <input type="text" id="name" value={userInfo.lastName} readOnly />

            <label htmlFor="name">Prénom :</label>
            <input type="text" id="name" value={userInfo.firstName} readOnly />

            <label htmlFor="birthdate">Date de naissance :</label>
            <input type="date" id="birthdate" value={userInfo.birthDate} readOnly />

            <label htmlFor="responsables">Responsables légaux :</label>
            <input
              type="text"
              id="responsables"
              value={formData.responsables || ""}
              onChange={handleChange}
              readOnly={!isEditable}
            />

            <h2>Besoins spécifiques</h2>
            <label htmlFor="strengths">Points d'appui :</label>
            <textarea
              id="strengths"
              value={formData.strengths || ""}
              onChange={handleChange}
              readOnly={!isEditable}
            ></textarea>

            <label htmlFor="challenges">Conséquences des troubles :</label>
            <textarea
              id="challenges"
              value={formData.challenges || ""}
              onChange={handleChange}
              readOnly={!isEditable}
            ></textarea>

            <h2>Historique des suivis</h2>
            <label htmlFor="history">Historique :</label>
            <textarea
              id="history"
              value={formData.history || ""}
              onChange={handleChange}
              readOnly={!isEditable}
            ></textarea>

            <h2>Objectifs éducatifs</h2>
            <label htmlFor="shortTermGoals">Objectifs à court terme :</label>
            <textarea
              id="shortTermGoals"
              value={formData.shortTermGoals || ""}
              onChange={handleChange}
              readOnly={!isEditable}
            ></textarea>

            <label htmlFor="longTermGoals">Objectifs à long terme :</label>
            <textarea
              id="longTermGoals"
              value={formData.longTermGoals || ""}
              onChange={handleChange}
              readOnly={!isEditable}
            ></textarea>

            <h2>Évaluation des progrès</h2>
            <label htmlFor="progressEvaluation">Évaluation :</label>
            <textarea
              id="progressEvaluation"
              value={formData.progressEvaluation || ""}
              onChange={handleChange}
              readOnly={!isEditable}
            ></textarea>

            <h2>Ressources nécessaires</h2>
            <label htmlFor="resourcesNeeded">Ressources :</label>
            <textarea
              id="resourcesNeeded"
              value={formData.ressourcesNeeded || ""}
              onChange={handleChange}
              readOnly={!isEditable}
            ></textarea>

            <h2>Observations supplémentaires</h2>
            <label htmlFor="observations">Commentaires :</label>
            <textarea
              id="observations"
              value={formData.observations || ""}
              onChange={handleChange}
              readOnly={!isEditable}
            ></textarea>

            <h2>Suivi à long terme</h2>
            <label htmlFor="followUp">Suivi :</label>
            <textarea
              id="followUp"
              value={formData.followUp || ""}
              onChange={handleChange}
              readOnly={!isEditable}
            ></textarea>

          {isEditable && <button type="submit">Soumettre</button>}
          </form>
        ) : (
          <>
            <h2>Informations personnelles</h2>
            <p><strong>Nom :</strong> {userInfo.lastName}</p>
            <p><strong>Prénom :</strong> {userInfo.firstName}</p>
            <p><strong>Date de naissance :</strong> {userInfo.birthDate}</p>
            <h2>Besoins spécifiques</h2>
            <p><strong>Points d'appui :</strong> {formData.strengths}</p>
            <p><strong>Conséquences des troubles :</strong> {formData.challenges}</p>
            <h2>Historique des suivis</h2>
            <p><strong>Historique :</strong> {formData.history}</p>
            <h2>Objectifs éducatifs</h2>
            <p><strong>Objectifs à court terme :</strong> {formData.shortTermGoals}</p>
            <p><strong>Objectifs à long terme :</strong> {formData.longTermGoals}</p>
            <h2>Évaluation des progrès</h2>
            <p><strong>Évaluation :</strong> {formData.progressEvaluation}</p>
            <h2>Ressources nécessaires</h2>
            <p><strong>Ressources :</strong> {formData.ressourcesNeeded}</p>
            <h2>Observations supplémentaires</h2>
            <p><strong>Commentaires :</strong> {formData.observations}</p>
            <h2>Suivi à long terme</h2>
            <p><strong>Suivi :</strong> {formData.followUp}</p>
          </>
        )
      ) : (
        <>
          <p>PAP non existant.</p>

          {role === "ORTHOPHONIST" && (
            // Formulaire pour créer un nouveau PAP
            <form onSubmit={handleCreate}>
              <h2>Créer un nouveau PAP</h2>
              <label htmlFor="name">Nom :</label>
              <input type="text" id="name" value={userInfo.lastName} readOnly />
          
              <label htmlFor="name">Prénom :</label>
              <input type="text" id="name" value={userInfo.firstName} readOnly />

              <label htmlFor="birthdate">Date de naissance :</label>
              <input type="date" id="birthdate" value={userInfo.birthDate} readOnly />

              <label htmlFor="responsables">Responsables légaux :</label>
              <input
                type="text"
                id="responsables"
                onChange={handleChange}
              />

              <h2>Besoins spécifiques</h2>
              <label htmlFor="strengths">Points d'appui :</label>
              <textarea
                id="strengths"
                onChange={handleChange}
              ></textarea>

              <label htmlFor="challenges">Conséquences des troubles :</label>
              <textarea
                id="challenges"
                onChange={handleChange}
              ></textarea>

              <h2>Objectifs éducatifs</h2>
              <label htmlFor="shortTermGoals">Objectifs à court terme :</label>
              <textarea
                id="shortTermGoals"
                onChange={handleChange}
              ></textarea>

              <label htmlFor="longTermGoals">Objectifs à long terme :</label>
              <textarea
                id="longTermGoals"
                onChange={handleChange}
              ></textarea>

              <h2>Évaluation des progrès</h2>
              <label htmlFor="progressEvaluation">Évaluation :</label>
              <textarea
                id="progressEvaluation"
                onChange={handleChange}
              ></textarea>

              <h2>Ressources nécessaires</h2>
              <label htmlFor="resourcesNeeded">Ressources :</label>
              <textarea
                id="resourcesNeeded"
                onChange={handleChange}
              ></textarea>

              <h2>Observations supplémentaires</h2>
              <label htmlFor="observations">Commentaires :</label>
              <textarea
                id="observations"
                onChange={handleChange}
              ></textarea>

              <h2>Suivi à long terme</h2>
              <label htmlFor="followUp">Suivi :</label>
              <textarea
                id="followUp"
                onChange={handleChange}
              ></textarea>

              <button type="submit">Créer</button>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default PAPForm;
