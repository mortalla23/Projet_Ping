import React, { useState } from 'react';
import { Grid, Box, Card, Typography, Stack, Button, TextField, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';
import PageContainer from '../../component/container/PageContainer';
import Logo from '../../layouts/logo/Logo';

const Inscription = () => {
  // State pour les données du formulaire
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'TEACHER',
    birth_date: '',
    acceptTerms: false,
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
    if (!formData.username.trim()) {
      alert("Le nom d'utilisateur est obligatoire.");
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
    if (!formData.birth_date) {
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
      email: '',
      password: '',
      role: 'TEACHER',
      birth_date: '',
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
      console.log(formData);
      const response = await axios.post('http://localhost:5000/api/users/inscription', formData);
      alert('Inscription réussie !');
      resetForm();
      console.log(response.data);
    } catch (error) {
      if (error.response && error.response.data) {
        alert(`Erreur : ${error.response.data.message || "Une erreur s'est produite."}`);
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
                <Logo style={{ maxWidth: '100px', maxHeight: '50px' }} />
              </Box>
              <Typography fontWeight="700" variant="h5" mb={2} textAlign="center">
                Create Account
              </Typography>
              <form onSubmit={handleSubmit} style={{ maxWidth: '100%' }}>
                <Stack spacing={2}>
                  <TextField
                    id="username"
                    name="username"
                    placeholder="Enter your name"
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
                    placeholder="Enter your email"
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
                    id="birth_date"
                    name="birth_date"
                    type="date"
                    variant="outlined"
                    fullWidth
                    value={formData.birth_date}
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
                    label="J'accepte les conditions générales d'utilisation."
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
            </Card>
          </Grid>
        </Grid>

      </Box>
    </PageContainer>
  );
};

export default Inscription;
