import React from 'react';
import { Link } from 'react-router-dom';
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

const Connexion = () => {
  return (
    <PageContainer title="Login" description="This is Login page">
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
                Login
              </Typography>
              
              {/* Form Fields */}
              <Stack spacing={3}>
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    component="label"
                    htmlFor="username"
                    mb="5px"
                  >
                    Username
                  </Typography>
                  <TextField
                    id="username"
                    placeholder="Enter your username"
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
                <Stack justifyContent="space-between" direction="row" alignItems="center">
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox defaultChecked />}
                      label="Remember this Device"
                    />
                  </FormGroup>
                  <Typography
                    component={Link}
                    to="/forgot-password"
                    fontWeight="500"
                    sx={{
                      textDecoration: 'none',
                      color: 'primary.main',
                    }}
                  >
                    Forgot Password?
                  </Typography>
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
                >
                  Sign In
                </Button>
              </Box>
              {/* Footer */}
              <Stack direction="row" spacing={1} justifyContent="center" mt={3}>
                <Typography variant="body2">Don't have an account?</Typography>
                <Typography
                  component={Link}
                  to="/auth/register"
                  fontWeight="500"
                  sx={{
                    textDecoration: 'none',
                    color: 'primary.main',
                  }}
                >
                  Create an account
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
