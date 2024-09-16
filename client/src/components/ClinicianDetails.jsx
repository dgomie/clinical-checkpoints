import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CHECKPOINTS_BY_USER } from '../utils/queries';
import { ADD_TASK_TO_CHECKPOINT } from '../utils/mutations';
import {
  Typography,
  Card,
  CardContent,
  Modal,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Alert,
  IconButton,
  LinearProgress,
} from '@mui/material';

const ClinicianDetails = ({ user }) => {
  const { loading, error, data } = useQuery(GET_CHECKPOINTS_BY_USER, {
    variables: { userId: user._id },
  });

  const [addTaskToCheckpoint] = useMutation(ADD_TASK_TO_CHECKPOINT);

  const [open, setOpen] = useState(false);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [taskDescription, setTaskDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleOpen = (checkpoint) => {
    setSelectedCheckpoint(checkpoint);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCheckpoint(null);
    setShowForm(false);
    setTaskDescription('');
    setSuccessMessage('');
  };

  const handleAddTask = async () => {
    try {
      await addTaskToCheckpoint({
        variables: {
          focusArea: selectedCheckpoint.focusArea,
          description: taskDescription,
          userId: user._id,
        },
        refetchQueries: [
          { query: GET_CHECKPOINTS_BY_USER, variables: { userId: user._id } },
        ],
      });
      setShowForm(false);
      setTaskDescription('');
      setSuccessMessage('Task added successfully!');
      setSelectedCheckpoint((prev) => ({
        ...prev,
        tasks: [
          ...prev.tasks,
          { description: taskDescription, taskCompleted: false },
        ],
      }));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const assignedCheckpoints =
    data?.checkPoints?.filter(
      (checkpoint) =>
        checkpoint.checkpointAssigned && !checkpoint.checkpointCompleted
    ) || [];
  const completedCheckpoints =
    data?.checkPoints?.filter((checkpoint) => checkpoint.checkpointCompleted) ||
    [];

  return (
    <div>
      <Typography variant="h6">
        Name: {user.firstName} {user.lastName}
      </Typography>
      <Typography variant="h5">Assigned Check Points</Typography>
      <div>
        {assignedCheckpoints.map((checkpoint) => {
          const totalTasks = checkpoint.tasks.length;
          const completedTasks = checkpoint.tasks.filter(
            (task) => task.taskCompleted
          ).length;
          const progress = (completedTasks / totalTasks) * 100;

          return (
            <Card
              key={checkpoint._id}
              onClick={() => handleOpen(checkpoint)}
              style={{ marginBottom: '10px', cursor: 'pointer' }}
            >
              <CardContent>
                <Typography variant="body1">{checkpoint.focusArea}</Typography>
                <LinearProgress variant="determinate" value={progress} />
                <Typography variant="body2">{`${completedTasks}/${totalTasks} tasks completed`}</Typography>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Typography variant="h5">Completed Check Points</Typography>
      <div>
        {completedCheckpoints.map((checkpoint) => {
          const totalTasks = checkpoint.tasks.length;
          const completedTasks = checkpoint.tasks.filter(
            (task) => task.taskCompleted
          ).length;
          const progress = (completedTasks / totalTasks) * 100;

          return (
            <Card
              key={checkpoint._id}
              onClick={() => handleOpen(checkpoint)}
              style={{ marginBottom: '10px', cursor: 'pointer' }}
            >
              <CardContent>
                <Typography variant="body1">{checkpoint.focusArea}</Typography>
                <LinearProgress variant="determinate" value={progress} />
                <Typography variant="body2">{`${completedTasks}/${totalTasks} tasks completed`}</Typography>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: {xs: 350, sm: 500, md:700},
            maxHeight: '75vh',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            overflowY: 'auto',
          }}
        >
          <Typography variant="h6" component="h2" sx={{ textAlign: 'center' }}>
            {selectedCheckpoint?.focusArea}
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Task Description</TableCell>
                  <TableCell align="right">Completed</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedCheckpoint?.tasks.map((task, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {task.description}
                    </TableCell>
                    <TableCell align="right">
                      {task.taskCompleted ? 'Yes' : 'No'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box
            sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowForm(true)}
            >
              Add Task
            </Button>
            <Button variant="contained" color="secondary" onClick={handleClose}>
              Close
            </Button>
          </Box>
          {showForm && (
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                label="Task Description"
                variant="outlined"
                fullWidth
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Box sx={{display: 'flex', justifyContent: 'center'}}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddTask}
              >
                Submit
              </Button>
              </Box>
            </Box>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {successMessage}
            </Alert>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default ClinicianDetails;
