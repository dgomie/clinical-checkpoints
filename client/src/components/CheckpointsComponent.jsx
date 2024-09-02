import { Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CheckpointsComponent = () => {
  const navigate = useNavigate();


  return (
    <Container sx={{ paddingBottom: '50px', display: "flex", justifyContent: 'center', alignItems: 'center'  }}>

     User Checkpoints

    </Container>
  );
};
export default CheckpointsComponent;