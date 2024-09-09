import React from 'react';
import { Paper, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminScheduleComponent = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Container sx={{ display: 'flex' }}>
      <Paper
        elevation={3}
        sx={{
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        schedule
      </Paper>
    </Container>
  );
};

export default AdminScheduleComponent;
