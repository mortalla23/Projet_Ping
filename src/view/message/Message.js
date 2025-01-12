import React, { useState } from "react";
import { Box, Typography, List, ListItem, ListItemText, Avatar, TextField, Button } from "@mui/material";

const Messages = () => {
  const discussions = [
    {
      id: 1,
      name: "Ange Houeto",
      date: "Dec 10, 2024",
      messages: [
        { user: "Ange Houeto", content: "Merci beaucoup brother" },
        { user: "Vous", content: "Mr l’ingénieur" },
      ],
    },
    {
      id: 2,
      name: "Saliou Camara",
      date: "Nov 29, 2024",
      messages: [
        { user: "Saliou Camara", content: "Niceee" },
        { user: "Vous", content: "Glad you liked it!" },
      ],
    },
  ];

  const [selectedUser, setSelectedUser] = useState(null); // Utilisateur sélectionné
  const [newMessage, setNewMessage] = useState(""); // Nouveau message

  const handleMessageChange = (e) => setNewMessage(e.target.value);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedUser) {
      const newMessages = [
        ...selectedUser.messages,
        { user: "Vous", content: newMessage },
      ];
      selectedUser.messages = newMessages;
      setNewMessage(""); // Réinitialiser le champ
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh"}}>
      {/* Liste des discussions à gauche */}
      <Box
        sx={{
        //   width: "50%",
          bgcolor: "#f4f4f4",
          padding: "10px",
          overflowY: "auto",
          height: "100vh",
         
          borderRight: "1px solid #ddd", // Ajout d'une bordure pour bien séparer la liste de la conversation
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Messagerie
        </Typography>
        <List>
          {discussions.map((discussion) => (
            <ListItem button key={discussion.id} onClick={() => handleSelectUser(discussion)}>
              <Avatar sx={{ mr: 2 }} />
              <ListItemText primary={discussion.name} secondary={discussion.date} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Conversation à droite */}
      <Box
        sx={{
          flexGrow: 1,
          padding: "20px",
          bgcolor: "#fff",
          height: "100vh", // Pour que la conversation occupe toute la hauteur de l'écran
          overflowY: "auto", // Permet de défiler si nécessaire
        }}
      >
        {selectedUser && (
          <>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              {/* Conversation avec {selectedUser.name} */}
              Conversation
            </Typography>

            {/* Affichage des messages */}
            <Box sx={{ maxHeight: "80vh", overflowY: "auto", marginBottom: "20px" }}>
              {selectedUser.messages.map((msg, index) => (
                <Typography key={index} sx={{ textAlign: msg.user === "Vous" ? "right" : "left" }}>
                  <strong>{msg.user}:</strong> {msg.content}
                </Typography>
              ))}
            </Box>

            {/* Champ de saisie du message */}
            <TextField
              fullWidth
              variant="outlined"
              label="Nouveau message"
              value={newMessage}
              onChange={handleMessageChange}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" sx={{ width: "100%" }} onClick={handleSendMessage}>
              Envoyer
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Messages;
