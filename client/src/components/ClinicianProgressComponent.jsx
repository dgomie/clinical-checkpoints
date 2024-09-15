import { useState } from 'react';
import { Container, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import ClinicianDetails from './ClinicianDetails';

const users = [
  { id: 1, name: 'User 1' },
  { id: 2, name: 'User 2' },
  { id: 3, name: 'User 3' },
  // Add more users as needed
];

const ClinicianProgressComponent = () => {
  const [selectedUser, setSelectedUser] = useState('');

  const handleChange = (event) => {
    setSelectedUser(event.target.value);
  };

  return (
    <Container>
      <FormControl fullWidth>
        <InputLabel id="user-select-label">Select User</InputLabel>
        <Select
          labelId="user-select-label"
          value={selectedUser}
          onChange={handleChange}
          label="Select User"
        >
          {users.map((user) => (
            <MenuItem key={user.id} value={user}>
              {user.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedUser && <ClinicianDetails user={selectedUser} />}
    </Container>
  );
};

export default ClinicianProgressComponent;