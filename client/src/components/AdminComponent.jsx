import { List, ListItem, ListItemButton, ListItemText, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AdminComponent = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Container sx={{ paddingBottom: '50px', display: "flex", flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation('/admin/view-clinicians')}>
            <ListItemText primary="View All Clinicians" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation('/admin/edit-clinician')}>
            <ListItemText primary="Edit Clinician" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation('/admin/assign-checkpoint')}>
            <ListItemText primary="Assign Checkpoint" />
          </ListItemButton>
        </ListItem>
      </List>
    </Container>
  );
};

export default AdminComponent;