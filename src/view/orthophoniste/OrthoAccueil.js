import React, { useState , useEffect  } from "react";
import { useLocation, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  
} from "@mui/material";
import { Logout, AccountCircle, Message } from "@mui/icons-material";
import logo from "../../assets/images/logos/bauman.png";
import Messages from "../message/Message"; // Modifiez le chemin ici

const OrthoAccueil = () => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [openMessaging, setOpenMessaging] = useState(false); // La gestion de l'état de la messagerie
  const [showDynamicContent, setShowDynamicContent] = useState(true);

  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Utilisateur",
    role: "Non défini",
    email: "inconnu@example.com",
  };

 // Utiliser useLocation pour détecter la route actuelle
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const hiddenPages = [
        "/ortho/dashboard/allPatients",
        "/ortho/dashboard/profile",
        // "/ortho/dashboard/ajIntervenant",
        // "/ortho/dashboard/ascolaires",
        // "/ortho/dashboard/documents",
      ];
     // Si l'utilisateur est sur l'une de ces pages, on cache la section dynamique
     if (hiddenPages.includes(location.pathname)) {
      setShowDynamicContent(false);
    } else {
      setShowDynamicContent(true);
    }
  }, [location]);
  const isSpecificPage = location.pathname === "/ortho/dashboard/allPatients";

  const handleMenuOpen = (event) => setMenuAnchor(event.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/connexion";
  };

  const handleProfileRedirect = () => {
    navigate("/ortho/dashboard/profile");
  };

  // Fonction pour actualiser la page et revenir à la page d'accueil
  const handleLogoClick = () => {
    window.location.href = "/ortho/dashboard"; // Rediriger vers la page d'accueil
  };

  // Ouvrir/fermer la messagerie
  const toggleMessaging = () => setOpenMessaging(!openMessaging);
  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#E6F0F3" }}>
        
      {/* Menu Latéral */}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 260,
          "& .MuiDrawer-paper": {
            width: 260,
            boxSizing: "border-box",
            bgcolor: "#5BA8B4",
            color: "#FFFFFF",
            padding: "10px 0",
          },
        }}
      >
        {/* Logo et Titre */}
        <Box
          sx={{
            textAlign: "center",
            py: 3,
            borderBottom: "1px solid #ffffff50",
          }}
        >
          <Avatar
            alt="Logo"
            src={logo}
            sx={{
              width: 70,
              height: 70,
              margin: "0 auto",
              boxShadow: "0 0 10px #00000033",
              cursor: "pointer", // Indiquer que l'image est cliquable
            }}
            onClick={handleLogoClick} // Ajouter le clic pour rediriger
          />
          <Typography variant="h5" sx={{ mt: 2, fontWeight: "bold" }}>
            Menu
          </Typography>
        </Box>

        {/* Liens du Menu */}
        <List>
          <ListItem button component={NavLink} to="/ortho/dashboard/allPatients" sx={linkStyle}>
            <ListItemText primary="Mes patients" />
          </ListItem>
          {/* <ListItem button component={NavLink} to="/" sx={linkStyle}>
            <ListItemText primary="Mes Compte-Rendus" />
          </ListItem> */}
          
        </List>
      </Drawer>

      {/* Contenu Principal */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {/* Barre Supérieure */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            bgcolor: "#5BA8B4",
            color: "#FFFFFF",
            py: 2,
            px: 3,
            borderRadius: "10px",
            boxShadow: "0 2px 5px #00000033",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Tableau de bord de l'orthophoniste
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={handleProfileRedirect} aria-label="Aller au profil">
              <AccountCircle sx={{ fontSize: 40, color: "#FFFFFF" }} />
            </IconButton>
            <IconButton onClick={toggleMessaging} aria-label="Messagerie">
              <Message sx={{ fontSize: 40, color: "#FFFFFF" }} />
            </IconButton>
            
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={handleMenuClose}
              sx={{ "& .MuiPaper-root": { minWidth: 200 } }}
            >
              <MenuItem disabled sx={{ color: "#555" }}>{user.name}</MenuItem>
              <MenuItem disabled sx={{ color: "#555" }}>{user.email}</MenuItem>
              <MenuItem disabled sx={{ color: "#555" }}>{user.role}</MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
                <Logout fontSize="small" sx={{ mr: 1 }} /> Déconnexion
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Contenu Dynamique */}
       
         {/* Contenu Dynamique */}
         {showDynamicContent && (
          <Box sx={{ backgroundColor: "#FFFFFF", padding: 2, borderRadius: "8px", boxShadow: "0 2px 5px #00000033" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Bienvenue {user.username} !
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 1 }}>
              Vous êtes connecté.
            </Typography>
          </Box>
        )}
        
        <Outlet />
      </Box>

      {/* Drawer pour la messagerie (zone superposée sur la page principale) */}
      {openMessaging && (
        <Box sx={{
          position: "fixed", top: 0, right: 0, bottom: 0, width: "400px", bgcolor: "#ffffff", zIndex: 1300,
          boxShadow: "0 0 15px rgba(0, 0, 0, 0.3)", padding: "20px", transition: "width 0.3s ease",
          height: "100%", overflowY: "auto", maxWidth: "600px", display: "block",
        }}>
          <Messages />
        </Box>
      )}
    </Box>
  );
};

// Style des liens
const linkStyle = {
  "&.Mui-selected, &:hover": {
    bgcolor: "#5BA8B4",
    color: "#FFFFFF",
    fontWeight: "bold",
  },
};

export default OrthoAccueil;
