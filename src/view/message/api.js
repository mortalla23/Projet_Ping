import axios from 'axios';

const BASE_URL = 'https://localhost:5000/api';

// Créer une instance d'Axios
const apiClient = axios.create({
    baseURL: BASE_URL,
});
console.log(localStorage.getItem('token'));
// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Remplacez ceci par le chemin où vous stockez le token
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Fonction pour récupérer toutes les conversations d'un utilisateur
export const fetchConversations = async (userId) => {
    
    const response = await apiClient.get(`${BASE_URL}/conversations/user/${userId}`);
    return response.data;
};

// Fonction pour récupérer les messages d'une conversation
export const fetchMessages = async (conversationId) => {
    const response = await apiClient.get(`${BASE_URL}/messages/conversation/${conversationId}`);
    return response.data;
};

// Fonction pour ajouter un message à une conversation
export const addMessage = async (conversationId, senderId, content) => {
    const response = await apiClient.post(`${BASE_URL}/messages/add`, null, {
        params: {
            conversationId: conversationId,
            userId: senderId,
            content: content,
        },
    });
    return response.data;
};

// Fonction pour créer une conversation
export const createConversation = async (isPublic, userId) => {
    try {
        console.log("isPublic:", isPublic, "userId:", userId); // Vérifiez les valeurs

        const response = await apiClient.post(`${BASE_URL}/conversations/add`, null, {
            params: {
                isPublic: isPublic,
                userId: userId, // userId est inclus ici dans les paramètres
            },
        });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la création de la conversation :", error);
        throw error;
    }
};

// Fonction pour ajouter un utilisateur à une conversation existante
export const addUserToConversation = async (conversationId, userId) => {
    const response = await apiClient.post(`${BASE_URL}/participants/add`, null, {
        params: {
            conversationId: conversationId,
            userId: userId,
        },
    });
    return response.data;
};

// Fonction pour récupérer un utilisateur par son ID
export const fetchUserById = async (userId) => {
    const token = localStorage.getItem('token'); 
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json', // Ajoutez d'autres en-têtes si nécessaire
        },
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'utilisateur');
    }
    return await response.json();
};

// Fonction pour récupérer un message par son ID
export const fetchMessageById = async (messageId) => {
    const token = localStorage.getItem('token'); 
    const response = await fetch(`${BASE_URL}/messages/${messageId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json', // Ajoutez d'autres en-têtes si nécessaire
        },
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération du message');
    }
    return await response.json();
};

// Fonction pour récupérer les participants d'une conversation
export const fetchParticipantsByConversationId = async (conversationId) => {
    const token = localStorage.getItem('token'); 
    const response = await fetch(`${BASE_URL}/participants/conversation/${conversationId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json', // Ajoutez d'autres en-têtes si nécessaire
        },
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des participants');
    }
    return await response.json();
};

// Fonction pour récupérer tous les utilisateurs
export const fetchUsers = async () => {
    const token = localStorage.getItem('token'); 
    const response = await fetch(`${BASE_URL}/users/all`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json', // Ajoutez d'autres en-têtes si nécessaire
        },
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des utilisateurs');
    }
    return await response.json();
};

//Fonction pour récupérer une miste d'utilisateur selon le username
export const searchUsers = async (query) => {
    const token = localStorage.getItem('token'); 
    try {
        const response = await fetch(`${BASE_URL}/users/search/${query}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json', // Ajoutez d'autres en-têtes si nécessaire
            },
        });
        if (response.status === 404) {
            return []; // Aucun utilisateur trouvé
        }
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des utilisateurs.");
        }
        return await response.json();
    } catch (error) {
        console.error("Erreur API - searchUsers:", error);
        return [];
    }
};
