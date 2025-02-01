import React, { useEffect, useState } from 'react';
import { fetchMessages, addMessage } from './api'; // Assurez-vous d'importer addMessage
import { useChat } from './ChatContext'; // Importez le contexte
import './ChatWindow.css'; // Pour les styles

const ChatWindow = ({ onClose }) => {
    const { selectedConversationId, conversations, users, userId } = useChat();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const conversation = conversations.find(conv => conv.id === selectedConversationId);
    const conversationName = conversation ? conversation.participants.map(p => p.username).join(', ') : 'Conversation';

    // Effect to handle WebSocket connection
   /* useEffect(() => {
        const socket = new WebSocket("ws://192.168.1.29:8080/ws2"); // Remplacez l'URL par celle de votre serveur WebSocket
        
        socket.onopen = () => {
            console.log("WebSocket2 connecté");
            socket.send(JSON.stringify({ conversationId: selectedConversationId }));
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Message reçu Ws2:", data);

            if (data.conversationId === selectedConversationId) {
                setMessages(prevMessages => [...prevMessages, data]);
            }
        };

        return () => {
            socket.close(); // Assurez-vous de fermer la connexion WebSocket au démontage
        };
    }, [selectedConversationId]);
*/
    useEffect(() => {
        const getMessages = async () => {
            if (selectedConversationId) {
                const data = await fetchMessages(selectedConversationId);
                setMessages(data);
            }
        };

        getMessages();
    }, [selectedConversationId]);

    const handleSendMessage = async () => {
        if (newMessage.trim()) {
            // Envoyer le message via l'API
            const sentMessage = await addMessage(selectedConversationId, userId, newMessage);
            console.log("Message du server",sentMessage); 
            // Créer un nouvel objet pour le message avec l'ID de l'utilisateur
            const messageWithSender = {
                content:newMessage, // Inclut tous les champs de sentMessage
                senderId: parseInt(userId,10), // Ajoute l'identifiant de l'utilisateur
                createdAt: new Date().toISOString() // La date actuelle au format ISO
            };
    
            // Mettre à jour l'état des messages avec le nouveau message enrichi
            setMessages([...messages, messageWithSender]);
            console.log("Les messages",messages);
            setNewMessage(''); // Réinitialise le champ de message
        }
    };

    return (
        <div className="chat-window">
            <div className="chat-header">
                <h2>{conversationName}</h2>
                <button className="close-button" onClick={onClose}>X</button>
            </div>
            <div className="messages-container">
                {messages.map((message) => {
                    const sender = users.find(user => user.id === message.senderId);
                    const senderName = sender ? sender.username : 'Inconnu';

                    return (
                        <div key={message.id} className="message">
                            <strong>{senderName}: </strong>
                            <span>{message.content}</span>
                        </div>
                    );
                })}
            </div>
            <div className="message-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Écrivez un message..."
                    className="input-field"
                />
                <button onClick={handleSendMessage}>Envoyer</button>
            </div>
        </div>
    );
};

export default ChatWindow;
