import { Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomeComponent = () => {
  const navigate = useNavigate();


  const handleLoginClick = () => {
    navigate('/login')
  }
  const handleSignUpClick = () => {
    navigate('/signup')
  }


  return (
    <Container sx={{ paddingBottom: '50px', display: "flex", justifyContent: 'center', alignItems: 'center'  }}>

      <Button variant="contained" sx={{ margin: '1rem' }} onClick={handleLoginClick}>
        Login
      </Button>
 
      <Button variant="contained" sx={{ margin: '1rem' }} onClick={handleSignUpClick}>
        Sign Up
      </Button>

    </Container>
  );
};
export default HomeComponent;
