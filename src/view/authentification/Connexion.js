import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
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

  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
 
  // Validation des champs
  const validateForm = () => {
    if (!formData.email.trim()) {
      alert("L'email est obligatoire.");
      return false;
    }
    if (!formData.password.trim()) {
      alert('Le mot de passe est obligatoire.');
      return false;
    }
    return true;
  };
  const getRedirectPath = (role) => {
    switch (role) {
      case 'TEACHER':
        return '/teacher/dashboard';
      case 'ORTHOPHONIST':
        return '/ortho/dashboard';
      case 'PATIENT':
        return '/patient/dashboard';
      default:
        return '/connexion';
    }
  };
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

    if (!validateForm()) {
      return;
    }

    const loginData = {
      email: formData.email, // Authentification par email
      password: formData.password,
    };
    try {
      const response = await axios.post('https://localhost:5000/api/users/connexion', loginData);
      const user = response.data;

     // Appelez handleLogin pour mettre à jour le localStorage
     handleLogin(user.id, user.username,user.token); // Enregistrer l'ID et le nom d'utilisateur dans localStorage
     
      // Vérifie si l'utilisateur est un enseignant
      if (user.role === 'TEACHER') {
        // Stocker le teacherId dans localStorage
        localStorage.setItem('teacherId', user.id);
        localStorage.setItem('username', user.username);
        console.log(localStorage.getItem('userId')); // Vérifie que l'ID est bien stocké
        toast.success('Connexion réussie en tant qu’enseignant.');
        navigate('/teacher/dashboard');
      } else if (user.role === 'ORTHOPHONIST') {
        // Si l'utilisateur est un orthophoniste, stocke également orthoId
        localStorage.setItem('orthoId', user.id);  // Stocke l'ID de l'orthophoniste
        localStorage.setItem('username', user.username);
        toast.success('Connexion réussie en tant qu’orthophoniste.');
        navigate('/ortho/dashboard');
      } else if (user.role === 'PATIENT') {
        localStorage.setItem('patientId', user.id);  // Stocke l'ID de du patient( eleve)
        localStorage.setItem('username', user.username);
        toast.success('Connexion réussie en tant que patient.');
        navigate('/patient/dashboard');
      } else {
        toast.error('Rôle non reconnu. Connexion échouée.');
        return;
      }
    
      // Stocker les données utilisateur si nécessaire (par ex., localStorage ou contexte)
      localStorage.setItem('user', JSON.stringify(user));  // Stocker les informations utilisateur
      alert('Connexion réussie !');
      console.log(response.data);
      console.log("Détails de l'utilisateur :", user);
      console.log("Nom d'utilisateur stocké:", localStorage.getItem('username'));

      console.log("Utilisateur connecté, ID:", localStorage.getItem('patientId') || localStorage.getItem('orthoId') || localStorage.getItem('teacherId'));
      navigate(getRedirectPath(user.role));  // Après avoir confirmé que l'ID est correct
      
    
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Erreur lors de la connexion.");
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
