import { useEffect, useState } from 'react';
import {
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from '@mui/material';
import ClinicianDetails from './ClinicianDetails';
import { useQuery } from '@apollo/client';
import { GET_USERS } from '../utils/queries';

const ClinicianProgressComponent = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedOffice, setSelectedOffice] = useState('');

  const { loading, error, data } = useQuery(GET_USERS);

  useEffect(() => {
    if (data) {
      setUsers(data.users);
    }
  }, [data]);

  const handleChange = (event) => {
    setSelectedUser(event.target.value);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const filteredUsers = selectedOffice
    ? users.filter((user) => user.officeLocation === selectedOffice)
    : users;

  return (
    <Container sx={{ mb: '1rem' }}>
      <Typography variant="h4" sx={{ my: '.5rem', textAlign: 'center' }}>
        Clinician Progress
      </Typography>

      <FormControl fullWidth sx={{ mt: 2, backgroundColor: 'white' }}>
        <InputLabel id="office-select-label">Select Office Location</InputLabel>
        <Select
          labelId="office-select-label"
          value={selectedOffice}
          onChange={(e) => setSelectedOffice(e.target.value)}
          label="Select Office Location"
        >
          {Array.from(new Set(users.map((user) => user.officeLocation))).map(
            (location) => (
              <MenuItem key={location} value={location}>
                {location}
              </MenuItem>
            )
          )}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mt: 2, backgroundColor: 'white' }}>
        <InputLabel id="user-select-label">Select Clinician</InputLabel>
        <Select
          labelId="user-select-label"
          value={selectedUser}
          onChange={handleChange}
          label="Select Clinician"
        >
          {filteredUsers.map((user) => (
            <MenuItem key={user._id} value={user}>
              {user.firstName} {user.lastName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedUser && <ClinicianDetails user={selectedUser} />}
    </Container>
  );
};

export default ClinicianProgressComponent;
