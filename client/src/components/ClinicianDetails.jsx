import React from 'react';

const ClinicianDetails = ({ user }) => {
  return (
    <div>
      <h2>Clinician Details</h2>
      <p>ID: {user.id}</p>
      <p>Name: {user.name}</p>
      {/* Add more user details as needed */}
    </div>
  );
};

export default ClinicianDetails;