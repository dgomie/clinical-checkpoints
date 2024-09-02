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
  Button, // Import Button component
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
    variables: { id: checkpointId },
  });

  const [updateCheckpoint] = useMutation(UPDATE_CHECKPOINT);
  const [checkpoint, setCheckpoint] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (data) {
      console.log('Data received from query:', data);
      setCheckpoint(data.checkPoint);
      console.log('Checkpoint', data.checkPoint);
      if (data.checkPoint && data.checkPoint.tasks) {
        // Assuming data.checkPoint.tasks is an array of tasks
        const initialTasks = data.checkPoint.tasks.map(task => ({
          ...task,
          checked: task.taskCompleted, // Initialize checked based on taskCompleted
        }));
        setTasks(initialTasks);
        console.log('Initial tasks set:', initialTasks);
      } else {
        console.error('data.checkPoint.tasks is undefined');
      }
    }
  }, [data]);

  const handleCheckboxChange = (index) => {
    console.log('Checkbox changed at index:', index);
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, checked: !task.checked } : task
    );
    setTasks(updatedTasks);
    console.log('Updated tasks:', updatedTasks);
  };

  const handleSave = () => {
    console.log('Saving tasks:', tasks);
    const filteredTasks = tasks.map(({ __typename, checked, ...rest }) => ({
      ...rest,
      taskCompleted: checked, // Update taskCompleted based on checked
    }));
    updateCheckpoint({ variables: { checkPointId: checkpointId, updateData: { tasks: filteredTasks } } })
      .then(response => {
        console.log('Tasks saved successfully:', response);
      })
      .catch(error => {
        console.error('Error saving tasks:', error);
      });
  };

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
      <Typography variant="h4" align="center">{checkpoint.focusArea}</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task</TableCell>
              <TableCell>Completed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task, index) => (
              <TableRow key={task.id}>
                <TableCell>{task.description}</TableCell>
                <TableCell>
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
      <Button
        variant="contained"
        color="secondary"
        onClick={handleSave}
        style={{ display: 'block', margin: '20px auto' }}
      >
        Save
      </Button>
    </Container>
  );
};

export default CheckpointsComponent;