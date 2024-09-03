import { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

function ForgotPasswordComponent() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      // Call the backend API to send the reset email
      try {
        const hostUrl = import.meta.env.VITE_HOST_URL;
        console.log(`${hostUrl}/api/forgot-password`)
        const response = await fetch(`${hostUrl}/api/forgot-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        setMessage('An error occurred. Please try again.');
      }
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
        <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>
          Forgot Password
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          name="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            style: { backgroundColor: 'white' },
          }}
        />
        <Button type="submit" variant="contained" color="primary">
          Send Reset Link
        </Button>
        {message && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default ForgotPasswordComponent;
