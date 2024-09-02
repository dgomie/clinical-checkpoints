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
  const [checkpoint, setCheckpoint] = useState('')
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (data) {
      console.log('Data received from query:', data);
      setCheckpoint(data.checkPoint)
      console.log("Checkpoint", data.checkPoint)
      if (data.checkPoint && data.checkPoint.tasks) {
        // Assuming data.checkPoint.tasks is an array of tasks
        const initialTasks = data.checkPoint.tasks.map(task => ({
          ...task,
          checked: false, // Initialize all tasks as unchecked
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Container>
      <Typography variant="h4">{checkpoint.focusArea}</Typography>
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
    </Container>
  );
};

export default CheckpointsComponent;