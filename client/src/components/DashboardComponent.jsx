import { Container, Paper, Typography, Card, CardContent, List, ListItem, Collapse, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Auth from "../utils/auth";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_BY_ID, GET_UNCOMPLETED_CHECKPOINTS } from "../utils/queries";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const DashboardComponent = () => {
  const navigate = useNavigate();
  const user = Auth.getProfile();
  const userId = user?.data?._id;

  console.log(userId);

  const { loading: userLoading, error: userError, data: userData } = useQuery(GET_USER_BY_ID, {
    variables: { id: userId },
  });

  const { loading: checkpointsLoading, error: checkpointsError, data: checkpointsData } = useQuery(GET_UNCOMPLETED_CHECKPOINTS, {
    variables: { userId },
  });

  const [open, setOpen] = useState(false);

  if (userLoading || checkpointsLoading) return <p>Loading...</p>;
  if (userError) return <p>Error: {userError.message}</p>;
  if (checkpointsError) return <p>Error: {checkpointsError.message}</p>;

  const userFirstName = userData?.userById?.firstName;
  const uncompletedCheckpoints = checkpointsData?.uncompletedCheckpoints || [];

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <Container>
      <Paper elevation={3} sx={{ marginBottom: 2, padding: { xs: 2, sm: 4, md: 6 } }}>
        <Typography variant="h4" component="header">
          Welcome {userFirstName}
        </Typography>
      </Paper>
      <Paper elevation={3} sx={{ marginBottom: 2, padding: { xs: 2, sm: 4, md: 6 } }}>
        <Typography variant="h5" component="header" onClick={handleToggle} style={{ cursor: 'pointer' }}>
          Uncompleted Checkpoints {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Typography>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List>
            {uncompletedCheckpoints.map((checkpoint) => (
              <ListItem key={checkpoint._id}>
                <Card variant="outlined" sx={{ width: '100%' }}>
                  <CardContent>
                    <Typography variant="h6">{checkpoint.focusArea}</Typography>
                    <List>
                      {checkpoint.tasks.map((task, index) => (
                        <ListItem key={index}>
                          <Typography variant="body2">{task.description}</Typography>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </ListItem>
            ))}
          </List>
        </Collapse>
      </Paper>
    </Container>
  );
};

export default DashboardComponent;