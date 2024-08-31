import { Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const DashboardComponent = () => {
  const navigate = useNavigate();


  const handleLoginClick = () => {
    navigate('/login')
  }
  const handleSignUpClick = () => {
    navigate('/signup')
  }


  return (
    <Container sx={{ paddingBottom: '50px', display: "flex", justifyContent: 'center', alignItems: 'center'  }}>

     Dash

    </Container>
  );
};
export default DashboardComponent;
