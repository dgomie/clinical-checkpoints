import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CHECKPOINTS_BY_USER } from '../utils/queries';
import { ADD_TASK_TO_CHECKPOINT, DELETE_TASK_FROM_CHECKPOINT } from '../utils/mutations';
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';

const ClinicianDetails = ({ user }) => {
  const { loading, error, data } = useQuery(GET_CHECKPOINTS_BY_USER, {
    variables: { userId: user._id },
  });

  const [addTaskToCheckpoint] = useMutation(ADD_TASK_TO_CHECKPOINT);
  const [deleteTaskFromCheckpoint] = useMutation(DELETE_TASK_FROM_CHECKPOINT);

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

  const handleDeleteTask = async (taskDescription) => {
    try {
      await deleteTaskFromCheckpoint({
        variables: {
          focusArea: selectedCheckpoint.focusArea,
          description: taskDescription,
          userId: user._id,
        },
        refetchQueries: [
          { query: GET_CHECKPOINTS_BY_USER, variables: { userId: user._id } },
        ],
      });
      setSelectedCheckpoint((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((task) => task.description !== taskDescription),
      }));
      setSuccessMessage('Task deleted successfully!');
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
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">Assigned Check Points</Typography>
        </AccordionSummary>
        <AccordionDetails>
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
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">Completed Check Points</Typography>
        </AccordionSummary>
        <AccordionDetails>
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
        </AccordionDetails>
      </Accordion>

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
          <Typography variant="h5" component="h2" sx={{ textAlign: 'center', fontWeight: 'bold'}}>
            {selectedCheckpoint?.focusArea}
          </Typography>
          <Typography variant="h6" component="h2" sx={{ textAlign: 'center' }}>
            Clinician: {user.firstName} {user.lastName}
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
              <TableRow sx={{ backgroundColor: 'lightblue' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Task Description</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Completed</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
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
                    <TableCell align="right">
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDeleteTask(task.description)}
                      >
                        <DeleteIcon />
                      </IconButton>
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