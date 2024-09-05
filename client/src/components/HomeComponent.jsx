import { Button, Container, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import image from "../images/running.jpg";

const HomeComponent = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <Container sx={{ paddingBottom: '50px', display: "flex", flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Box
        component="img"
        sx={{
          width: '100%',
          height: 'auto',
          marginBottom: '20px',
        }}
        alt="Running"
        src={image}
      />
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <Button variant="contained" sx={{ margin: '1rem' }} onClick={handleLoginClick}>
          Login
        </Button>
        <Button variant="contained" sx={{ margin: '1rem' }} onClick={handleSignUpClick}>
          Sign Up
        </Button>
      </Box>
    </Container>
  );
};

export default HomeComponent;
