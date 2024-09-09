import React from 'react';
import { Paper, Container, List, ListItem, ListItemText, Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from '@apollo/client';
import { GET_USERS } from '../utils/queries';
import Auth from '../utils/auth'; 

const AdminViewCliniciansComponent = () => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_USERS);
  const currentUserId = Auth.getProfile().data._id; 

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const users = data.users.filter(user => user._id !== currentUserId);


  const groupedUsers = users.reduce((acc, user) => {
    const { officeLocation } = user;
    if (!acc[officeLocation]) {
      acc[officeLocation] = [];
    }
    acc[officeLocation].push(user);
    return acc;
  }, {});

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Paper elevation={3} sx={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', textAlign:'center'}}>
        <Typography variant='h5'>View All Clinicians</Typography>
      </Paper>

        {Object.keys(groupedUsers).sort().map(location => (
          <Accordion key={location}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{location}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {groupedUsers[location].map(user => (
                  <ListItem 
                    key={user._id} 
                    component={Link} 
                    to={`/admin/edit-user/${user._id}`} 
                    button
                  >
                    <ListItemText 
                      primary={`${user.firstName} ${user.lastName}`} 
                      secondary={`Email: ${user.email}`} 
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}

    </Container>
  );
};

export default AdminViewCliniciansComponent;