import React, { useState } from 'react';
import { Paper, Tabs, Tab, Container, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AdminViewCliniciansComponent from './AdminViewCliniciansComponent';

const AdminComponent = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: "10px" }}>
    
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          centered
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#1976d2',
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '1rem',
              '&.Mui-selected': {
                color: '#1976d2',
              },
            },
          }}
        >
          <Tab label="View All Clinicians" />
          <Tab label="Schedule" />
        </Tabs>
        <Box sx={{ marginTop: '2rem' }}>
          {selectedTab === 0 && (
            <div>
              {/* Replace with your View All Clinicians component */}
             <AdminViewCliniciansComponent />
            </div>
          )}
          {selectedTab === 1 && (
            <div>
              {/* Replace with your Schedule component */}
              <Button variant="contained" onClick={() => handleNavigation('/admin/schedule')}>
                Schedule
              </Button>
            </div>
          )}
        </Box>
    </Container>
  );
};

export default AdminComponent;