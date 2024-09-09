import React, { useState } from 'react';
import { Paper, Container, List, ListItem, ListItemText, Accordion, AccordionSummary, AccordionDetails, Typography, Modal, Box, TextField, Button, Alert, FormControlLabel, Checkbox, Select, MenuItem } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USERS } from '../utils/queries';
import { UPDATE_USER, REMOVE_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const AdminViewCliniciansComponent = () => {
  const { loading, error, data, refetch } = useQuery(GET_USERS);
  const [updateUser] = useMutation(UPDATE_USER);
  const [removeUser] = useMutation(REMOVE_USER); 
  const currentUserId = Auth.getProfile().data._id;

  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false); 
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false); 
  const [selectedUser, setSelectedUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // const users = data.users.filter(user => user._id !== currentUserId);
  const users = data.users

  const groupedUsers = users.reduce((acc, user) => {
    const { officeLocation } = user;
    if (!acc[officeLocation]) {
      acc[officeLocation] = [];
    }
    acc[officeLocation].push(user);
    return acc;
  }, {});

  const handleOpen = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
    setErrors({});
    setSuccessMessage('');
    setErrorMessage('');
  };

  const validate = () => {
    const newErrors = {};
    if (!selectedUser.firstName) newErrors.firstName = 'First name is required';
    if (!selectedUser.lastName) newErrors.lastName = 'Last name is required';
    if (!selectedUser.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(selectedUser.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!selectedUser.officeLocation) newErrors.officeLocation = 'Office location is required';
    return newErrors;
  };

  const handleUpdate = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setConfirmOpen(true); 
  };

  const handleConfirmUpdate = async () => {
    try {
      const { _id, firstName, lastName, email, officeLocation } = selectedUser;
      await updateUser({
        variables: { userId: _id, updateData: { firstName, lastName, email, officeLocation } },
      });
      setSuccessMessage('User updated successfully!');
      setErrorMessage('');
      refetch();
      setConfirmOpen(false);
      handleClose(); 
    } catch (err) {
      setErrorMessage('Failed to update user. Please try again.');
      setSuccessMessage('');
      console.error(err);
    }
  };

  const handleDelete = () => {
    setDeleteConfirmOpen(true); 
  };

  const handleConfirmDelete = async () => {
    try {
      const { _id } = selectedUser;
      await removeUser({
        variables: { userId: _id },
      });
      setSuccessMessage('User deleted successfully!');
      setErrorMessage('');
      refetch(); 
      setDeleteConfirmOpen(false); 
      handleClose(); 
    } catch (err) {
      setErrorMessage('Failed to delete user. Please try again.');
      setSuccessMessage('');
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSelectedUser({ ...selectedUser, [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Paper elevation={3} sx={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'center' }}>
        <Typography variant='h5'>View All Clinicians</Typography>
      </Paper>

      {Object.keys(groupedUsers).sort().map(location => (
        <Accordion key={location}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{location}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {groupedUsers[location].map(user => (
                <ListItem key={user._id} button onClick={() => handleOpen(user)}>
                  <ListItemText
                    primary={`${user.firstName} ${user.lastName}`}
                    secondary={`Email: ${user.email}`}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}

      <Modal open={open} onClose={handleClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" component="h2">Edit User</Typography>
          {selectedUser && (
            <Box component="form" sx={{ mt: 2 }}>
              {successMessage && <Alert severity="success">{successMessage}</Alert>}
              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
              <TextField
                fullWidth
                margin="normal"
                label="First Name"
                name="firstName"
                value={selectedUser.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Last Name"
                name="lastName"
                value={selectedUser.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                value={selectedUser.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
              <Select
                fullWidth
                margin="normal"
                label="Office Location"
                name="officeLocation"
                value={selectedUser.officeLocation}
                onChange={handleChange}
                error={!!errors.officeLocation}
              >
                <MenuItem value="Bristol">Bristol</MenuItem>
                <MenuItem value="Burlington">Burlington</MenuItem>
                <MenuItem value="Farmington">Farmington</MenuItem>
                <MenuItem value="Prospect">Prospect</MenuItem>
                <MenuItem value="Terryville">Terryville</MenuItem>
                <MenuItem value="Torrington">Torrington</MenuItem>
                <MenuItem value="Wolcott">Wolcott</MenuItem>
              </Select>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedUser.isAdmin}
                    onChange={handleChange}
                    name="isAdmin"
                  />
                }
                label="Admin"
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button variant="contained" color="primary" onClick={handleUpdate}>Update</Button>
                <Button variant="outlined" color="secondary" onClick={handleClose}>Cancel</Button>
                <Button variant="contained" color="error" onClick={handleDelete}>Delete User</Button>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 300, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" component="h2">Confirm Update</Typography>
          <Typography sx={{ mt: 2 }}>Are you sure you want to save the changes?</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleConfirmUpdate}>Yes</Button>
            <Button variant="outlined" color="secondary" onClick={() => setConfirmOpen(false)}>No</Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 300, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" component="h2">Confirm Delete</Typography>
          <Typography sx={{ mt: 2 }}>Are you sure you want to delete this user?</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button variant="contained" color="error" onClick={handleConfirmDelete}>Yes</Button>
            <Button variant="outlined" color="secondary" onClick={() => setDeleteConfirmOpen(false)}>No</Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default AdminViewCliniciansComponent;