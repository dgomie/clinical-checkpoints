import {
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';
import Auth from '../utils/auth';
import { useQuery } from '@apollo/client';
import { GET_USER_BY_ID, CHECKPOINTS_QUERY } from '../utils/queries';

const DashboardComponent = () => {
  const user = Auth.getProfile();
  const userId = user?.data?._id;

  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(GET_USER_BY_ID, {
    variables: { id: userId },
  });

  const {
    loading: checkpointsLoading,
    error: checkpointsError,
    data: checkpointsData,
  } = useQuery(CHECKPOINTS_QUERY, {
    variables: { userId },
  });

  if (userLoading || checkpointsLoading) return <p>Loading...</p>;
  if (userError) return <p>Error: {userError.message}</p>;
  if (checkpointsError) return <p>Error: {checkpointsError.message}</p>;

  const userFirstName = userData?.userById?.firstName;
  const checkpoints = checkpointsData?.checkPoints || [];

  const incompleteCheckpoints = checkpoints.filter(cp => !cp.checkpointCompleted && cp.checkpointAssigned);
  const completedCheckpoints = checkpoints.filter(cp => cp.checkpointCompleted);

  return (
    <Container sx={{mb:"1rem"}}>
      <Paper
        elevation={3}
        sx={{ marginBottom: 2, padding: { xs: 2, sm: 4, md: 6 } }}
      >
        <Typography variant="h4" component="header" sx={{textAlign: "center"}}>
          Welcome {userFirstName}
        </Typography>
      </Paper>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='h6'>Assigned Check Points</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {incompleteCheckpoints.length === 0 ? (
            <Typography>All Check Points Complete</Typography>
          ) : (
            <List>
              {incompleteCheckpoints.map((checkpoint) => (
                <ListItem key={checkpoint.id}>
                  <Link
                    to={`/checkpoints/${checkpoint.id}`}
                    style={{ width: '100%', textDecoration: 'none' }}
                  >
                    <Card
                      sx={{
                        width: '100%',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          boxShadow: 3,
                        },
                      }}
                    >
                      <CardContent>
                        <Typography variant="h5">
                          {checkpoint.focusArea}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </ListItem>
              ))}
            </List>
          )}
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='h6'>Completed Check Points</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {completedCheckpoints.length === 0 ? (
            <Typography>No Check Points to Display</Typography>
          ) : (
            <List>
              {completedCheckpoints.map((checkpoint) => (
                <ListItem key={checkpoint.id}>
                  <Link
                    to={`/checkpoints/${checkpoint.id}`}
                    style={{ width: '100%', textDecoration: 'none' }}
                  >
                    <Card
                      sx={{
                        width: '100%',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          boxShadow: 3,
                        },
                      }}
                    >
                      <CardContent>
                        <Typography variant="h5">
                          {checkpoint.focusArea}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </ListItem>
              ))}
            </List>
          )}
        </AccordionDetails>
      </Accordion>
    </Container>
  );
};

export default DashboardComponent;