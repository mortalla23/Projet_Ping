import React, { useEffect, useState } from 'react';
import { fetchMessages, addMessage } from './api'; // Assurez-vous d'importer addMessage
import { useChat } from './ChatContext'; // Importez le contexte
import './ChatWindow.css'; // Pour les styles

const ChatWindow = ({ onClose }) => {
    const { selectedConversationId, users, userId } = useChat();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
   const { conversationName } = useChat();
    
    // Effect to handle WebSocket connection
   useEffect(() => {
        const socket = new WebSocket("ws://localhost:5000/ws"); // Remplacez l'URL par celle de votre serveur WebSocket
        
        socket.onopen = () => {
            console.log("WebSocket connecté");
            socket.send(JSON.stringify({ action: "subscribe", conversationId: selectedConversationId }));
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Message reçu Ws:", data);
        
            // Vérifiez si le type est "message" et que la conversationId correspond
            if (data.type === "message" && data.conversationId === selectedConversationId) {
                setMessages(prevMessages => [...prevMessages, data]);
                console.log("Messages");
            }
        };
        socket.onerror = function(error) {
            console.error('WebSocket Error: ', error);
        };
        socket.onclose = function(event) {
            console.log('WebSocket fermé: ', event);
        }
        return () => {
            socket.close(); // Assurez-vous de fermer la connexion WebSocket au démontage
        };
    }, [selectedConversationId]);

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
            const messageWithSender = {
                content: newMessage,
                senderId: parseInt(userId, 10),
                createdAt: new Date().toISOString(),
            };
    
            console.log("Message à envoyer:", messageWithSender);
    
            // Envoyer le message via l'API
            const sentMessage = await addMessage(selectedConversationId, userId, newMessage);
            
            console.log("Message du server", sentMessage);
    
            // Mettre à jour l'état des messages avec le nouveau message
            setMessages(prevMessages => [...prevMessages, sentMessage]); // Utilisez sentMessage si le serveur renvoie un message
            setNewMessage(''); // Réinitialise le champ de message
        }
    };
    return (
    <div className="chat-window">
    <div className="chat-header">
    <div className="title-container">
        <h2 className="chat-title">{conversationName}</h2>
    </div>
    <button className="close-button" onClick={onClose}>X</button>
    </div>
    <div className="messages-container">
        {messages.map((message) => {
            const sender = users.find(user => user.id === message.senderId);
            const senderName = message.senderId === parseInt(userId, 10) 
                ? 'Moi' 
                : (sender ? sender.username : 'Inconnu');
            
            return (
                <div key={message.id} className={`message ${message.senderId === parseInt(userId, 10) ? 'user' : 'other'}`}>
                    <div className="message-header">{senderName}</div>
                    <div className="message-bubble">{message.content}</div>
                    <div className="message-date">
    {isNaN(new Date(message.createdAt).getTime())
        ? new Date().toLocaleString() // Affiche la date actuelle si invalid
        : new Date(message.createdAt).toLocaleString()} 
</div>
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
