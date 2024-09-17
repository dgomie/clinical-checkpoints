import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Checkbox,
  Button,
  Alert,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { useState, useEffect } from 'react';
import { CHECKPOINT_QUERY } from '../utils/queries';
import { UPDATE_CHECKPOINT } from '../utils/mutations';

const CheckpointsComponent = () => {
  const navigate = useNavigate();
  const { checkpointId } = useParams();

  const { loading, error, data } = useQuery(CHECKPOINT_QUERY, {
    variables: { _id: checkpointId },
  });

  const [updateCheckpoint] = useMutation(UPDATE_CHECKPOINT);
  const [checkpoint, setCheckpoint] = useState('');
  const [tasks, setTasks] = useState([]);
  const [initialTasks, setInitialTasks] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (data) {
      setCheckpoint(data.checkPoint);
      if (data.checkPoint && data.checkPoint.tasks) {
        const initialTasks = data.checkPoint.tasks.map((task) => ({
          ...task,
          checked: task.taskCompleted,
        }));
        setTasks(initialTasks);
        setInitialTasks(initialTasks);
      }
    }
  }, [data]);

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const handleCheckboxChange = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, checked: !task.checked } : task
    );
    setTasks(updatedTasks);
  };

  const handleSave = () => {
    const filteredTasks = tasks.map(({ __typename, checked, ...rest }) => ({
      ...rest,
      taskCompleted: checked,
    }));
    updateCheckpoint({
      variables: {
        checkPointId: checkpointId,
        updateData: { tasks: filteredTasks },
      },
    })
      .then(() => {
        setSuccessMessage('Tasks saved successfully!');
        setErrorMessage('');
      })
      .catch(() => {
        setErrorMessage('Error saving tasks. Please try again.');
        setSuccessMessage('');
      });
  };

  const isSaveDisabled = JSON.stringify(initialTasks) === JSON.stringify(tasks);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;


  return (
    <Container>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/dashboard')}
        style={{ display: 'block', margin: '0 auto', marginBottom: '20px' }}
      >
        Back to Dashboard
      </Button>
      <Typography variant="h4" align="center">
        {checkpoint.focusArea}
      </Typography>
      <Typography sx={{textAlign: 'center'}}>
            {checkpoint?.completedAt
              ? `Date Completed: ${new Date(
                  parseInt(checkpoint.completedAt)
                ).toLocaleDateString()}`
              : ''}
          </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'lightblue' }}>
              <TableCell sx={{ fontSize: '1rem' , textAlign: 'center', fontWeight: 'bold'  }}>Task</TableCell>
              <TableCell sx={{ fontSize: '1rem' , textAlign: 'center', fontWeight: 'bold'  }}>Completed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task, index) => (
              <TableRow key={index}>
                <TableCell>{task.description}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Checkbox
                    checked={task.checked}
                    onChange={() => handleCheckboxChange(index)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {successMessage && (
        <Alert severity="success" style={{ marginTop: '20px' }}>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" style={{ marginTop: '20px' }}>
          {errorMessage}
        </Alert>
      )}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleSave}
        style={{ display: 'block', margin: '20px auto' }}
        disabled={isSaveDisabled}
      >
        Save
      </Button>
    </Container>
  );
};

export default CheckpointsComponent;
