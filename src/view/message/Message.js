import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, CircularProgress } from "@mui/material";

// Composant pour rechercher un utilisateur
const SearchUsers = ({ onSelectUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]); // Liste des utilisateurs trouvés
  const [loading, setLoading] = useState(false); // Indicateur de chargement

  const handleSearch = async () => {
    if (!searchTerm.trim()) return; // Eviter les recherches vides

    setLoading(true); // Commencer à charger
    try {
      const response = await fetch(`http://localhost:5000/api/teacher/students?searchTerm=${searchTerm}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data); // Remplir la liste avec les utilisateurs trouvés
      } else {
        console.error("Erreur lors de la recherche des utilisateurs");
      }
    } catch (error) {
      console.error("Erreur lors de la recherche des utilisateurs", error);
    } finally {
      setLoading(false); // Terminer le chargement
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <TextField
        fullWidth
        label="Rechercher un utilisateur"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button onClick={handleSearch} sx={{ mt: 2 }} variant="contained">
        {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Rechercher'}
      </Button>

      <Box sx={{ mt: 2 }}>
        {users.length === 0 && !loading && searchTerm && (
          <Typography variant="body1">Aucun utilisateur trouvé.</Typography>
        )}
        {users.map((user) => (
          <Button
            key={user.id}
            sx={{ display: "block", marginBottom: 1 }}
            onClick={() => onSelectUser(user)} // Sélectionner un utilisateur
          >
            {user.username}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

// Composant de la messagerie
const Messages = ({ userId }) => {
  const [messages, setMessages] = useState([]); // Tableau des messages
  const [newMessage, setNewMessage] = useState(""); // Message à envoyer
  const [socket, setSocket] = useState(null);
  const [conversationId, setConversationId] = useState(null); // Conversation ID actuelle
  const [selectedUser, setSelectedUser] = useState(null); // Utilisateur sélectionné pour la conversation
  const teacherId = localStorage.getItem('teacherId');  // Assurez-vous que teacherId est bien récupéré depuis localStorage

  // Connexion WebSocket
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5000/ws'); // Connexion au serveur WebSocket

    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket est ouvert");
    };
  
    ws.onerror = (error) => {
      console.error("Erreur WebSocket: ", error);
    };
  
    ws.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, messageData]);
    };
  
    ws.onclose = (event) => {
      if (event.wasClean) {
        console.log('Connexion WebSocket fermée proprement');
      } else {
        console.error('Connexion WebSocket fermée avec erreur');
      }
    };
  
    return () => ws.close(); // Fermer la connexion lors du démontage du composant
  }, []);
  
  // Fonction pour envoyer un message
// Fonction pour envoyer un message
const handleSendMessage = async () => {
    const teacherId = localStorage.getItem('teacherId');  // Récupérer l'ID de l'enseignant
    if (!teacherId) {
      console.error('Teacher ID manquant dans le localStorage.');
      alert('Veuillez vous connecter à nouveau.');
      return; // Arrêter si le teacherId est manquant
    }

    if ( socket && conversationId) {
      const message = {
        content: newMessage,
        senderId: teacherId, // Utiliser teacherId comme senderId
        conversationId: conversationId, // Utiliser l'ID de la conversation sélectionnée
      };
  
      if (!message.senderId || !message.conversationId) {
        console.error("ID manquant pour l'envoi du message.");
        alert("Les ID de l'utilisateur ou de la conversation sont manquants.");
        return;
      }
  
      // Envoi du message via WebSocket
      socket.send(JSON.stringify(message));
  
      setNewMessage(""); // Réinitialiser le champ du message
  
      // Ajouter immédiatement le message dans l'état local pour un affichage instantané
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...message, senderId: teacherId, content: newMessage },
      ]);
  
      // Appel API pour envoyer le message au backend
      try {
        const response = await fetch('http://localhost:5000/api/messages/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message), // Utilise un JSON complet ici
        });
  
        if (!response.ok) {
          throw new Error('Erreur lors de l\'envoi du message');
        }
      } catch (error) {
        console.error('Erreur API lors de l\'envoi du message', error);
      }
    } else {
      console.error("Les IDs nécessaires ne sont pas définis.");
      alert("Assurez-vous que l'ID de la conversation et l'ID de l'enseignant sont bien définis.");
    }
  };
  

  // Sélectionner un utilisateur pour démarrer la conversation
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    createConversation(user); // Créer la conversation avec l'utilisateur sélectionné
  };

  // Créer une conversation via l'API backend
  const createConversation = async (selectedUser) => {
    const storedUserId = localStorage.getItem('teacherId');
    if (!storedUserId) {
      console.error('Aucun userId trouvé dans localStorage.');
      alert('Veuillez vous connecter à nouveau.');
      return;
    }
  
    try {
      // Vérification des paramètres avant l'envoi
      console.log('userId:', storedUserId, 'isPublic:', true);
  
      const response = await fetch(`http://localhost:5000/api/conversations/create?userId=${storedUserId}&isPublic=true`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
      });
  
      const responseText = await response.text();
      console.log('Réponse brute du serveur:', responseText);
  
      if (response.ok) {
        const data = JSON.parse(responseText);
        // Stocker les ID de la conversation et de l'utilisateur pour l'utiliser dans l'envoi de messages
        setConversationId(data.id);
        setSelectedUser(selectedUser); // ID de l'utilisateur (teacherId)
      } else {
        console.error('Erreur lors de la création de la conversation:', responseText);
        alert('Erreur lors de la création de la conversation.');
      }
    } catch (error) {
      console.error('Erreur lors de la création de la conversation', error);
      alert('Erreur lors de la création de la conversation.');
    }
  };
  

  return (
    <Box sx={{ display: "flex", height: "100vh", maxWidth: "100vw" }}>
      {/* Zone de conversation à gauche */}
      <Box sx={{ 
        width: "70%", 
        padding: 2, 
        display: "flex", 
        flexDirection: "column", 
        height: "100vh", 
        backgroundColor: "#fff",
        borderRight: "1px solid #ddd", 
      }}>
        {selectedUser ? (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Messagerie avec {selectedUser.username} 
            
            </Typography>

            {/* Affichage des messages */}
           
            <Box sx={{ flexGrow: 1, maxHeight: "60vh", overflowY: "auto", marginBottom: 2 }}>
            {messages.length === 0 && (
                <Typography variant="body1" sx={{ textAlign: "center", fontSize: "1.2rem" }}>
                Aucune conversation pour le moment.
                </Typography>
            )}
            {messages.map((msg, index) => (
                <Typography 
                key={index} 
                sx={{ 
                    textAlign: msg.senderId === teacherId ? "right" : "left", // Aligner à droite si c'est l'enseignant
                    marginBottom: 1, 
                }}
                >
                <strong>{msg.senderId === teacherId ? "Vous" : selectedUser.username}:</strong> {msg.content}
                </Typography>
            ))}
            </Box>


            {/* Champ de saisie du message */}
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <TextField
                fullWidth
                label="Nouveau message"
                variant="outlined"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" sx={{ width: "100%" }} onClick={handleSendMessage}>
                Envoyer
              </Button>
            </Box>
          </>
        ) : (
          <Box sx={{ flexGrow: 1, height: "20vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Typography variant="body1" sx={{ fontSize: "1.2rem" }}>
              Sélectionnez un utilisateur pour démarrer une conversation.
            </Typography>
          </Box>
        )}
      </Box>

      {/* Zone de recherche à droite */}
      <Box sx={{ 
        width: "30%", 
        padding: 2, 
        backgroundColor: "#f4f4f4", 
        height: "100vh",
        overflowY: "auto",
        borderLeft: "1px solid #ddd",
      }}>
        <SearchUsers onSelectUser={handleSelectUser} />
      </Box>
    </Box>
  );
};

export default Messages;
