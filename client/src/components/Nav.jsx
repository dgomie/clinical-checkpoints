import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import logo from '../images/logo1.jpg';
import { useNavigate } from 'react-router-dom';
import Auth from '../utils/auth';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PersonIcon from '@mui/icons-material/Person';

function Nav() {
  const navigate = useNavigate();
  const isLoggedIn = Auth.loggedIn();
  let isAdmin = false;

  if (isLoggedIn) {
    try {
      isAdmin = Auth.getProfile().data.isAdmin;
    } catch (error) {
      console.error('Error decoding token:', error);
      Auth.logout(); // Log out the user if the token is invalid
      navigate('/login'); // Redirect to login page
    }
  }

  const [value, setValue] = React.useState(0);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const pages = isLoggedIn
    ? ['dashboard', ...(isAdmin ? ['admin'] : []), 'settings']
    : ['login'];

  return (
    <AppBar
      position="static"
      color="default"
      sx={{ mb: 3, backgroundColor: 'white' }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Button onClick={() => navigate('/')}>
            <img src={logo} width="150px" alt="" />
          </Button>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: isLoggedIn ? 'none' : 'flex', md: 'flex' },
              justifyContent: 'flex-end',
              marginRight: isLoggedIn ? '8%' : '0%',
            }}
          >
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => {
                  handleCloseNavMenu();
                  navigate(`/${page.replace(/\s+/g, '')}`);
                }}
                sx={{ my: 2, color: 'black', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>
          {isLoggedIn && (
            <Box
              sx={{
                display: { xs: 'flex' },
                justifyContent: { xs: 'flex-end' },
                flexGrow: { xs: 1 },
              }}
            >
              <Tooltip title="Logout">
                <IconButton onClick={Auth.logout} sx={{ p: 0, marginLeft: 2 }}>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Toolbar>
      </Container>
      {isLoggedIn && (
        <BottomNavigation
          sx={{
            width: '100%',
            position: 'fixed',
            bottom: 0,
            display: { xs: 'flex', md: 'none' },
            zIndex: 1300,
          }}
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);

            navigate(`/${pages[newValue].replace(/\s+/g, '')}`);
          }}
        >
          {pages.map((page, index) => (
            <BottomNavigationAction
              key={page}
              icon={
                index === 0 ? (
                  <HomeRoundedIcon />
                ) : index === 1 && isAdmin ? (
                  <AssignmentTurnedInIcon />
                ) : (
                  <PersonIcon />
                )
              }
            />
          ))}
        </BottomNavigation>
      )}
    </AppBar>
  );
}

export default Nav;