import React from 'react';
import { Grid, Box, Card, Typography, Stack, Button, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import PageContainer from '../../component/container/PageContainer';
import Logo from '../../layouts/logo/Logo';

const Inscription = () => (
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
            <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
              <Logo />
            </Box>
            {/* Title */}
            <Typography fontWeight="700" variant="h4" mb={3} textAlign="center">
              Create Account
            </Typography>
            {/* Form */}
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  component="label"
                  htmlFor="name"
                  mb="5px"
                >
                  Name
                </Typography>
                <TextField
                  id="name"
                  placeholder="Enter your name"
                  variant="outlined"
                  fullWidth
                />
              </Box>
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  component="label"
                  htmlFor="email"
                  mb="5px"
                >
                  Email Address
                </Typography>
                <TextField
                  id="email"
                  placeholder="Enter your email"
                  variant="outlined"
                  fullWidth
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
                  Password
                </Typography>
                <TextField
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  variant="outlined"
                  fullWidth
                />
              </Box>
            </Stack>
            {/* Button */}
            <Box mt={3}>
              <Button
                color="primary"
                variant="contained"
                size="large"
                fullWidth
                type="submit"
              >
                S'INSCRIRE
              </Button>
            </Box>
            {/* Footer */}
            <Stack direction="row" spacing={1} justifyContent="center" mt={3}>
              <Typography variant="body2" color="textSecondary">
                Already have an Account?
              </Typography>
              <Typography
                component={Link}
                to="/connexion"
                fontWeight="500"
                sx={{
                  textDecoration: 'none',
                  color: 'primary.main',
                }}
              >
                Sign In
              </Typography>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  </PageContainer>
);

export default Inscription;
