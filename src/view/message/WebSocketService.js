import { useEffect, useState, useRef } from "react";

const WebSocketService = (userId) => {
    const [messages, setMessages] = useState([]);
    const socketRef = useRef(null);
    const wsUrl = `ws://localhost:5000/ws2`;

    useEffect(() => {
        const connectWebSocket = () => {
            if (socketRef.current) {
                socketRef.current.close();
            }

            socketRef.current = new WebSocket(wsUrl);

            socketRef.current.onopen = () => {
                console.log("WebSocket connecté");
                socketRef.current.send(JSON.stringify({ action: "subscribe", userId }));
            };

            socketRef.current.onmessage = (event) => {
              const data = JSON.parse(event.data);
              console.log("Message WebSocket reçu :", data);
  
              if (data.type === "newMessage" || data.type === "notification") {
                  setMessages((prev) => {
                      // Éviter les doublons ici aussi
                      if (!prev.some(msg => msg.id === data.id)) {
                          return [...prev, data];
                      }
                      return prev;
                  });
              }
          };

            socketRef.current.onerror = (error) => {
                console.error("WebSocket Error:", error);
            };

            socketRef.current.onclose = (event) => {
                console.log("WebSocket déconnecté, tentative de reconnexion...");
                setTimeout(connectWebSocket, 5000); // Reconnexion après 5 secondes
            };
        };

        connectWebSocket();

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [userId]);

    const sendMessage = (message) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(message));
        } else {
            console.error("WebSocket non connecté. Tentative d'envoi échouée.");
        }
    };

    return { messages, sendMessage };
};

export default WebSocketService;
