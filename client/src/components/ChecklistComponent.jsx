import { Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ChecklistComponent = () => {
  const navigate = useNavigate();


  return (
    <Container sx={{ paddingBottom: '50px', display: "flex", justifyContent: 'center', alignItems: 'center'  }}>

     Checklist

    </Container>
  );
};
export default ChecklistComponent;