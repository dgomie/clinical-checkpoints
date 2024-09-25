import { Container, Divider, Paper, Typography } from '@mui/material';
import CSVComponent from './CSVcomponent';
import CSVClinicianComponent from './CSVclinicianComponent';

const DownloadComponent = () => {
  return (
    <Container>
      <Paper
        elevation={3}
        sx={{
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          mb: '1rem',
          textAlign: 'center'
        }}
      >
        <Typography variant='h6'>Download Check Point Progress</Typography>
        <Divider/>
        <CSVComponent />
      </Paper>
      <Paper
        elevation={3}
        sx={{
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          textAlign: 'center'
        }}
      >
        <Typography variant='h6'>Download Clinician Progress</Typography>
        <Divider/>
        <CSVClinicianComponent />
      </Paper>
    </Container>
  );
};

export default DownloadComponent;
