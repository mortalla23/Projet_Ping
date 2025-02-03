import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import {
  Box,
  Grid,
  Card,
  Stack,
  Typography,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
} from '@mui/material';

// components
import PageContainer from '../../component/container/PageContainer';
import Logo from '../../layouts/logo/Logo';
import axios from 'axios';

const Connexion = () => {


  const navigate = useNavigate();  
  // State pour les données du formulaire
  const [formData, setFormData] = useState({
    email: '', // Modifié pour refléter l'authentification par email
    password: '',
    remember: false,
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [mail, setMail] = useState('');

  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  if (localStorage.getItem('user')) {
    if(localStorage.getItem('teacherId')){
  
  return <Navigate to="/teacher/dashboard" />;
} else if (localStorage.getItem('orthoId')) {
  return <Navigate to="/ortho/dashboard" />;
} else if (localStorage.getItem('patientId')) {
  return <Navigate to="/patient/dashboard" />;
}
}
  const handleLogin = (userId, username,token) => {
    // Nettoyer les anciennes données
    localStorage.removeItem('patientId');
    localStorage.removeItem('orthoId');
    localStorage.removeItem('teacherId');
    
    // Stocker les nouvelles informations de l'utilisateur connecté
    localStorage.setItem('userId', userId); 
    localStorage.setItem('username', username);
    localStorage.setItem('token',token);
    //console.log("Token reçu :", token);
};

  // Gestion de la soumission
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setMail(formData.email);
      const response = await axios.post('http://localhost:5000/api/users/connexion',{email:formData.email,password:formData.password}, {
        headers: {
          'Content-Type': 'application/json',
        },
        httpsAgent: new (require("https").Agent)({
          rejectUnauthorized: false,
        }),
      });

      alert('Connexion réussie ! Veuillez entrer l\'OTP envoyé à votre email.',response.data);
      setOtpSent(true);
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      if (error.response) {
        alert(`Erreur : ${error.response.data.message || "Une erreur est survenue."}`);
      } else {
        alert("Impossible de se connecter au serveur.");
      }
    }
  };

  const handleOtpSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/verify-otp', null, {
        params: {
          email: mail,
          otp: otp,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        httpsAgent: new (require("https").Agent)({
          rejectUnauthorized: false,
        }),
      });
      const user = response.data;
      console.log("Réponse de l'API :", user);
  
      alert('OTP validé avec succès !');
       // Appelez handleLogin pour mettre à jour le localStorage
     handleLogin(user.id, user.username,user.token); // Enregistrer l'ID et le nom d'utilisateur dans localStorage
     localStorage.setItem('user', JSON.stringify(user)); // Stocker l'objet utilisateur complet
     alert('Connexion réussie !');
     console.log(response.data);
     console.log("Détails de l'utilisateur :", user);
     console.log("Nom d'utilisateur stocké:", localStorage.getItem('username'));

      // Vérifie si l'utilisateur est un enseignant
  if (user.role === 'TEACHER') {
    // Stocker le teacherId dans localStorage
    localStorage.setItem('teacherId', user.id);
    localStorage.setItem('username', user.username);
    console.log(localStorage.getItem('userId')); // Vérifie que l'ID est bien stocké
    console.log("pas bougé?");
    toast.success('Connexion réussie en tant que professeur.');
    setTimeout(() => navigate('/teacher/dashboard'), 1000);
    console.log("pas bougé!");
  } else if (user.role === 'ORTHOPHONIST') {
    // Si l'utilisateur est un orthophoniste, stocke également orthoId
    localStorage.setItem('orthoId', user.id);  // Stocke l'ID de l'orthophoniste
    localStorage.setItem('username', user.username);
    toast.success('Connexion réussie en tant qu’orthophoniste.');
    setTimeout(() => navigate('/ortho/dashboard'), 1000);
  } else if (user.role === 'PATIENT') {
    localStorage.setItem('patientId', user.id);  // Stocke l'ID de du patient( eleve)
    localStorage.setItem('username', user.username);
    toast.success('Connexion réussie en tant que patient.');
    setTimeout(() => navigate('/patient/dashboard'), 1000);
  } else {
    toast.error('Rôle non reconnu. Connexion échouée.');
    return;
  }
    } catch (error) {
      console.error('Erreur lors de la validation de l\'OTP :', error);
      if (error.response) {
        alert(`Erreur : ${error.response.data.message || "Une erreur est survenue."}`);
      } else {
        alert("Impossible de se connecter au serveur.");
      }
    }
  };
  return (
    <PageContainer title="Login" description="This is Login page">
      <ToastContainer />
      <Box
        sx={{
          position: 'relative',
          '&:before': {
            content: '""',
            background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            position: 'absolute',
            height: '100%',
            width: '100%',
            opacity: '0.3',
          },
        }}
      >
        <Grid container spacing={0} justifyContent="center" sx={{ height: '100vh' }}>
          <Grid
            item
            xs={12}
            sm={12}
            lg={4}
            xl={3}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card elevation={9} sx={{ p: 4, zIndex: 1, width: '100%', maxWidth: '500px' }}>
              {/* Logo */}
              <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                <Logo />
              </Box>
              {/* Title */}
              <Typography fontWeight="700" variant="h4" mb={3} textAlign="center">
                Connexion
              </Typography>

              {/* Form Fields */}
              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      component="label"
                      htmlFor="email"
                      mb="5px"
                    >
                      Email
                    </Typography>
                    <TextField
                      id="email"
                      name="email"
                      placeholder="Entrez votre email"
                      variant="outlined"
                      fullWidth
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      component="label"
                      htmlFor="password"
                      mb="5px"
                    >
                      Mot de passe
                    </Typography>
                    <TextField
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Entrez votre mot de passe"
                      variant="outlined"
                      fullWidth
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </Box>
                  <Stack justifyContent="space-between" direction="row" alignItems="center">
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="remember"
                            checked={formData.remember}
                            onChange={handleChange}
                          />
                        }
                        label="Se souvenir de moi"
                      />
                    </FormGroup>
                  </Stack>
                </Stack>
                {/* Submit Button */}
                <Box mt={3}>
                  <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                    type="submit"
                    sx={{
                      textTransform: 'none',
                      borderRadius: '8px',
                    }}
                  >
                    Connexion
                  </Button>
                </Box>
              </form>
              {otpSent && (
                <Box mt={3}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    component="label"
                    htmlFor="otp"
                    mb="5px"
                  >
                    OTP
                  </Typography>
                  <TextField
                    id="otp"
                    name="otp"
                    placeholder="Entrez l'OTP"
                    variant="outlined"
                    fullWidth
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                  <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleOtpSubmit}
                    sx={{
                      textTransform: 'none',
                      borderRadius: '8px',
                      mt: 2,
                    }}
                  >
                    Valider OTP
                  </Button>
                </Box>
              )}
              {/* Footer */}
              <Stack direction="row" spacing={1} justifyContent="center" mt={3}>
                <Typography variant="body2">Vous n'avez pas de compte ?</Typography>
                <Typography
                  component={Link}
                  to="/inscription"
                  fontWeight="500"
                  sx={{
                    textDecoration: 'none',
                    color: 'primary.main',
                  }}
                >
                  Créer un compte
                </Typography>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Connexion;
