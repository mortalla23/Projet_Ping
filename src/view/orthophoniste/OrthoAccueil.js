import React, { useState, useEffect } from "react";
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
import { Logout, AccountCircle } from "@mui/icons-material";
import logo from "../../assets/images/logos/bauman.png";

const OrthoAccueil = () => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [showDynamicContent, setShowDynamicContent] = useState(true);
  const [showBanner, setShowBanner] = useState(true); // Etat pour afficher la bannière de cookies
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false); // Etat pour afficher la politique de confidentialité

  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Utilisateur",
    role: "Non défini",
    email: "inconnu@example.com",
  };

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const hiddenPages = [
      "/ortho/dashboard/allPatients",
      "/ortho/dashboard/profile",
      "/ortho/dashboard/listedespatients", // Ajout de la nouvelle page
    ];
    if (hiddenPages.includes(location.pathname)) {
      setShowDynamicContent(false);
    } else {
      setShowDynamicContent(true);
    }
  }, [location]);

  const handleMenuOpen = (event) => setMenuAnchor(event.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/connexion";
  };

  const handleProfileRedirect = () => {
    navigate("/ortho/dashboard/profile");
  };

  const handleLogoClick = () => {
    window.location.href = "/ortho/dashboard"; // Rediriger vers la page d'accueil
  };

  const acceptCookies = () => {
    alert("Vous avez accepté les cookies.");
    setShowBanner(false);
  };

  const declineCookies = () => {
    alert("Vous avez refusé les cookies.");
    setShowBanner(false);
  };

  const closePrivacyPolicy = () => setShowPrivacyPolicy(false);

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
            sx={{
              width: 70,
              height: 70,
              margin: "0 auto",
              boxShadow: "0 0 10px #00000033",
              cursor: "pointer",
            }}
            onClick={handleLogoClick}
          />
          <Typography variant="h5" sx={{ mt: 2, fontWeight: "bold" }}>Menu</Typography>
        </Box>

        {/* Liens du Menu */}
        <List>
          <ListItem button component={NavLink} to="/ortho/dashboard/allPatients" sx={linkStyle}>
            <ListItemText primary="Mes patients" />
          </ListItem>
          <ListItem button component={NavLink} to="/ortho/dashboard/listedespatients" sx={linkStyle}>
            <ListItemText primary="Liste des patients" />
          </ListItem>
        </List>
      </Drawer>

      {/* Contenu Principal */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {/* Barre Supérieure */}
        <Box sx={{
          display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2,
          bgcolor: "#5BA8B4", color: "#FFFFFF", py: 2, px: 3, borderRadius: "10px", boxShadow: "0 2px 5px #00000033",
        }}>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>Tableau de bord de l'orthophoniste</Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={handleProfileRedirect} aria-label="Aller au profil">
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
        {showDynamicContent && (
          <Box
            sx={{
              backgroundColor: "#FFFFFF",
              padding: 2,
              borderRadius: "8px",
              boxShadow: "0 2px 5px #00000033",
            }}
          >
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

      {/* Bannière de Consentement */}
      {showBanner && (
        <Box sx={{
          position: "fixed", bottom: 0, width: "100%", bgcolor: "#5BA8B4", color: "white", textAlign: "center", p: 2,
          zIndex: 1200, boxShadow: "0 -2px 5px rgba(0, 0, 0, 0.1)",
        }}>
          <Typography>
            Nous utilisons des cookies pour améliorer votre expérience.{" "}
            <span style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => setShowPrivacyPolicy(true)}>
              Voir la politique de confidentialité
            </span>.
          </Typography>
          <Box sx={{ mt: 1 }}>
            <button onClick={acceptCookies} style={buttonStyle}>Accepter</button>
            <button onClick={declineCookies} style={buttonStyle}>Refuser</button>
          </Box>
        </Box>
      )}

      {/* Politique de Confidentialité */}
            {showPrivacyPolicy && (
              <Box sx={{
                position: "fixed", top: 0, left: 0, right: 0, bottom: 0, bgcolor: "rgba(0, 0, 0, 0.8)",
                color: "white", overflowY: "scroll", zIndex: 1500, p: 3,
              }}>
                <Box sx={{ maxWidth: 800, margin: "0 auto", bgcolor: "white", color: "#000", p: 3, borderRadius: 2 }}>
                  <Typography variant="h4" sx={{ mb: 2, color: "#5BA8B4" }}>Politique de Confidentialité</Typography>
                  
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>Introduction</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    La protection de vos données personnelles est une priorité pour Baumann Ed. Cette politique de confidentialité explique
                    comment vos données sont collectées, utilisées et protégées dans le cadre de notre service de messagerie sécurisé.
                  </Typography>
      
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>1. Responsable du traitement des données</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <ul>
                      <li><strong>Nom de l’entreprise</strong> : Baumann Ed.</li>
                      <li><strong>Statut juridique</strong> : Société par actions simplifiée au capital de 10 000 euros.</li>
                      <li><strong>Siège social</strong> : Hôtel des compétences, Rue du Bois Rond, 76410 Cléon, France.</li>
                      <li><strong>RCS</strong> : 952 538 593 RCS Rouen.</li>
                      <li><strong>Email</strong> : contact@methode-baumann.com</li>
                      <li><strong>Téléphone</strong> : 06 01 23 45 67</li>
                    </ul>
                  </Typography>
      
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>2. Données collectées</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <ul>
                      <li><strong>Patients</strong> : Nom, prénom, adresse e-mail, informations liées aux exercices, messages échangés.</li>
                      <li><strong>Enseignants</strong> : Nom, prénom, adresse e-mail, messages échangés, recommandations.</li>
                      <li><strong>Orthophonistes</strong> : Nom, prénom, adresse e-mail, consignes et messages échangés.</li>
                    </ul>
                  </Typography>
      
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>2.2 Données techniques</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <ul>
                      <li>Adresse IP</li>
                      <li>Données de connexion (date, heure, durée)</li>
                      <li>Informations sur l’appareil (navigateur, système d’exploitation)</li>
                    </ul>
                  </Typography>
      
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>3. Finalités du traitement des données</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Les données collectées sont utilisées pour :
                    <ul>
                      <li>Assurer la communication sécurisée.</li>
                      <li>Suivre les exercices des patients.</li>
                      <li>Améliorer les services grâce à l'analyse des interactions.</li>
                      <li>Respecter les obligations légales.</li>
                    </ul>
                  </Typography>
      
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>4. Base légale du traitement</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <ul>
                      <li><strong>Consentement</strong> : Accord donné lors de l’inscription.</li>
                      <li><strong>Intérêt légitime</strong> : Garantir la sécurité et améliorer les services.</li>
                      <li><strong>Obligations légales</strong> : Respect des lois en vigueur.</li>
                    </ul>
                  </Typography>
      
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>5. Durée de conservation</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <ul>
                      <li><strong>Messages</strong> : 1 an après la fin de l’utilisation.</li>
                      <li><strong>Comptes utilisateurs</strong> : 3 ans après la dernière connexion.</li>
                      <li><strong>Données techniques</strong> : 6 mois après leur collecte.</li>
                    </ul>
                  </Typography>
      
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>6. Sécurité des données</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Nous utilisons des mesures comme le chiffrement TLS/SSL et l’hébergement sur des serveurs conformes au RGPD pour protéger vos données.
                  </Typography>
      
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>7. Vos droits</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <ul>
                      <li>Droit d’accès, de rectification et d’effacement.</li>
                      <li>Droit à la limitation du traitement.</li>
                      <li>Droit d’opposition et à la portabilité des données.</li>
                    </ul>
                    Pour exercer vos droits, contactez-nous à : contact@methode-baumann.com
                  </Typography>
      
                  <Typography variant="body1" sx={{ mb: 2 }}>© Baumann Ed. Tous droits réservés.</Typography>
      
                  <button onClick={closePrivacyPolicy} style={buttonStyle}>Fermer</button>
                </Box>
              </Box>
            )}
          </Box>
        );
      };
      

// Style des boutons et liens
const buttonStyle = {
  backgroundColor: "#5BA8B4",
  color: "white",
  border: "none",
  padding: "8px 16px",
  margin: "5px",
  cursor: "pointer",
  borderRadius: "5px",
};

const linkStyle = {
  "&.Mui-selected, &:hover": {
    bgcolor: "#5BA8B4",
    color: "#FFFFFF",
    fontWeight: "bold",
  },
};

export default OrthoAccueil;
