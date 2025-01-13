import React, { useState } from "react";
import { Box, Typography, Drawer, IconButton, Menu, MenuItem, ListItem, ListItemText, Avatar, List } from "@mui/material";
import { Logout, AccountCircle, Message } from "@mui/icons-material";
import { NavLink, Outlet, useNavigate } from "react-router-dom"; 
import logo from "../../assets/images/logos/bauman.png";
import Messages from "../message/Message"; // Modifiez le chemin ici

const EnseiAccueil = () => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [openMessaging, setOpenMessaging] = useState(false); // La gestion de l'état de la messagerie
  const navigate = useNavigate(); 

  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Utilisateur",
    role: "Non défini",
    email: "inconnu@example.com",
  };

  const handleMenuOpen = (event) => setMenuAnchor(event.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/connexion";
  };

  const handleLogoClick = () => {
    window.location.href = "/teacher/dashboard"; // Rediriger vers la page d'accueil
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
        <Box sx={{ textAlign: "center", py: 3, borderBottom: "1px solid #ffffff50" }}>
          <Avatar
            alt="Logo"
            src={logo}
            sx={{ width: 70, height: 70, margin: "0 auto", boxShadow: "0 0 10px #00000033" , cursor: "pointer" }}
            onClick={handleLogoClick}
          />
          <Typography variant="h5" sx={{ mt: 2, fontWeight: "bold" }}>Menu</Typography>
        </Box>

        {/* Liens du Menu */}
        <List>
          <ListItem button component={NavLink} to="/teacher/dashboard/eleves" sx={linkStyle}>
            <ListItemText primary="Tous les élèves" />
          </ListItem>
          <ListItem button component={NavLink} to="/teacher/dashboard/historique" sx={linkStyle}>
            <ListItemText primary="Historique éducation" />
          </ListItem>
          <ListItem button component={NavLink} to="/teacher/dashboard/rapports" sx={linkStyle}>
            <ListItemText primary="Rapports d'exercices" />
          </ListItem>
          <ListItem button component={NavLink} to="/teacher/dashboard/amenagements" sx={linkStyle}>
            <ListItemText primary="Aménagements scolaires" />
          </ListItem>
        </List>
      </Drawer>

      {/* Contenu Principal */}
      <Box sx={{
        flexGrow: 1,
        p: 3,
        transition: "margin-right 0.3s ease",
        marginRight: openMessaging ? "420px" : 0, // Pousse le contenu principal vers la gauche si la messagerie est ouverte
      }}>
        {/* Barre Supérieure */}
        <Box sx={{
          display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2,
          bgcolor: "#5BA8B4", color: "#FFFFFF", py: 2, px: 3, borderRadius: "10px", boxShadow: "0 2px 5px #00000033",
        }}>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>Tableau de bord de l'enseignant</Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={handleMenuOpen} aria-label="Menu utilisateur">
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
        <Box sx={{ backgroundColor: "#FFFFFF", padding: 2, borderRadius: "8px", boxShadow: "0 2px 5px #00000033" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>Bienvenue {user.username} !</Typography>
          <Typography variant="body1" sx={{ marginTop: 1 }}>Vous êtes connecté.</Typography>
        </Box>
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

const linkStyle = {
  "&.Mui-selected, &:hover": {
    bgcolor: "#5BA8B4",
    color: "#FFFFFF",
    fontWeight: "bold",
  },
};

export default EnseiAccueil;
