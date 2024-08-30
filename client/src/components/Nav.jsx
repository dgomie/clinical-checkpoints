import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import logo from '../images/navlogo.png';
import { useNavigate } from 'react-router-dom';
import Auth from '../utils/auth';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LibraryMusicRoundedIcon from '@mui/icons-material/LibraryMusicRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PersonIcon from '@mui/icons-material/Person';

function Nav() {
  const navigate = useNavigate();
  const isLoggedIn = Auth.loggedIn();
  const user = isLoggedIn ? Auth.getProfile() : null;
  const username = user ? user.data.username : '';

  const [value, setValue] = React.useState(0);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const toTitleCase = (str) => {
    return str.replace(
      /\w\S*/g,
      (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
  };

  const pages = isLoggedIn ? ['dashboard', 'legions', 'profile'] : ['login'];
  const settings = ['about', 'settings', 'logout'];

  return (
    <AppBar position="static" sx={{ mb: 3 }}>
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
                  if (page === 'profile') {
                    navigate(`/profile/${username}`);
                  } else {
                    navigate(`/${page.replace(/\s+/g, '')}`);
                  }
                }}
                sx={{ my: 2, color: 'white', display: 'block'}}
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
              <Tooltip title="Open settings">
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{ p: 0, marginLeft: 2 }}
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => {
                      handleCloseUserMenu();
                      if (setting === 'logout') {
                        Auth.logout();
                      } else {
                        navigate(`/${setting}`);
                      }
                    }}
                  >
                    <Typography textAlign="center">
                      {toTitleCase(setting)}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
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
            if (pages[newValue] === 'profile') {
              navigate(`/profile/${username}`);
            } else {
              navigate(`/${pages[newValue].replace(/\s+/g, '')}`);
            }
          }}
        >
          {pages.map((page, index) => (
            <BottomNavigationAction
              key={page}
              icon={
                index === 0 ? (
                  <HomeRoundedIcon />
                ) : index === 1 ? (
                  <LibraryMusicRoundedIcon />
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
