import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Button,
  Container,
  Modal,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Grid,
  TextField,
  Divider,
} from '@mui/material';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USERS, GET_CHECKPOINTS_BY_USER } from '../utils/queries';
import { UPDATE_CHECKPOINTS_BY_FOCUS_AREA, ADD_TASK_TO_CHECKPOINT } from '../utils/mutations';

const AdminScheduleComponent = () => {
  const [openModal, setOpenModal] = useState(null); 
  const [selectedOffice, setSelectedOffice] = useState('');
  const [selectedFocusArea, setSelectedFocusArea] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedCheckpoint, setSelectedCheckpoint] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const navigate = useNavigate();

  const { data: usersData } = useQuery(GET_USERS);
  const { data: checkpointsData, refetch: refetchCheckpoints } = useQuery(GET_CHECKPOINTS_BY_USER, {
    variables: { userId: selectedUser },
    skip: !selectedUser,
  });

  const [updateCheckpointsByFocusArea] = useMutation(UPDATE_CHECKPOINTS_BY_FOCUS_AREA);
  const [addTaskToCheckPoint] = useMutation(ADD_TASK_TO_CHECKPOINT);

  const handleOpen = (modalType) => {
    setOpenModal(modalType);
    setConfirmationMessage('');
  };

  const handleClose = () => {
    setOpenModal(null);
    setSelectedUser('');
    setSelectedCheckpoint('');
    setTaskDescription('');
    setConfirmationMessage('');
  };

  const handleAssign = async () => {
    try {
      await updateCheckpointsByFocusArea({
        variables: {
          focusArea: selectedFocusArea,
          officeLocation: selectedOffice,
          assign: true,
        },
      });
      setConfirmationMessage(`Check Points assigned to ${selectedOffice} clinicians.`);
    } catch (error) {
      console.error('Error updating check points:', error);
    }
  };

  const handleRemove = async () => {
    try {
      await updateCheckpointsByFocusArea({
        variables: {
          focusArea: selectedFocusArea,
          officeLocation: selectedOffice,
          assign: false,
        },
      });
      setConfirmationMessage(`Check Points removed from ${selectedOffice} clinicians.`);
    } catch (error) {
      console.error('Error removing check points:', error);
    }
  };

  const handleAddTask = async () => {
    try {
      await addTaskToCheckPoint({
        variables: {
          userId: selectedUser,
          focusArea: selectedCheckpoint,
          description: taskDescription,
        },
      });
      setConfirmationMessage('Task added successfully');
      setSelectedUser('');
      setSelectedCheckpoint('');
      setTaskDescription('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      refetchCheckpoints();
    }
  }, [selectedUser, refetchCheckpoints]);

  return (
    <Container>
      <Grid container spacing={2} direction={'column'}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('./clinician-progress')}
            >
              View Clinician Progress
            </Button>
            
            <Divider sx={{ my: 1 }} /> 
            
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpen('assign')}
            >
              Assign Check Points
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpen('remove')}
            >
              Remove Check Points
            </Button>
            
            
          </Paper>
        </Grid>
      </Grid>

      <Modal open={openModal === 'assign'} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ textAlign: 'center' }}>
            Assign Check Point to Office
          </Typography>
          {confirmationMessage && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {confirmationMessage}
            </Alert>
          )}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="office-select-label">Office</InputLabel>
            <Select
              labelId="office-select-label"
              value={selectedOffice}
              onChange={(e) => setSelectedOffice(e.target.value)}
              label="Office"
            >
              <MenuItem value="Bristol">Bristol</MenuItem>
              <MenuItem value="Burlington">Burlington</MenuItem>
              <MenuItem value="Farmington">Farmington</MenuItem>
              <MenuItem value="Prospect">Prospect</MenuItem>
              <MenuItem value="Terryville">Terryville</MenuItem>
              <MenuItem value="Torrington">Torrington</MenuItem>
              <MenuItem value="Wolcott">Wolcott</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="focus-area-select-label">Focus Area</InputLabel>
            <Select
              labelId="focus-area-select-label"
              value={selectedFocusArea}
              onChange={(e) => setSelectedFocusArea(e.target.value)}
              label="Focus Area"
            >
              <MenuItem value="Ankle Clinical Check Points">
                Ankle Clinical Check Points
              </MenuItem>
              <MenuItem value="Cervical Clinical Check Points">
                Cervical Clinical Check Points
              </MenuItem>
              <MenuItem value="Discussion Clinical Check Points">
                Discussion Clinical Check Points
              </MenuItem>
              <MenuItem value="Elbow Clinical Check Points">
                Elbow Clinical Check Points
              </MenuItem>
              <MenuItem value="Foot Clinical Check Points">
                Foot Clinical Check Points
              </MenuItem>
              <MenuItem value="Hip Clinical Check Points">
                Hip Clinical Check Points
              </MenuItem>
              <MenuItem value="Knee Clinical Check Points">
                Knee Clinical Check Points
              </MenuItem>
              <MenuItem value="Lumbar Clinical Check Points">
                Lumbar Clinical Check Points
              </MenuItem>
              <MenuItem value="Pelvic Girdle Clinical Check Points">
                Pelvic Girdle Clinical Check Points
              </MenuItem>
              <MenuItem value="Shoulder Clinical Check Points">
                Shoulder Clinical Check Points
              </MenuItem>
              <MenuItem value="Thoracic Clinical Check Points">
                Thoracic Clinical Check Points
              </MenuItem>
              <MenuItem value="Wrist Clinical Check Points">
                Wrist Clinical Check Points
              </MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleAssign}>
              Assign
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={openModal === 'remove'} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ textAlign: 'center' }}>
            Remove Office Check Point
          </Typography>
          {confirmationMessage && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {confirmationMessage}
            </Alert>
          )}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="office-select-label">Office</InputLabel>
            <Select
              labelId="office-select-label"
              value={selectedOffice}
              onChange={(e) => setSelectedOffice(e.target.value)}
              label="Office"
            >
              <MenuItem value="Bristol">Bristol</MenuItem>
              <MenuItem value="Burlington">Burlington</MenuItem>
              <MenuItem value="Farmington">Farmington</MenuItem>
              <MenuItem value="Prospect">Prospect</MenuItem>
              <MenuItem value="Terryville">Terryville</MenuItem>
              <MenuItem value="Torrington">Torrington</MenuItem>
              <MenuItem value="Wolcott">Wolcott</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="focus-area-select-label">Focus Area</InputLabel>
            <Select
              labelId="focus-area-select-label"
              value={selectedFocusArea}
              onChange={(e) => setSelectedFocusArea(e.target.value)}
              label="Focus Area"
            >
              <MenuItem value="Ankle Clinical Check Points">
                Ankle Clinical Check Points
              </MenuItem>
              <MenuItem value="Cervical Clinical Check Points">
                Cervical Clinical Check Points
              </MenuItem>
              <MenuItem value="Discussion Clinical Check Points">
                Discussion Clinical Check Points
              </MenuItem>
              <MenuItem value="Elbow Clinical Check Points">
                Elbow Clinical Check Points
              </MenuItem>
              <MenuItem value="Foot Clinical Check Points">
                Foot Clinical Check Points
              </MenuItem>
              <MenuItem value="Hip Clinical Check Points">
                Hip Clinical Check Points
              </MenuItem>
              <MenuItem value="Knee Clinical Check Points">
                Knee Clinical Check Points
              </MenuItem>
              <MenuItem value="Lumbar Clinical Check Points">
                Lumbar Clinical Check Points
              </MenuItem>
              <MenuItem value="Pelvic Girdle Clinical Check Points">
                Pelvic Girdle Clinical Check Points
              </MenuItem>
              <MenuItem value="Shoulder Clinical Check Points">
                Shoulder Clinical Check Points
              </MenuItem>
              <MenuItem value="Thoracic Clinical Check Points">
                Thoracic Clinical Check Points
              </MenuItem>
              <MenuItem value="Wrist Clinical Check Points">
                Wrist Clinical Check Points
              </MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleRemove}>
              Remove
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default AdminScheduleComponent;