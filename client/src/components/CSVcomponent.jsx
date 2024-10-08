import React, { useState, useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_USERS, GET_CHECKPOINTS_BY_USER } from '../utils/queries';
import { Button, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { saveAs } from 'file-saver';

const CSVComponent = () => {
  const { loading: usersLoading, error: usersError, data: usersData } = useQuery(GET_USERS);
  const [getCheckpoints, { loading: checkpointsLoading, error: checkpointsError, data: checkpointsData }] = useLazyQuery(GET_CHECKPOINTS_BY_USER);
  const [csvData, setCsvData] = useState('');
  const [error, setError] = useState('');
  const [focusArea, setFocusArea] = useState('');
  const [focusAreas, setFocusAreas] = useState([]);

  useEffect(() => {
    if (checkpointsData) {
      const areas = [...new Set(checkpointsData.checkPoints.map(cp => cp.focusArea))];
      setFocusAreas(areas);
    }
  }, [checkpointsData]);

  const handleFocusAreaChange = (event) => {
    setFocusArea(event.target.value);
    setCsvData(''); // Reset csvData to disable the download button
  };
  
  const generateCSV = async () => {
    if (!usersData || !focusArea) return;
  
    try {
      const users = usersData.users;
      let csvContent = `User,Completed,Date Completed\n`;
  
      for (const user of users) {
        const { data } = await getCheckpoints({ variables: { userId: user._id } });
        const userCheckpoints = data.checkPoints.filter(cp => cp.focusArea === focusArea);
  
        userCheckpoints.forEach(checkPoint => {
            const completed = checkPoint.checkpointCompleted ? 'Yes' : 'No';
            let dateCompleted = 'N/A';
          
            if (checkPoint.completedAt) {
              const date = new Date(checkPoint.completedAt);
              if (!isNaN(date.getTime())) {
                dateCompleted = date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
              } else {
                // Handle timestamp case
                const timestamp = parseInt(checkPoint.completedAt, 10);
                if (!isNaN(timestamp)) {
                  dateCompleted = new Date(timestamp).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
                }
              }
            }
          
            console.log(`Checkpoint Date: ${checkPoint.completedAt}, Parsed Date: ${dateCompleted}`);
            csvContent += `${user.firstName} ${user.lastName},${completed},${dateCompleted}\n`;
          });
      }
  
      setCsvData(csvContent);
    } catch (err) {
      setError('Error generating CSV data.');
      console.error(err);
    }
  };

  const downloadCSV = () => {
    try {
      const sanitizedFocusArea = focusArea.replace(/\s+/g, '-');
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `${sanitizedFocusArea}-Progress.csv`);
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
        <InputLabel>Focus Area</InputLabel>
        <Select value={focusArea} onChange={handleFocusAreaChange} label="Focus Area">
          <MenuItem value="Ankle Clinical Check Points">Ankle Clinical Check Points</MenuItem>
          <MenuItem value="Cervical Clinical Check Points">Cervical Clinical Check Points</MenuItem>
          <MenuItem value="Discussion Clinical Check Points">Discussion Clinical Check Points</MenuItem>
          <MenuItem value="Elbow Clinical Check Points">Elbow Clinical Check Points</MenuItem>
          <MenuItem value="Foot Clinical Check Points">Foot Clinical Check Points</MenuItem>
          <MenuItem value="Hip Clinical Check Points">Hip Clinical Check Points</MenuItem>
          <MenuItem value="Knee Clinical Check Points">Knee Clinical Check Points</MenuItem>
          <MenuItem value="Lumbar Clinical Check Points">Lumbar Clinical Check Points</MenuItem>
          <MenuItem value="Pelvic Girdle Clinical Check Points">Pelvic Girdle Clinical Check Points</MenuItem>
          <MenuItem value="Shoulder Clinical Check Points">Shoulder Clinical Check Points</MenuItem>
          <MenuItem value="Thoracic Clinical Check Points">Thoracic Clinical Check Points</MenuItem>
          <MenuItem value="Wrist Clinical Check Points">Wrist Clinical Check Points</MenuItem>
        </Select>
      </FormControl>
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center' }}>
        <Button variant="contained" color="primary" onClick={generateCSV} disabled={!focusArea}>
          Generate CSV
        </Button>
        <Button variant="contained" color="secondary" onClick={downloadCSV} disabled={!csvData}>
          Download CSV
        </Button>
      </div>
    </div>
  );
};

export default CSVComponent;