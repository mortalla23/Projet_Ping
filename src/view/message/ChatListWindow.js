import React, { useEffect, useState, useMemo } from 'react';
import { useChat } from './ChatContext'; // Importez le contexte
import { fetchMessageById, createConversation, addMessage, addUserToConversation, searchUsers } from './api'; // Importez les fonctions API
import './ChatListWindow.css'; // Styles CSS
import ChatWindow from './ChatWindow.js';

const ChatListWindow = ({ onClose, conversations }) => {
    const { setSelectedConversationId} = useChat();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [showFilter, setShowFilter] = useState(false); // État pour afficher/masquer le filtre
    const [firstMessage, setFirstMessage] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [lastMessages, setLastMessages] = useState([]);
    const [userSuggestions, setUserSuggestions] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [filterTerm, setFilterTerm] = useState(''); // État pour le filtre
    const { userId } = useChat();
    const [notification, setNotification] = useState(null);
    const {setConversations} = useChat();
    const { setConversationName } = useChat();
    useEffect(() => {
        const getLastMessages = async () => {
            const promises = conversations.map(async (conv) => {
                try {
                    if (conv.lastMessageId) {
                        const lastMessage = await fetchMessageById(conv.lastMessageId);
                        return {
                            id: conv.id,
                            content: lastMessage.content,
                            createdAt: lastMessage.createdAt,
                        };
                    }
                    return { id: conv.id, content: 'Démarrez votre échange', createdAt: null };
                } catch (error) {
                    console.error("Error fetching message:", error);
                    return { id: conv.id, content: 'Démarrez votre échange', createdAt: null };
                }
            });

            const results = await Promise.all(promises);
		console.log(results);
            const sortedMessages = results
                .sort((msgA, msgB) => {
                    const dateA = msgA.createdAt ? new Date(msgA.createdAt).getTime() : 0;
                    const dateB = msgB.createdAt ? new Date(msgB.createdAt).getTime() : 0;
                    return dateB - dateA; // Tri décroissant
                })
                .map((msg) => ({
                    ...msg,
                    createdAt: msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'N/A',
                }));
	    console.log(sortedMessages);
            setLastMessages(sortedMessages);
        };

        getLastMessages();
    }, [conversations]);

    const sortedConversations = useMemo(() => {
        return lastMessages.map((msg) => {
            return conversations.find((conv) => conv.id === msg.id);
        }).filter(Boolean); // Filtrer les undefined
    }, [lastMessages, conversations]);

    // Filtrer les conversations basées sur le filterTerm
    const filteredConversations = useMemo(() => {
        return sortedConversations.filter(conv => {
            const lastMessage = lastMessages.find(msg => msg.id === conv.id);
            const participants = conv.participants.map(p => p.username).join(', ').toLowerCase(); // Récupérer les noms des participants
            const messageContent = lastMessage?.content.toLowerCase() || '';

            // Vérifier si le filterTerm correspond au contenu du message ou aux participants
            return messageContent.includes(filterTerm.toLowerCase()) || participants.includes(filterTerm.toLowerCase());
        });
    }, [sortedConversations, lastMessages, filterTerm]);

    const handleSelectUser = (user) => {
        if (!selectedUsers.some((u) => u.id === user.id)) {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    const handleSelect = (id) => {
        setSelectedConversationId(id);
        const conversation = conversations.find(conv => conv.id === id);
         const conversationName = conversation ? conversation.participants.map(p => p.username).join(', ') : 'Conversation';
            console.log("ConversationName",conversation);
            
        setConversationName(conversationName);
        setIsChatOpen(true);
    };

    const handleDeselectUser = (userId) => {
        setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
    };

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchTerm.trim() === '') {
                setUserSuggestions([]);
                return;
            }

            setLoadingSuggestions(true);
            const suggestions = await searchUsers(searchTerm);
            setUserSuggestions(suggestions);
            setLoadingSuggestions(false);
        };

        const delayDebounceFn = setTimeout(() => {
            fetchSuggestions();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleCreateConversation = async () => {
        if (selectedUsers.length > 0 && firstMessage.trim()) {
            const conversationResponse = await createConversation(isPublic, userId);
            const conversationId = conversationResponse.id;

            await addMessage(conversationId, userId, firstMessage);

            for (const user of selectedUsers) {
                await addUserToConversation(conversationId, user.id);
            }

            setSelectedConversationId(conversationId);
            setIsChatOpen(true);
            setShowSearch(false);
            setSelectedUsers([]);
            setFirstMessage('');
            setIsPublic(false);
        }
    };

    // Fonction pour gérer les notifications
    function handleNotification(notification) {
        setNotification(notification);

        // Masquer la notification après 3 secondes
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    }

    
   useEffect(() => {
        const ws = new WebSocket('ws://localhost:5000/ws2');
        
        ws.onopen = () => {
            console.log('WebSocket2 connecté');
            
            // Envoie le message d'abonnement après que la connexion soit établie
            const subscribeMessage = JSON.stringify({
                action: "subscribe",
                userId: userId, // Assurez-vous que userId est bien défini
            });
            ws.send(subscribeMessage);
        };
    
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
    
            if (message.type === 'notification') {
                handleNotification(message);

            } else if (message.type === 'newMessage') {
		console.log(message);
                setLastMessages((prevLastMessages) => {
                    const updatedMessages = [...prevLastMessages];
                    const messageIndex = updatedMessages.findIndex(msg => msg.id === message.conversationId);
                    
                    if (messageIndex !== -1) {
                        // Met à jour le message existant
                        updatedMessages[messageIndex] = {
                            ...updatedMessages[messageIndex],
                            content: message.content,
                            createdAt: message.createdAt,
                        };
                    } else {
                        // Ajoute un nouveau message
                        updatedMessages.push({
                            id: message.conversationId,
			    senderId: message.senderId,
                            content: message.content,
                            createdAt: message.createdAt,
                        });
                    }
    
                    return updatedMessages.sort((msgA, msgB) => {
                        const dateA = msgA.createdAt ? new Date(msgA.createdAt).getTime() : 0;
                        const dateB = msgB.createdAt ? new Date(msgB.createdAt).getTime() : 0;
                        return dateB - dateA; // Tri décroissant par date
                    });
                });
            
                // Met à jour les conversations si nécessaire
                setConversations((prevConversations) => {
                    return prevConversations.map(conv => {
                        if (conv.id === message.conversationId) {
                            return {
                                ...conv,
                                lastMessageId: message.id // ou toute autre logique pour mettre à jour
                            };
                        }
                        return conv;
                    });
                });
            }
            else if (message.message) { // Vérifie si un message d'abonnement a été reçu
                console.log(message.message); // Affiche le message d'abonnement
            }
        };
        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
        return () => {
            ws.close(); // Ferme la connexion WebSocket lors du démontage du composant
        };
    }, [userId]); // Assurez-vous que userId est une dépendance

    // Gérer l'affichage de la barre de filtre
    const toggleFilter = () => {
        setShowFilter(!showFilter);
        if (showSearch) {
            setShowSearch(false); // Masque la barre de recherche si elle est visible
        }
    };

    // Gérer l'affichage de la barre de recherche
    const toggleSearch = () => {
        setShowSearch(!showSearch);
        if (showFilter) {
            setShowFilter(false); // Masque la barre de filtre si elle est visible
        }
    };

    return (
        <div className="chat-list-window">
            {!isChatOpen ? (
                <>
                     {notification && (
                <div className="notification-popup">
                    <span>{notification.sender} a envoyé : "{notification.content}"</span>
                </div>
            )}
                    <div className="chat-header">
                        <h2>Mes Conversations</h2>
                        <button className="close-button" onClick={onClose}>X</button>
                        <button className="new-conversation-icon" onClick={toggleSearch}>
                            📝
                        </button>
                        <button className="filter-icon" onClick={toggleFilter}> {/* Toggle pour afficher/masquer le filtre */}
                            🔍
                        </button>
                    </div>
                    {showSearch && (
                        <>
                            <input
                                type="text"
                                placeholder="Rechercher un utilisateur..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            <div className="user-suggestions">
                                {loadingSuggestions ? (
                                    <div>Chargement...</div>
                                ) : userSuggestions.length > 0 ? (
                                    userSuggestions.map((user) => (
                                        <div key={user.id} className="user-suggestion" onClick={() => handleSelectUser(user)}>
                                            {user.username}
                                        </div>
                                    ))
                                ) : (
                                    searchTerm && <div>Aucun utilisateur trouvé</div>
                                )}
                            </div>
                            {selectedUsers.length > 0 && (
                                <div>
                                    <h3>Participants sélectionnés:</h3>
                                    <ul>
                                        {selectedUsers.map((user) => (
                                            <li key={user.id}>
                                                {user.username} <button onClick={() => handleDeselectUser(user.id)}>❌</button>
                                            </li>
                                        ))}
                                    </ul>
                                    <input
                                        type="text"
                                        placeholder="Écrivez le premier message..."
                                        value={firstMessage}
                                        onChange={(e) => setFirstMessage(e.target.value)}
                                        className="first-message-input"
                                    />
                                    <div className="public-private-toggle">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={isPublic}
                                                onChange={(e) => setIsPublic(e.target.checked)}
                                            />
                                            Conversation publique
                                        </label>
                                    </div>
                                    <button onClick={handleCreateConversation}>Créer Conversation</button>
                                </div>
                            )}
                        </>
                    )}
                    {showFilter && (
                        <>
                            <input
                                type="text"
                                placeholder="Filtrer les messages ou participants..."
                                value={filterTerm}
                                onChange={(e) => setFilterTerm(e.target.value)}
                                className="filter-input"
                            />
                        </>
                    )}
                    {conversations.length > 0 ? (
                        <ul>
                            {filteredConversations.map((conv) => (
                                <li key={conv.id} onClick={() => handleSelect(conv.id)} style={{ cursor: 'pointer' }}>
                                    <strong>{conv.participants.map((p) => p.username).join(', ')}</strong>: 
                                    {lastMessages.find(msg => msg.id === conv.id)?.content || "Chargement..."}
                                    {lastMessages.find(msg => msg.id === conv.id)?.createdAt && (
                                        <span style={{ fontSize: '0.8em', color: 'gray', marginLeft: '10px' }}>
                                            {lastMessages.find(msg => msg.id === conv.id)?.createdAt}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <li>Aucune conversation disponible</li>
                    )}
                </>
            ) : (
                <div className="chat-window-container">
                    <button className="back-button" onClick={() => setIsChatOpen(false)}>← Retour</button>
                    <ChatWindow onClose={onClose} />
                </div>
            )}
        </div>
    );
};

export default ChatListWindow;
