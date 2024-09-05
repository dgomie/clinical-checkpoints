import { useState } from 'react';

import { TextField, Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';

function LoginComponent() {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [login] = useMutation(LOGIN_USER);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await login({
        variables: { ...formState },
      });

      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
      setErrorMessage('Incorrect email or password!');
    }

    // clear form values
    setFormState({
      email: '',
      password: '',
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
          backgroundColor: '#cfe2f3',
          padding: '5rem',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '25rem',
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ textAlign: 'center' }}
        >
          Login
        </Typography>
        <Typography sx={{ mb: 1, textAlign: "center"}}>
        Or <Link to="/signUp">sign up for a new account</Link>
    </Typography>
        <TextField
          label="Email"
          variant="outlined"
          id="email"
          name="email"
          value={formState.email}
          onChange={handleChange}
          required
          InputProps={{
            style: { backgroundColor: 'white' },
          }}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          id="password"
          name="password"
          value={formState.password}
          onChange={handleChange}
          required
          InputProps={{
            style: { backgroundColor: 'white' },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: 1,
            width: '10%',
            minWidth: '120px',
            marginTop: 3,
          }}
        >
          Login
        </Button>
        {errorMessage && (
          <Typography color="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Typography>
        )}

        <Container sx={{ mt: 3, textAlign: "center"}}>
        <Link to="/forgot-password" variant="body2" sx={{ mt: 3 }}>
          Forgot Password?
        </Link>
        </Container>
      </Box>
    </Box>
  );
}

export default LoginComponent;
