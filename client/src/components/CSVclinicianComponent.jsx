import { useState, useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_USERS, GET_CHECKPOINTS_BY_USER } from '../utils/queries';
import { Button, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { saveAs } from 'file-saver';

const CSVComponent = () => {
  const { loading: usersLoading, error: usersError, data: usersData } = useQuery(GET_USERS);
  const [getCheckpoints, { loading: checkpointsLoading, error: checkpointsError, data: checkpointsData }] = useLazyQuery(GET_CHECKPOINTS_BY_USER);
  const [csvData, setCsvData] = useState('');
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedUserName, setSelectedUserName] = useState({ firstName: '', lastName: '' });

  const handleUserChange = (event) => {
    const userId = event.target.value;
    setSelectedUser(userId);
    setCsvData('');
    const user = usersData.users.find(u => u._id === userId);
    setSelectedUserName({ firstName: user.firstName, lastName: user.lastName });
  };

  const generateCSV = async () => {
    if (!usersData || !selectedUser) return;

    try {
      const user = usersData.users.find(u => u._id === selectedUser);
      const { data } = await getCheckpoints({ variables: { userId: user._id } });
      const userCheckpoints = data.checkPoints;

      let csvContent = `Checkpoint,Tasks Completed,Total Tasks,Assigned,Completed,Date Completed\n`;

      userCheckpoints.forEach(checkPoint => {
        const completed = checkPoint.checkpointCompleted ? 'Yes' : 'No';
        const assigned = checkPoint.checkpointAssigned ? 'Yes' : 'No';
        const tasksCompleted = checkPoint.tasks.filter(task => task.taskCompleted).length;
        const totalTasks = checkPoint.tasks.length || 0;
        let dateCompleted = 'N/A';

        if (checkPoint.completedAt) {
          const date = new Date(checkPoint.completedAt);
          if (!isNaN(date.getTime())) {
            dateCompleted = date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
          } else {
            const timestamp = parseInt(checkPoint.completedAt, 10);
            if (!isNaN(timestamp)) {
              dateCompleted = new Date(timestamp).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
            }
          }
        }

        csvContent += `${checkPoint.focusArea},${tasksCompleted},${totalTasks},${assigned},${completed},${dateCompleted}\n`;
      });

      setCsvData(csvContent);
    } catch (err) {
      setError('Error generating CSV data.');
      console.error(err);
    }
  };

  const downloadCSV = () => {
    try {
      const { firstName, lastName } = selectedUserName;
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `${firstName}-${lastName}-Progress.csv`);
    } catch (err) {
      setError('Error downloading CSV file.');
      console.error(err);
    }
  };

  if (usersLoading || checkpointsLoading) return <p>Loading...</p>;
  if (usersError) return <p>Error: {usersError.message}</p>;
  if (checkpointsError) return <p>Error: {checkpointsError.message}</p>;

  return (
    <div>
      {error && <Alert severity="error">{error}</Alert>}
      <FormControl variant="outlined" style={{ minWidth: 200, marginBottom: '20px' }}>
        <InputLabel>User</InputLabel>
        <Select value={selectedUser} onChange={handleUserChange} label="User">
          {usersData.users.map(user => (
            <MenuItem key={user._id} value={user._id}>{user.firstName} {user.lastName}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center' }}>
      <Button variant="contained" color="primary" onClick={generateCSV} disabled={!selectedUser}>
        Generate CSV
      </Button>
      <Button variant="contained" color="secondary" onClick={downloadCSV} style={{ marginLeft: '10px' }} disabled={!csvData}>
        Download CSV
      </Button>
      </div>
    </div>
  );
};

export default CSVComponent;