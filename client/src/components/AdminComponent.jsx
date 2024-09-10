import { useState } from 'react';
import { Tabs, Tab, Container, Box } from '@mui/material';
import AdminViewCliniciansComponent from './AdminViewCliniciansComponent';
import AdminViewAdminsComponent from './AdminViewAdminsComponent';
import AdminScheduleComponent from './AdminScheduleComponent';

const AdminComponent = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '10px',
      }}
    >
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        centered
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
              color: 'blue',
            },
          },
        }}
      >
        <Tab label="Edit Users" />
        <Tab label="Schedule" />
      </Tabs>
      <Box sx={{ marginTop: '2rem' }}>
        {selectedTab === 0 && (
          <div>
            <AdminViewCliniciansComponent />
            <AdminViewAdminsComponent />
          </div>
        )}
        {selectedTab === 1 && (
          <div>
            <AdminScheduleComponent />
          </div>
        )}
      </Box>
    </Container>
  );
};

export default AdminComponent;
