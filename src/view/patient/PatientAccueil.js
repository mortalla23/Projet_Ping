import React, { useState , useEffect  } from "react";
import { useLocation, NavLink, Outlet } from "react-router-dom";
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
import { Logout, AccountCircle } from "@mui/icons-material";
import logo from "../../assets/images/logos/bauman.png";

const PatientAccueil = () => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [showDynamicContent, setShowDynamicContent] = useState(true);

  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Utilisateur",
    role: "Non défini",
    email: "inconnu@example.com",
  };

 // Utiliser useLocation pour détecter la route actuelle
  const location = useLocation();
  useEffect(() => {
    const hiddenPages = [
        "/patient/dashboard/anamnese"+localStorage.getItem('patientId'),
        "/patient/dashboard/cr",
        "/patient/dashboard/ajIntervenant",
        "/patient/dashboard/ascolaires",
        "/patient/dashboard/documents",
      ];
     // Si l'utilisateur est sur l'une de ces pages, on cache la section dynamique
     if (hiddenPages.includes(location.pathname)) {
      setShowDynamicContent(false);
    } else {
      setShowDynamicContent(true);
    }
  }, [location]);
  const isSpecificPage = location.pathname === "/patient/dashboard/anamnese"+localStorage.getItem('patientId');

  const handleMenuOpen = (event) => setMenuAnchor(event.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/connexion";
  };
  const handleLogoClick = () => {
    window.location.href = "/patient/dashboard"; // Rediriger vers la page d'accueil
  };

  return (
    <Box sx={{ display: "flex", height: isSpecificPage ? "150vh" : "100vh", bgcolor: "#E6F0F3" }}>
        
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
          <ListItem button component={NavLink} to={`/patient/dashboard/anamnese/${localStorage.getItem('patientId')}`} 
    sx={linkStyle}
  >
            <ListItemText primary="Anamnèse" />
          </ListItem>
          <ListItem button component={NavLink} to="/patient/dashboard/cr" sx={linkStyle}>
            <ListItemText primary="Mes Compte-Rendus" />
          </ListItem>
          <ListItem button component={NavLink} to="/patient/dashboard/ajIntervenant" sx={linkStyle}>
            <ListItemText primary="Ajout d'un intervenant" />
          </ListItem>
          <ListItem button component={NavLink} to="/patient/dashboard/ascolaires" sx={linkStyle}>
            <ListItemText primary="Aménagements scolaires" />
          </ListItem>
          <ListItem button component={NavLink} to="/patient/dashboard/documents" sx={linkStyle}>
            <ListItemText primary="Mes Documents" />
          </ListItem>
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
            Tableau de bord du patient
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={handleMenuOpen} aria-label="Menu utilisateur">
              <AccountCircle sx={{ fontSize: 40, color: "#FFFFFF" }} />
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

export default PatientAccueil;
