import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, List, ListItem, ListItemText } from "@mui/material";
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const fetchConversations = async (userId) => {
    try {
        const response = await axios.get(`${BASE_URL}/conversations/user/${userId}`);
        console.log("Conversations pour l'utilisateur:", userId);
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
        console.log("Données des messages reçues de l'API :", response.data);
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
      const userId = localStorage.getItem('patientId') || localStorage.getItem('orthoId') || localStorage.getItem('teacherId');
      console.log("Utilisateur connecté, ID récupéré:", userId);
      return userId;
  };
  
  
    useEffect(() => {
      const userId = getUserId();
      console.log("Utilisateur connectée, ID:", userId); // Vérifier que l'ID est correct ici
    }, []);
    
    useEffect(() => {
      const userId = getUserId();
      console.log("Utilisateur connectéeee, ID:", userId); 
      if (userId) {
        fetchConversations(userId).then(data => {
          console.log("Conversations récupérées avant filtrage :", data);
    
          // Filtrage en fonction de l'ID de l'utilisateur
          const filteredConversations = data.filter(conv => {
            const userIdInt = parseInt(userId, 10);
            console.log("Conversation ID: " + conv.id + ", User IDs: " + conv.userIds);
    
            // Vérifier que l'utilisateur connecté n'est pas dans la conversation
          return conv.userIds.includes(userIdInt);
          });
    
          console.log("Conversations après filtrage :", filteredConversations);
          setConversations(filteredConversations);
          localStorage.setItem('conversations', JSON.stringify(filteredConversations));
        }).catch(error => {
          console.error("Erreur lors de la récupération des conversations :", error);
        });
      }
    }, []);
    
    

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
      const userId = getUserId();
        fetchMessagesByConversation(conversationId).then(async (msgs) => {
            const updatedMessages = await Promise.all(
                msgs.map(async (msg) => {
                    let senderName;

                    // Vérification si le message provient de l'utilisateur actuel
                    if (parseInt(msg.sender_id) === parseInt(userId)) {
                        senderName = localStorage.getItem('username') || "Moi";
                    } else {
                        const userDetails = await fetchUserDetails(msg.sender_id);
                        senderName = userDetails ? userDetails.username : `Utilisateur ${msg.sender_id}`;
                    }

                    return { ...msg, senderName };
                })
            );

            setMessages(updatedMessages);
        });
    }
}, [conversationId]);

  
  useEffect(() => {
    // Vérifier si une conversation est enregistrée et la supprimer pour démarrer avec une page vide
    localStorage.removeItem('selectedConversation'); 
    setConversationId(null);  // Assurer que l'ID est null au démarrage
    setMessages([]); // Vider la liste des messages
  }, []);
  
  

useEffect(() => {
  const savedConversationId = localStorage.getItem('selectedConversation');
  if (savedConversationId) {
      setConversationId(savedConversationId);
      handleSelectConversation(savedConversationId);
      fetchMessagesByConversation(savedConversationId).then(msgs => {
          setMessages(msgs);
      });
  }
}, []);

const [refreshKey, setRefreshKey] = useState(0);


useEffect(() => {
    if (conversationId) {
        fetchMessagesByConversation(conversationId).then(msgs => {
            setMessages(msgs);
        });
    }
}, [conversationId, refreshKey]);


const handleSelectConversation = async (id) => {
  const userId = getUserId();
  setConversationId(id);
  setRefreshKey(prevKey => prevKey + 1);
  localStorage.setItem('selectedConversation', id);

  try {
      const msgs = await fetchMessagesByConversation(id);

      const updatedMessages = await Promise.all(
          msgs.map(async (msg) => {
              let senderName;
              if (parseInt(msg.sender_id) === parseInt(userId)) {
                  senderName = "Moi";
              } else {
                  const userDetails = await fetchUserDetails(msg.sender_id);
                  senderName = userDetails ? userDetails.username : `Utilisateur ${msg.sender_id}`;
              }
              return { ...msg, senderName };
          })
      );

      setMessages([]);  // Forcer un re-render en vidant l'état temporairement
      setTimeout(() => setMessages(updatedMessages), 0);  // Re-rendu correct
  } catch (error) {
      console.error("Erreur lors de la récupération des messages :", error);
  }
};



useEffect(() => {
  const savedUsername = localStorage.getItem('username');
  if (savedUsername) {
      console.log("Utilisateur connecté :", savedUsername);
  } else {
      console.warn("Aucun nom d'utilisateur trouvé");
  }
}, []);




const handleSendMessage = async () => {
  const userId = getUserId();
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
          const msgs = await fetchMessagesByConversation(conversationId);
            setMessages(msgs);

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
      const userId = getUserId();
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
  
    return (
      <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Section Conversations */}
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
        {conversations.length > 0 ? (
          conversations.map((conv) => {
            const currentUser = localStorage.getItem('username');
            const otherUser = conv?.usernames?.find(username => username !== currentUser);
    
            return (
              <Box
                key={conv.id}
                onClick={() => handleSelectConversation(conv.id)}
                sx={{
                  cursor: "pointer",
                  padding: 1,
                  borderBottom: "1px solid #ddd",
                  backgroundColor: conversationId === conv.id ? '#f0f0f0' : 'transparent',
                }}
              >
                <Typography>{otherUser || `Conversation ${conv.id}`}</Typography>
              </Box>
            );
          })
        ) : (
          <Typography>Aucune conversation trouvée.</Typography>
        )}
      </Box>
    
      {/* Section Messages */}
      <Box sx={{ width: "70%", padding: 2 }}>
  {conversationId ? (
    <>
      <Typography variant="h6">Messages</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {messages.map((msg) => {
          const currentUsername = localStorage.getItem('username');
          const isSentByCurrentUser = msg.senderName === currentUsername;
          console.log("Utilisateur actuel :", currentUsername);
       
          return (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                justifyContent: isSentByCurrentUser ? 'flex-end' : 'flex-start',
              }}
            >
              <Typography
                sx={{
                  backgroundColor: isSentByCurrentUser ? 'green' : 'gray',
                  padding: '10px',
                  borderRadius: '10px',
                  color: 'white',
                  maxWidth: '60%',
                  wordBreak: 'break-word',
                  textAlign: isSentByCurrentUser ? 'right' : 'left',
                }}
              >
                <strong>{isSentByCurrentUser ? 'Moi' : msg.senderName}:</strong> {msg.content}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <TextField
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        fullWidth
        label="Nouveau message"
        sx={{ mt: 2 }}
      />
      <Button onClick={handleSendMessage} variant="contained" sx={{ mt: 1 }}>
        Envoyer
      </Button>
    </>
  ) : (
    <Typography variant="h6" sx={{ textAlign: 'center', marginTop: '20%' }}>
      Sélectionnez une conversation pour afficher les messages
    </Typography>
  )}
</Box>

    </Box>
    
    );
};

export default Messages;
