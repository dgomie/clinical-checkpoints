import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USERS, GET_CHECKPOINTS_BY_USER } from '../utils/queries';
import { Button } from '@mui/material';
import { saveAs } from 'file-saver';

const CSVComponent = () => {
  const {
    loading: usersLoading,
    error: usersError,
    data: usersData,
  } = useQuery(GET_USERS);
  const {
    loading: checkpointsLoading,
    error: checkpointsError,
    data: checkpointsData,
  } = useQuery(GET_CHECKPOINTS_BY_USER);
  const [csvData, setCsvData] = useState('');

  const generateCSV = () => {
    if (!usersData || !checkpointsData) return;

    const users = usersData.users;
    const checkpoints = checkpointsData.checkPoints;
    let csvContent = 'User,Checkpoint,Completed,Date Completed\n';

    users.forEach((user) => {
      const userCheckpoints = checkpoints.filter(
        (checkpoint) => checkpoint.userId === user._id
      );
      userCheckpoints.forEach((checkPoint) => {
        const completed = checkPoint.checkpointCompleted ? 'Yes' : 'No';
        const dateCompleted = checkPoint.completedAt
          ? new Date(checkPoint.completedAt).toLocaleString()
          : 'N/A';
        csvContent += `${user.firstName} ${user.lastName},${checkPoint.focusArea},${completed},${dateCompleted}\n`;
      });
    });

    setCsvData(csvContent);
  };

  const downloadCSV = () => {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'users_checkpoints.csv');
  };

  if (usersLoading || checkpointsLoading) return <p>Loading...</p>;
  if (usersError) return <p>Error: {usersError.message}</p>;
  if (checkpointsError) return <p>Error: {checkpointsError.message}</p>;

  return (
    <div>
      <Button variant="contained" color="primary" onClick={generateCSV}>
        Generate CSV
      </Button>
      {csvData && (
        <Button
          variant="contained"
          color="secondary"
          onClick={downloadCSV}
          style={{ marginLeft: '10px' }}
        >
          Download CSV
        </Button>
      )}
    </div>
  );
};

export default CSVComponent;
