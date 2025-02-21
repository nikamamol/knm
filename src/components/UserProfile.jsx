import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link, useNavigate } from "react-router-dom";
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchUserDetails } from '../redux/reducer/registeruser/UserDetails';
import axios from 'axios';
import baseUrl from '../constant/ConstantApi';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

export default function UserProfile() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);

  // Fetch user details on component mount
  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  // Check token expiration and logout if expired
  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Current time in seconds

      // Check if token is expired
      if (decodedToken.exp < currentTime) {
        handleLogout(); // Token expired, perform logout
      } else {
        // Set timeout to log the user out exactly 2 seconds before the token expires
        const timeUntilExpiration = (decodedToken.exp - currentTime) * 1000 - 2000; // 2 seconds before expiration
        const timeoutId = setTimeout(handleLogout, timeUntilExpiration);

        // Cleanup the timeout on component unmount
        return () => clearTimeout(timeoutId);
      }
    }
  }, [dispatch, user]); // Added user as a dependency to re-run if user data changes

  const username = user?.username || 'User';

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    let currentUserId = user?._id; // Get userId from user state

    // If userId is not present, log out without making the API call
    if (!currentUserId) {
      // console.warn("User ID not found. Fetching user details.");
      await dispatch(fetchUserDetails()); // Fetch user details again
      currentUserId = user?._id; // Update userId after fetching

      // Check again if userId is available
      if (!currentUserId) {
        // console.warn("User ID still not found after fetching. Logging out without API call.");
        clearLocalStorage();
        navigate('/');
        return;
      }
    }

    try {
      // Make the logout API request
      await axios.post(`${baseUrl}user/logout`, { userId: currentUserId });

      // Clear local storage
      clearLocalStorage();

      // Navigate to login page
      navigate('/');
    } catch (error) {
      toast.error('Logout failed. Please try again.',error.message);
      // console.error('Logout error:', error.message);
     
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  };

  return (
    <>
      {!loading ? (
        <Box>
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <span className='me-2 text-dark'>{username}</span>
              <Avatar sx={{ width: 40, height: 40, backgroundColor: "#f7434fcc", padding: "5px" }}>
                {username.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
      ) : (
        <div className='text-danger'>Loading..</div>
      )}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar />
          <Link to="/user/profile" className='text-decoration-none text-dark'>
            Profile
          </Link>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <span className='text-dark'>Log-Out</span>
        </MenuItem>
      </Menu>
      {error && <div className="error">{error}</div>}
    </>
  );
}
