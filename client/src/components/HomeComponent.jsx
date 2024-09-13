import { Button, Container, Box, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import image from '../images/running.webp';

const HomeComponent = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <Container
      sx={{
        paddingBottom: '50px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Grid
        container
        spacing={{ xs: 2, md: 0 }}
        alignItems="stretch"
        justifyContent="center"
      >
        <Grid item xs={12} md={8}>
          <Paper
            component="img"
            sx={{
              width: { xs: '100%', md: '150%' },
              height: 'auto',
              marginBottom: { xs: '20px', md: 0 },
            }}
            alt="Running"
            src={image}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: '1rem',
              height: '99.5%',
              width: { xs: '100%', md: '300px' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              boxSizing: 'border-box',
              maxWidth: 'auto',
              backgroundColor: 'rgba(255, 255, 255, 0.8)', 
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Button
                variant="contained"
                sx={{ margin: '1rem', width: '100%', maxWidth: '300px' }}
                onClick={handleLoginClick}
              >
                Login
              </Button>
              <Button
                variant="contained"
                sx={{ margin: '1rem', width: '100%', maxWidth: '300px' }}
                onClick={handleSignUpClick}
              >
                Sign Up
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomeComponent;
