import React from 'react';
import { Box, Typography, Button, Grid, Paper, Divider } from '@mui/material';

const CompteRendus = () => {
  // Données simulées des compte-rendus d'orthophonie
  const exercices = [
    {
      id: 1,
      title: 'Exercice de prononciation des voyelles',
      date: '2025-01-10',
      summary: 'Exercice visant à améliorer la prononciation des voyelles. Durée : 15 minutes.',
      details: 'L\'objectif de cet exercice est de répéter les voyelles de manière claire et distincte, en se concentrant sur l\'ouverture de la bouche et la vibration des cordes vocales.',
    },
    {
      id: 2,
      title: 'Exercice de compréhension orale',
      date: '2025-01-09',
      summary: 'Exercice de compréhension des consignes verbales. Durée : 20 minutes.',
      details: 'L\'exercice consiste à écouter des instructions données oralement et à les reproduire. Exemple : "Apporte-moi le livre rouge".',
    },
    {
      id: 3,
      title: 'Exercice de mémoire auditive',
      date: '2025-01-08',
      summary: 'Exercice de mémorisation de sons et de mots entendus. Durée : 25 minutes.',
      details: 'L\'objectif est d\'écouter des mots ou des sons et de les répéter dans le même ordre. Cela aide à renforcer la mémoire auditive et la concentration.',
    },
    {
      id: 4,
      title: 'Exercice de fluidité verbale',
      date: '2025-01-07',
      summary: 'Exercice visant à améliorer la fluidité de la parole. Durée : 30 minutes.',
      details: 'Cet exercice permet de pratiquer la fluidité de la parole, en répétant des phrases complexes ou en répondant rapidement à des questions.',
    },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 3 }}>
        Compte-rendus des exercices 
      </Typography>

      {/* Liste des exercices */}
      {exercices.map((exercice) => (
        <Paper key={exercice.id} sx={{ padding: 2, marginBottom: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6">{exercice.title}</Typography>
              <Typography variant="body2" color="textSecondary">{exercice.date}</Typography>
              <Typography variant="body1" sx={{ marginTop: 1 }}>{exercice.summary}</Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Button variant="contained" color="primary" onClick={() => alert(exercice.details)}>
                Voir Détails
              </Button>
            </Grid>
          </Grid>
          <Divider sx={{ marginTop: 2 }} />
        </Paper>
      ))}
    </Box>
  );
};

export default CompteRendus;
