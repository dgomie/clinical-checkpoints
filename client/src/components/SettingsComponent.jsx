import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useMutation, useQuery } from '@apollo/client';
import { REMOVE_USER, UPDATE_USER } from '../utils/mutations';
import { GET_USER_BY_ID } from '../utils/queries';
import Auth from '../utils/auth';

const SettingsComponent = () => {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [firstName, setFirstName] = useState('First Name');
  const [lastName, setLastName] = useState('Last Name');
  const [email, setEmail] = useState('Email');
  const [userId, setUserId] = useState('');
  const [officeLocation, setOfficeLocation] = useState('');
  const [officeLocationError, setOfficeLocationError] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileMessage, setProfileMessage] = useState('');
  const [profileMessageSeverity, setProfileMessageSeverity] = useState('success');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordMessageSeverity, setPasswordMessageSeverity] = useState('success');

  const [removeUserMutation] = useMutation(REMOVE_USER);
  const [updateUser] = useMutation(UPDATE_USER);

  const token = Auth.getToken();
  const { _id } = Auth.getProfile(token).data;

  const { loading, error, data } = useQuery(GET_USER_BY_ID, {
    variables: { id: _id },
  });

  useEffect(() => {
    if (data) {
      setFirstName(data.userById.firstName);
      setLastName(data.userById.lastName);
      setEmail(data.userById.email);
      setUserId(data.userById._id);
      setOfficeLocation(data.userById.officeLocation);
    }
  }, [data]);

  useEffect(() => {
    if (profileMessage) {
      const timer = setTimeout(() => {
        setProfileMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [profileMessage]);

  useEffect(() => {
    if (passwordMessage) {
      const timer = setTimeout(() => {
        setPasswordMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [passwordMessage]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>An error occurred: {error.message}</p>;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOfficeLocationChange = (event) => {
    setOfficeLocation(event.target.value);
  };

  const handleDelete = () => {
    removeUserMutation({ variables: { userId } })
      .then(() => {
        Auth.logout();
      })
      .catch((err) => {
        console.error('Error removing user:', err);
      });
  };

  const handlePasswordUpdate = async () => {
    const currentPasswordInput = document.getElementById('current-password');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    const currentPassword = currentPasswordInput.value;
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    const hostUrl = import.meta.env.VITE_HOST_URL;
    const verifyUrl = import.meta.env.VITE_VERIFY_ENDPOINT_URL;
    const verifyEndpoint = `${hostUrl}${verifyUrl}`;

    const updateUrl = import.meta.env.VITE_UPDATE_ENDPOINT_URL;
    const updateEndpoint = `${hostUrl}${updateUrl}`;

    if (newPassword !== confirmPassword) {
      setPasswordMessage('New password and confirm password do not match');
      setPasswordMessageSeverity('error');
      return;
    }

    try {
      const verifyResponse = await fetch(verifyEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, currentPassword }),
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        setPasswordMessage(errorData.message);
        setPasswordMessageSeverity('error');
        return;
      }

      const updateResponse = await fetch(updateEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, newPassword }),
      });

      if (updateResponse.ok) {
        setPasswordMessage('Password updated successfully');
        setPasswordMessageSeverity('success');
        currentPasswordInput.value = '';
        newPasswordInput.value = '';
        confirmPasswordInput.value = '';
      } else {
        const errorData = await updateResponse.json();
        setPasswordMessage(errorData.message);
        setPasswordMessageSeverity('error');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordMessage('Error updating password');
      setPasswordMessageSeverity('error');
    }
  };

  const handleUpdateProfile = async () => {
    // Validate non-empty fields
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setProfileMessage('Please fill out all fields.');
      setProfileMessageSeverity('error');
      return;
    }
  
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setProfileMessage('Please enter a valid email address.');
      setProfileMessageSeverity('error');
      return;
    }
  
    // Proceed to update profile if all fields are valid
    const updateData = {
      firstName,
      lastName,
      email,
      officeLocation,
    };
    
    try {
      await updateUser({
        variables: { userId, updateData },
      });
      setProfileMessage('Profile updated successfully');
      setProfileMessageSeverity('success');
    } catch (error) {
      console.log('Error details:', error);
      setProfileMessage('Error updating profile');
      setProfileMessageSeverity('error');
    }
  };
  

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      textAlign="center"
      sx={{ paddingBottom: '100px' }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{ marginBottom: 2, padding: { xs: 1, sm: 2} }}
        >
          <Typography variant="h4" component="header">
            Settings
          </Typography>
        </Paper>
        <Paper
          elevation={3}
          sx={{ marginBottom: 2, padding: { xs: 2, sm: 3} }}
        >
          <Box component="main" sx={{ width: '100%' }}>
            <Box mb={4}>
              <Typography variant="h5" component="h2" gutterBottom>
                Profile Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    variant="outlined"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    variant="outlined"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel id="officeLocation-label">
                      Office Location
                    </InputLabel>
                    <Select
                      labelId="officeLocation-label"
                      id="officeLocation"
                      name="officeLocation"
                      value={officeLocation}
                      onChange={handleOfficeLocationChange}
                      label="Office Location"
                      error={Boolean(officeLocationError)}
                    >
                      <MenuItem value="Bristol">Bristol</MenuItem>
                      <MenuItem value="Burlington">Burlington</MenuItem>
                      <MenuItem value="Farmington">Farmington</MenuItem>
                      <MenuItem value="Prospect">Prospect</MenuItem>
                      <MenuItem value="Terryville">Terryville</MenuItem>
                      <MenuItem value="Torrington">Torrington</MenuItem>
                      <MenuItem value="Wolcott">Wolcott</MenuItem>
                    </Select>
                    {officeLocationError && (
                      <p style={{ color: 'red' }}>{officeLocationError}</p>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
              <Box mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateProfile}
                >
                  Update Profile
                </Button>
                {profileMessage && (
                  <Alert severity={profileMessageSeverity} sx={{ mt: 2 }}>
                    {profileMessage}
                  </Alert>
                )}
              </Box>
            </Box>
          </Box>
        </Paper>

        <Paper
          elevation={3}
          sx={{ marginBottom: 2, padding: { xs: 2, sm: 3} }}
        >
          <Typography variant="h5" component="h2" gutterBottom>
            Change Password
          </Typography>
          <Grid item xs={12} sx={{ marginBottom: 2 }}>
            <TextField
              fullWidth
              id="current-password"
              label="Current Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ marginBottom: 2 }}>
            <TextField
              fullWidth
              id="new-password"
              label="New Password"
              type={showNewPassword ? 'text' : 'password'}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowNewPassword}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ marginBottom: 2 }}>
            <TextField
              fullWidth
              id="confirm-password"
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePasswordUpdate}
            >
              Update Password
            </Button>
            {passwordMessage && (
              <Alert severity={passwordMessageSeverity} sx={{ mt: 2 }}>
                {passwordMessage}
              </Alert>
            )}
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ marginBottom: 2, padding: { xs: 1, sm: 2, } }}>
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom>
              Delete Account
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClickOpen}
            >
              Delete Account
            </Button>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {'Delete Account'}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete your account? This action
                  cannot be undone.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleDelete} color="secondary" autoFocus>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SettingsComponent;