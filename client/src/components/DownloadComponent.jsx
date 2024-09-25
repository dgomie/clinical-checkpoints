import { Container, Paper, Typography } from '@mui/material';
import CSVComponent from './CSVcomponent';

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
        <CSVComponent />
      </Paper>
    </Container>
  );
};

export default DownloadComponent;
