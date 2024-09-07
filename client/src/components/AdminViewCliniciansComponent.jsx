import React from 'react';
import { Paper, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AdminViewCliniciansComponent = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Container sx={{ display: 'flex'}}>
      <Paper elevation={3} sx={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        list clinicians
      </Paper>
    </Container>
  );
};

export default AdminViewCliniciansComponent;