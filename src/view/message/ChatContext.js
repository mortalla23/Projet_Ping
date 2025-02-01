import React, { createContext, useContext, useState } from 'react';

// Créez le contexte
const ChatContext = createContext();

// Fournisseur du contexte
export const ChatProvider = ({ children }) => {
    const [conversations, setConversations] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [userId, setUserId] = useState(null);
//   const [conversations, setConversations] = useState([]); // Définir les conversations et setConversations
    return (
        <ChatContext.Provider value={{
            conversations,
            setConversations,
            users,
            setUsers,
            selectedConversationId,
            setSelectedConversationId,
	    userId,
 	    setUserId
        }}>
            {children}
        </ChatContext.Provider>
    );
};

// Hook pour utiliser le contexte
export const useChat = () => {
    return useContext(ChatContext);
};
