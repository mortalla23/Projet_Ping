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
const EnseiRapports = () => {
  const reports = [
    { id: 1, student: 'Jean Dupont', status: 'Terminé', remarks: 'Progrès significatif' },
    { id: 2, student: 'Marie Curie', status: 'En cours', remarks: 'Besoin de soutien' },
  ];
  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom>
        Rapports d'exercices
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#5BA8B4' }}>
              <TableCell sx={{ color: '#fff' }}>Nom de l'élève</TableCell>
              <TableCell sx={{ color: '#fff' }}>Statut</TableCell>
              <TableCell sx={{ color: '#fff' }}>Remarques</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.student}</TableCell>
                <TableCell>{report.status}</TableCell>
                <TableCell>{report.remarks}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
export default EnseiRapports;