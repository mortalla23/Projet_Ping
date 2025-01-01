import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const EnseiHistorique = () => {
  const history = [
    { id: 1, year: '2023-2024', details: 'Classe 3A - Bonne progression' },
    { id: 2, year: '2022-2023', details: 'Classe 2B - Besoin de renforcement' },
  ];

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom>
        Historique éducation
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#5BA8B4' }}>
              <TableCell sx={{ color: '#fff' }}>Année scolaire</TableCell>
              <TableCell sx={{ color: '#fff' }}>Détails</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.year}</TableCell>
                <TableCell>{record.details}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default EnseiHistorique;
