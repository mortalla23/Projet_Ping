import React, { useEffect, useState } from 'react';
import { useChat } from './ChatContext'; // Importez le contexte
import ChatListWindow from './ChatListWindow';
import { fetchConversations, fetchParticipantsByConversationId, fetchUsers } from './api'; // Importez les fonctions

const ChatIcon = () => {
    const { setUsers } = useChat(); // Assurez-vous d'extraire setUsers
    const { userId,setUserId } = useChat();
    const [conversations, setConversations] = useState([]);
    setUserId(localStorage.getItem('userId'));
    const [isOpen, setIsOpen] = useState([]); // État pour gérer l'ouverture/fermeture de la fenêtre de chat
    console.log("its open");
    useEffect(() => {
        const getConversations = async () => {
            if (userId) {
                try {
                    const convs = await fetchConversations(userId);
                    console.log("Conversations récupérées:", convs); // Affiche les conversations récupérées

                    const users = await fetchUsers();
                    console.log("Utilisateurs récupérés:", users); // Affiche les utilisateurs récupérés

                    // Mettre à jour l'état des utilisateurs dans le contexte
                    setUsers(users);

                    const conversationsWithParticipants = await Promise.all(
                        convs.map(async (conv) => {
                            const participants = await fetchParticipantsByConversationId(conv.id);
                            console.log(`Participants pour la conversation ${conv.id} récupérés:`, participants); // Affiche les participants récupérés

                            const participantsWithUsernames = participants.map(participant => {
                                const user = users.find(u => u.id === participant.userId);
                                const username = user ? user.username : 'Inconnu';
                                console.log(`Participant userId ${participant.userId} correspond à username: ${username}`); // Affiche le username trouvé
                                return { ...participant, username };
                            });
                            
                            return { ...conv, participants: participantsWithUsernames }; // Ajoutez les participants à la conversation
                        })
                    );
                    setConversations(conversationsWithParticipants);
                } catch (error) {
                    console.error("Erreur lors de la récupération des conversations ou des utilisateurs:", error);
                }
            }
        };

        getConversations();
    }, [userId, setUsers]); // Ajoutez setUsers comme dépendance

    const handleOpenWindow = () => {
        setIsOpen(!isOpen); // Alterne l'état d'ouverture/fermeture
    };

    return (
        <div>
            {isOpen && <ChatListWindow conversations={conversations} onClose={handleOpenWindow} />}
        </div>
    );
};

export default ChatIcon;
