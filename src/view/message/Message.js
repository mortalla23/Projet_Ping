import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, List, ListItem, ListItemText } from "@mui/material";
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const fetchConversations = async (userId) => {
    try {
        const response = await axios.get(`${BASE_URL}/conversations/user/${userId}`);
        // Vérifier si la réponse contient un tableau sinon renvoyer un tableau vide
        if (Array.isArray(response.data)) {
          return response.data;
      } else {
          console.warn("La réponse de l'API ne contient pas un tableau, réponse reçue:", response.data);
          return [];
      }
    } catch (error) {
        console.error("Erreur lors de la récupération des conversations :", error);
        return [];
    }
};

const fetchMessagesByConversation = async (conversationId) => {
    try {
        const response = await axios.get(`${BASE_URL}/messages/conversation/${conversationId}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des messages :", error);
        return [];
    }
};

const fetchUserDetails = async (userId) => {
    try {
        const response = await axios.get(`${BASE_URL}/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des détails de l'utilisateur :", error);
        return null;
    }
};

const searchUsers = async (query) => {
    try {
        const response = await axios.get(`${BASE_URL}/users/search/${query}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la recherche des utilisateurs :", error);
        return [];
    }
};

const createConversation = async (isPublic, senderId, receiverId) => {
  try {
      const response = await axios.post(`${BASE_URL}/conversations/add`, 
          new URLSearchParams({ isPublic, senderId, receiverId })
      );
      return response.data;
  } catch (error) {
      console.error("Erreur lors de la création de la conversation :", error.response?.data || error);
      return null;
  }
};



const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [conversationId, setConversationId] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const getUserId = () => {
        const orthoId = localStorage.getItem('orthoId');
        const teacherId = localStorage.getItem('teacherId');
        return teacherId || orthoId;
    };

    const userId = getUserId();

    useEffect(() => {
      if (userId) {
          fetchConversations(userId).then(data => {
              console.log("Conversations récupérées:", data);
              setConversations(Array.isArray(data) ? data : []);
              localStorage.setItem('conversations', JSON.stringify(Array.isArray(data) ? data : []));
          });
      }
    }, [userId]);
    

    const getSenderName = async (senderId) => {
      if (!senderId) return "Utilisateur inconnu";
      try {
          const user = await fetchUserDetails(senderId);
          return user ? user.username : `Utilisateur ${senderId}`;
      } catch (error) {
          console.error("Erreur lors de la récupération de l'utilisateur :", error);
          return `Utilisateur ${senderId}`;
      }
  };
  
  useEffect(() => {
    if (conversationId) {
        const fetchMessages = async () => {
            try {
                const msgs = await fetchMessagesByConversation(conversationId);
                const updatedMessages = await Promise.all(
                    msgs.map(async (msg) => ({
                        ...msg,
                        senderName: msg.sender_id === parseInt(userId)
                            ? localStorage.getItem('username')
                            : await getSenderName(msg.sender_id || msg.senderId),
                    }))
                );
                setMessages(updatedMessages);
            } catch (error) {
                console.error("Erreur lors de la récupération des messages :", error);
            }
        };
  
        fetchMessages(); // Appel immédiat
        
    }
  }, [conversationId]);
  

  
  
  useEffect(() => {
    const savedConversationId = localStorage.getItem('selectedConversation');
    if (savedConversationId) {
        setConversationId(savedConversationId);
        fetchMessagesByConversation(savedConversationId).then(async (msgs) => {
            const updatedMessages = await Promise.all(
                msgs.map(async (msg) => ({
                    ...msg,
                    senderName: msg.sender_id === parseInt(userId)
                        ? localStorage.getItem('username')
                        : await getSenderName(msg.sender_id || msg.senderId),
                }))
            );
            setMessages(updatedMessages);
        });
    }
  }, []);
  

useEffect(() => {
  const savedConversationId = localStorage.getItem('selectedConversation');
  if (savedConversationId) {
      setConversationId(savedConversationId);
      fetchMessagesByConversation(savedConversationId).then(msgs => {
          setMessages(msgs);
      });
  }
}, []);

const handleSelectConversation = (id) => {
  setConversationId(id);
  localStorage.setItem('selectedConversation', id);

  fetchMessagesByConversation(id).then(msgs => {
      setMessages(msgs);
  });
};
const handleSendMessage = async () => {
  if (newMessage.trim() && conversationId) {
      try {
          await axios.post(`${BASE_URL}/messages/add`, null, {
              params: {
                  conversationId,
                  userId,
                  content: newMessage,
                  senderName: localStorage.getItem('username')  // Ajouter le username de l'expéditeur
              }
          });

          // Rafraîchir les messages après l'envoi
          fetchMessagesByConversation(conversationId).then((msgs) => {
              setMessages(msgs);
          });

          setNewMessage("");  // Réinitialiser le champ du message
      } catch (error) {
          console.error("Erreur lors de l'envoi du message :", error);
      }
  }
};




    const handleSearch = async (e) => {
        setSearchQuery(e.target.value);
        if (e.target.value.trim().length > 0) {
            const results = await searchUsers(e.target.value);
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    const handleCreateConversation = async (user) => {
      try {
          const response = await axios.get(`${BASE_URL}/conversations/check`, {
              params: { senderId: userId, receiverId: user.id }
          });
  
          if (response.data.exists) {
              alert("Cette conversation existe déjà.");
              return;
          }
      } catch (error) {
          console.error("Erreur lors de la vérification de la conversation :", error);
      }
  
      // Créer la conversation si elle n'existe pas
      const newConversation = await createConversation(false, userId, user.id);
      if (newConversation) {
          // Rafraîchir la liste des conversations après la création pour récupérer toutes les données
          fetchConversations(userId).then(data => {
            const filteredConversations = data.filter(conv => 
                conv.userIds.includes(parseInt(userId))
            );
              setConversations(filteredConversations);
              localStorage.setItem('conversations', JSON.stringify(filteredConversations));
          });
  
          setSearchQuery("");
          setSearchResults([]);
      }
  };
  
  const filteredConversations = conversations.filter(conv =>
    Array.isArray(conv.userIds) && conv.userIds.includes(parseInt(userId))
);


    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            <Box sx={{ width: "30%", padding: 2, borderRight: "1px solid #ddd" }}>
                <TextField
                    fullWidth
                    label="Rechercher un utilisateur"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearch}
                    sx={{ mb: 2 }}
                />
                {searchResults.length > 0 && (
                    <List>
                        {searchResults.map((user) => (
                            <ListItem key={user.id} button onClick={() => handleCreateConversation(user)}>
                                <ListItemText primary={user.username} />
                            </ListItem>
                        ))}
                    </List>
                )}
              <Typography variant="h6">Conversations</Typography>
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conv) => {
                    const currentUser = localStorage.getItem('username');
                    const otherUser = conv?.usernames?.find(username => username !== currentUser);

                    return (
                      <Box key={conv.id} onClick={() => handleSelectConversation(conv.id)}
                        sx={{ cursor: "pointer", padding: 1, borderBottom: "1px solid #ddd" }}>
                        <Typography>{otherUser || `Conversation ${conv.id}`}</Typography>
                      </Box>
                    );
                  })
                ) : (
                  <Typography>Aucune conversation trouvée.</Typography>
                )}
              
            </Box>
            <Box sx={{ width: "70%", padding: 2 }}>
              <Typography variant="h6">Messages</Typography>
              {messages.map((msg) => {
    const currentUsername = localStorage.getItem('username');  // Récupérer le nom de l'utilisateur connecté
    const senderName = msg.senderName || msg.sender_id;  // Utiliser senderName si disponible, sinon sender_id

    return (
        <Typography key={msg.id} sx={{
            backgroundColor: senderName === currentUsername ? 'green' : 'gray',
            padding: '5px',
            borderRadius: '5px',
            color: 'white',
            display: 'inline-block',
            marginBottom: '5px'
        }}>
            <strong>{senderName}:</strong> {msg.content}
        </Typography>
    );
})}




              <TextField 
                  value={newMessage} 
                  onChange={(e) => setNewMessage(e.target.value)} 
                  fullWidth 
                  label="Nouveau message" 
              />
              <Button onClick={handleSendMessage} variant="contained">Envoyer</Button>
          </Box>


        </Box>
    );
};

export default Messages;
