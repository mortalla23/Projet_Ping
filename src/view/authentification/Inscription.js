import React, { useState } from 'react';
import { Grid, Box, Card, Typography, Stack, Button, TextField, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';
import PageContainer from '../../component/container/PageContainer';
import Logo from '../../layouts/logo/Logo'; // Conserve le logo
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

const Inscription = () => {
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);
const [otp, setOtp] = useState('');
const [setUserId] = useState(null);
  // State pour les données du formulaire
  const [formData, setFormData] = useState({
    username: '',
    lastName: '',
    firstName: '',
    email: '',
    password: '',
    role: 'TEACHER',
    birthDate: '', // Utilisation de "birthDate" pour correspondre à l'API
    acceptTerms: false,
  });

  if (localStorage.getItem('user')) {
        if(localStorage.getItem('teacherId')){
      
      return <Navigate to="/teacher/dashboard" />;
    } else if (localStorage.getItem('orthoId')) {
      return <Navigate to="/ortho/dashboard" />;
    } else if (localStorage.getItem('patientId')) {
      return <Navigate to="/patient/dashboard" />;
    }
    }
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
    if (!formData.username.trim()) {
      alert("Le nom d'utilisateur est obligatoire.");
      return false;
    }
    if (!formData.lastName.trim()) {
      alert("Le nom est obligatoire.");
      return false;
    }
    if (!formData.firstName.trim()) {
      alert("Le prénom est obligatoire.");
      return false;
    }
    if (!formData.email.trim()) {
      alert("L'email est obligatoire.");
      return false;
    }
    if (!formData.password.trim() || formData.password.length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères.");
      return false;
    }
    if (!formData.birthDate) {
      alert("La date de naissance est obligatoire.");
      return false;
    }
    if (!formData.acceptTerms) {
      alert("Vous devez accepter les conditions générales !");
      return false;
    }
    return true;
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      username: '',
      lastName: '',
      firstName: '',
      email: '',
      password: '',
      role: 'TEACHER',
      birthDate: '',
      acceptTerms: false,
    });
  };

  // Gestion de la soumission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Exclusion de `acceptTerms`
      const { acceptTerms, ...dataToSend } = formData;

      console.log("Données envoyées :", dataToSend);

      const response = await axios.post('http://localhost:5000/api/users/inscription', dataToSend, {
        headers: {
          'Content-Type': 'application/json',
        },
        //httpsAgent: new (require("https").Agent)({
          //rejectUnauthorized: false, // Ignore les erreurs SSL
        //}),
      });

      console.log("Réponse de l'API :", response.data);
      alert('Inscription réussie !');
      setOtpSent(true);
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error);
      if (error.response) {
        console.error("Statut HTTPS :", error.response.status);
        console.error("Données de la réponse :", error.response.data);
        alert(`Erreur : ${error.response.data || "Une erreur est survenue."}`);
      } else {
        console.error("Erreur sans réponse du serveur :", error);
        alert("Impossible de se connecter au serveur.");
      }
    }
  };

  const handleOtpSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/verify-otp', null, {
        params: {
          email: formData.email,
          otp: otp,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        //httpsAgent: new (require("https").Agent)({
          //rejectUnauthorized: false, // Ignore les erreurs SSL
        //}),
      });

      console.log("Réponse de l'API :", response.data);
      alert('OTP validé avec succès !');
      resetForm();
      
      navigate('/connexion');
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
    <PageContainer title="Register" description="This is Register page">
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
        <Grid
          container
          spacing={0}
          justifyContent="center"
          sx={{
            height: '100vh',
            padding: { xs: 2, sm: 4 }, // Ajout de padding pour les petits écrans
          }}
        >
          <Grid
            item
            xs={12}
            sm={10}
            md={8}
            lg={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card
              elevation={9}
              sx={{
                p: { xs: 2, sm: 4 }, // Réduction du padding pour les petits écrans
                width: '100%',
                maxWidth: { xs: '350px', sm: '400px', lg: '500px' }, // Responsiveness
                borderRadius: '12px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Box display="flex" justifyContent="center" mb={2}>
                <Logo style={{ maxWidth: '100px', maxHeight: '50px' }} /> {/* Logo conservé */}
              </Box>
              <Typography fontWeight="700" variant="h5" mb={2} textAlign="center">
                Créer un compte
              </Typography>
              <form onSubmit={handleSubmit} style={{ maxWidth: '100%' }}>
                <Stack spacing={2}>
                  <TextField
                    id="lastName"
                    name="lastName"
                    placeholder="Votre nom..."
                    variant="outlined"
                    fullWidth
                    sx={{
                      backgroundColor: '#fff',
                      borderRadius: '4px',
                    }}
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                  <TextField
                    id="firstName"
                    name="firstName"
                    placeholder="Votre prénom..."
                    variant="outlined"
                    fullWidth
                    sx={{
                      backgroundColor: '#fff',
                      borderRadius: '4px',
                    }}
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  <TextField
                    id="username"
                    name="username"
                    placeholder="Votre nom d'utilisateur..."
                    variant="outlined"
                    fullWidth
                    sx={{
                      backgroundColor: '#fff',
                      borderRadius: '4px',
                    }}
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                  <TextField
                    id="email"
                    name="email"
                    placeholder="Votre email..."
                    variant="outlined"
                    fullWidth
                    sx={{
                      backgroundColor: '#fff',
                      borderRadius: '4px',
                    }}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <TextField
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    variant="outlined"
                    fullWidth
                    type="password"
                    sx={{
                      backgroundColor: '#fff',
                      borderRadius: '4px',
                    }}
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <TextField
                    id="role"
                    name="role"
                    select
                    variant="outlined"
                    fullWidth
                    sx={{
                      backgroundColor: '#fff',
                      borderRadius: '4px',
                    }}
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="TEACHER">Enseignant</MenuItem>
                    <MenuItem value="ORTHOPHONIST">Orthophoniste</MenuItem>
                    <MenuItem value="PATIENT">Patient</MenuItem>
                  </TextField>
                  <TextField
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    variant="outlined"
                    fullWidth
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                    label="Date de naissance"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      backgroundColor: '#fff',
                      borderRadius: '4px',
                    }}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleChange}
                        required 
                      />
                    }
                    label={
                      <span>
                        J'accepte les{' '}
                        <a 
                          href="/pdf/CGU.pdf" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer', position: "relative", zIndex: 10 }}
                        >
                          conditions générales d'utilisation
                        </a>
                      </span>
                    }
                  />

                </Stack>
                <Box mt={3}>
                  <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      textTransform: 'none',
                      borderRadius: '8px',
                    }}
                    type="submit"
                  >
                    S'INSCRIRE
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
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Inscription;
