import React, { useEffect } from 'react';
import { ChatProvider, useChat } from './ChatContext'; // Assurez-vous d'importer le bon chemin
import ChatIcon from './ChatIcon'; // Assurez-vous d'importer le bon chemin
import { fetchConversations } from './api'; // Importez la fonction pour récupérer les conversations

const App = () => {
    return (
        <ChatProvider>
            <MainComponent />
        </ChatProvider>
    );
};

const MainComponent = () => {
    const { setUserId, selectedConversationId } = useChat();

    useEffect(() => {
        // Simulez la connexion d'un utilisateur et définissez l'ID utilisateur
        const loggedInUserId = '2'; // Remplacez ceci par l'ID réel de l'utilisateur connecté
        setUserId(loggedInUserId);
    }, [setUserId]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <header style={{ padding: '10px', backgroundColor: '#007bff', color: 'white' }}>
                <h1>Application de Chat</h1>
            </header>
            <main style={{ flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
                {/* Ajoutez ici d'autres composants ou contenu de l'application */}
                {selectedConversationId ? (
                    <p>Conversation sélectionnée : {selectedConversationId}</p>
                ) : (
                    <p>Aucune conversation sélectionnée.</p>
                )}
            </main>
            <ChatIcon /> {/* Icône de chat qui ouvre la fenêtre de chat */}
        </div>
    );
};

export default App;
