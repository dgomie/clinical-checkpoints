import { useEffect, useState } from 'react';
import { Container, Select, MenuItem, FormControl, InputLabel, Typography, Divider } from '@mui/material';
import ClinicianDetails from './ClinicianDetails';
import { useQuery } from '@apollo/client';
import { GET_USERS } from '../utils/queries';

const ClinicianProgressComponent = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');

  const { loading, error, data } = useQuery(GET_USERS);

  useEffect(() => {
    if (data) {
      setUsers(data.users);
      console.log(data.users[0])
    }
  }, [data]);

  

  const handleChange = (event) => {
    setSelectedUser(event.target.value);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Container>
        <Typography variant='h4' sx={{my: '.5rem'}}>Clinician Details</Typography>
        
      <FormControl fullWidth>
        <InputLabel id="user-select-label">Select User</InputLabel>
        <Select
          labelId="user-select-label"
          value={selectedUser}
          onChange={handleChange}
          label="Select User"
        >
          {users.map((user) => (
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