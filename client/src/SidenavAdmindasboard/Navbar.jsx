import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Button,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { IoIosLogOut, IoIosArrowDown } from "react-icons/io";
import { IoNotificationsOutline } from "react-icons/io5"; // Notification icon
import { IoPerson, IoSettingsSharp } from "react-icons/io5"; // Profile and Settings icons

const Navbar = ({ handleDrawerToggle }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null); // Notification menu
  const [avatarMenuAnchorEl, setAvatarMenuAnchorEl] = useState(null); // Avatar menu
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Detect small screens

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  // const handleNotificationClick = (event) => setNotificationAnchorEl(event.currentTarget); // Handle notification click
  const handleCloseNotificationMenu = () => setNotificationAnchorEl(null); // Close notification menu

  const handleAvatarMenuClick = (event) => setAvatarMenuAnchorEl(event.currentTarget); // Avatar menu
  const handleCloseAvatarMenu = () => setAvatarMenuAnchorEl(null); // Close avatar menu
  const handleNotificationClick = () => {
    navigate("/admin/notification"); // Replace "/notifications" with the actual route to your notification screen
  };
  

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    localStorage.removeItem("is_password_changed");
    navigate("/login");
  };

  return (
    <Box>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#f1f1f4",
          boxShadow: "none",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            padding: "0 16px",
            backgroundColor: "#ffff",
            margin: "10px",
            borderRadius: "10px",
            boxShadow: "none",
            marginLeft: { xs: 2, sm: 2, md: "250px", lg: "250px" },
          }}
        >
          {/* Mobile Menu Button */}
          <Box sx={{ display: "flex", alignItems: "start", justifyContent: "flex-start" }}>
            <Button
              variant="text"
              sx={{ display: { xs: "block", md: "none" } }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon style={{ color: "black" }} />
            </Button>
          </Box>

          {/* Dashboard Title (visible on larger screens) */}
          <Box sx={{ display: "flex", alignItems: "start", justifyContent: "flex-start", flexGrow: 1, mr: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#000", display: { xs: "none", sm: "block" } }}>
              Dashboard
            </Typography>
          </Box>

          {/* Notification Icon (visible on all screens) */}
          {/* {!isSmallScreen && (
                <Button
                variant="contained"
                sx={{
                  backgroundColor: "#0178fb", // bg-gray-400
                  color: "white",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#0178fb", // bg-gray-500
                  },
                  borderRadius: "20px", // Rounded corners
                  paddingX: 2, // Horizontal padding
                  paddingY: 1, // Vertical padding
                }}
              >
                + Add New
              </Button>
          )} */}
      

          {!isSmallScreen && (
            <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
              <IconButton onClick={handleNotificationClick}>
                <IoNotificationsOutline size={24} color="black" />
              </IconButton>

              {/* Notification Menu */}
              {/* <Menu
                anchorEl={notificationAnchorEl}
                open={Boolean(notificationAnchorEl)}
                onClose={handleCloseNotificationMenu}
              >
                <MenuItem onClick={handleCloseNotificationMenu}>Notification 1</MenuItem>
                <MenuItem onClick={handleCloseNotificationMenu}>Notification 2</MenuItem>
                <MenuItem onClick={handleCloseNotificationMenu}>Notification 3</MenuItem>
              </Menu> */}
            </Box>
          )}

       
          {/* Avatar and Dropdown (visible on smaller screens) */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={handleAvatarMenuClick}>
              <Avatar
                src="/path/to/profile.jpg" // Replace with actual image URL
                alt="Aaqib Aizaz"
                sx={{ width: 40, height: 40 }}
              />
            </IconButton>
            {!isSmallScreen && (
             <>
             <Box sx={{ ml: 1, textAlign: "left", padding: "10px" }}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "black" }}>
                Aaqib Aizaz
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sr. UX Designer
              </Typography>
            </Box>
            < IoIosArrowDown size={25} onClick={handleMenuClick}  style={{ color: "black" }}/>
            </>
            )}


            {/* Avatar Menu (visible only on small screens) */}
            {isSmallScreen && (
              <Menu
                anchorEl={avatarMenuAnchorEl}
                open={Boolean(avatarMenuAnchorEl)}
                onClose={handleCloseAvatarMenu}
              >
                <Box sx={{ ml: 1, textAlign: "left", padding: "10px" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "black" }}>
                    Aaqib Aizaz
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sr. UX Designer
                  </Typography>
                </Box>

                {/* Adding Profile and Settings in the Avatar menu */}
                <MenuItem onClick={handleCloseAvatarMenu}>
                  <IoPerson style={{ marginRight: 8 }} /> Profile
                </MenuItem>
                <MenuItem onClick={handleCloseAvatarMenu}>
                  <IoSettingsSharp style={{ marginRight: 8 }} /> Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <IoIosLogOut style={{ marginRight: 8 }} />
                  Logout
                </MenuItem>
                {/* <Button

  
>
  + Add New
</Button> */}
              </Menu>
            )}

            {/* Dropdown Menu (visible on larger screens) */}
         
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                <MenuItem onClick={handleCloseMenu}>
                  <IoPerson style={{ marginRight: 8 }} /> Profile
                </MenuItem>
                <MenuItem onClick={handleCloseMenu}>
                  <IoSettingsSharp style={{ marginRight: 8 }} /> Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <IoIosLogOut style={{ marginRight: 8 }} />
                  Logout
                </MenuItem>
              </Menu>
     
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
