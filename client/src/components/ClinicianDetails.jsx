import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_CHECKPOINTS_BY_USER } from '../utils/queries';
import { Typography } from '@mui/material';

const ClinicianDetails = ({ user }) => {
  const { loading, error, data } = useQuery(GET_CHECKPOINTS_BY_USER, {
    variables: { userId: user._id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  console.log(data)
  const assignedCheckpoints = data?.checkPoints?.filter(checkpoint => checkpoint.checkpointAssigned && !checkpoint.checkpointCompleted) || [];
  const completedCheckpoints = data?.checkPoints?.filter(checkpoint => checkpoint.checkpointCompleted) || [];
  console.log(assignedCheckpoints)
  return (
    <div>
      <Typography variant='h4'>Clinician Details</Typography>
      <Typography variant='h6'>Name: {user.firstName} {user.lastName}</Typography>
      <Typography variant='h5'>Assigned Check Points</Typography>
      <ul>
        {assignedCheckpoints.map(checkpoint => (
          <li key={checkpoint._id}>{checkpoint.focusArea}</li>
        ))}
      </ul>
      <Typography variant='h5'>Completed Check Points</Typography>
      <ul>
        {completedCheckpoints.map(checkpoint => (
          <li key={checkpoint._id}>{checkpoint.focusArea}</li>
        ))}
      </ul>
    </div>
  );
};

export default ClinicianDetails;