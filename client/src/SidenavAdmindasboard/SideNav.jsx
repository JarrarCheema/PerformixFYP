import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { NavLink, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import React,{useEffect , useState} from "react";
import { Select } from "flowbite-react";
import { IoSettingsOutline } from "react-icons/io5";
import logo from '../assets/Vector.png';
import axios from "axios";
import dicon from '../assets/icon.png';
import oicon from '../assets/building-07.png'
import deicon from '../assets/building-03.png'
import eicon from '../assets/users-01.png'
import sicon from '../assets/Icon (1).png'
import sticon from '../assets/Icon (2).png' 
import licon from '../assets/Icon (3).png'
import ricon from '../assets/clipboard-attachment.png'
import { BiFoodMenu } from "react-icons/bi";
const drawerWidth = 250;

const listItemData = [
  {
    label: "Dashboard",
    link: "/admin/dashboard",
    icon: <img src={dicon} alt="Dashboard" style={{ width: "18px", height: "18px" }} />,  // Use image icon
  },
  {
    label: "Organization Details",
    link: "/admin/orgdetails",
    icon: <img src={oicon} alt="Org Details" style={{ width: "18px", height: "18px" }} />,  // Use image icon
  },
  {
    label: "Departments",
    link: "/admin/departments",
    icon: <img src={deicon} alt="Departments" style={{ width: "18px", height: "18px" }} />,  // Use image icon
  },
  {
    label: "Line Managers",
    link: "/admin/employees",
    icon: <img src={eicon} alt="Employees" style={{ width: "18px", height: "18px" }} />,  // Use image icon
  },
  {
    label: "Set Metrics",
    link: "/admin/setmetrics",
    icon: <img src={sicon} alt="Set Metrics" style={{ width: "18px", height: "18px" }} />,  // Use image icon
  },
  {
    label: "Survey",
    link: "/admin/stafffeedback",
    icon: <img src={sticon} alt="Staff Feedback" style={{ width: "18px", height: "18px" }} />,  // Use image icon
  },
  {
    label:"Recomendation",
    link:"/admin/recomendation",
    icon:<img src={sticon} alt="Staff Feedback" style={{ width: "18px", height: "18px" }} />,
  },
  {
    label: "LeaderBoard",
    link: "/admin/leaderboard",
    icon: <img src={licon} alt="Leader Board" style={{ width: "18px", height: "18px" }} />,  // Use image icon
  },
  {
    label: "Report",
    link: "/admin/report",
    icon: <img src={ricon} alt="Report" style={{ width: "18px", height: "18px" }} />,  // Use image icon
  },
];


function SideNav(props) {
     const [organizations, setOrganizations] = useState([]);
  const { window, mobileOpen, handleDrawerToggle } = props;
  const navigate = useNavigate();
  // Retrieve the token from localStorage
  const token = localStorage.getItem("token");
console.log('token ', token);
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get("http://localhost:8080/organization/get-organizations", {
          headers: {
            Authorization: `${token}`, // Send token in Authorization header
          },
        });
        console.log('response', response);
        
        if (response.data.success) {
          setOrganizations(response.data.organizations); // Set organizations in state
        } else {
          console.error("Failed to fetch organizations:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };

    fetchOrganizations();
  }, [token]); 
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("Managertoken");
    localStorage.removeItem("Stafftoken");
    localStorage.removeItem("email");
    localStorage.removeItem("full_name");
    localStorage.removeItem("profile_photo");
    navigate("/login");
  };
  const [selectedOrganization, setSelectedOrganization] = useState(
    localStorage.getItem("selectedOrganization") || ""
  );
  
  const handleNextClick = (e) => {
    const selectedOrgName = e.target.value;
    setSelectedOrganization(selectedOrgName);
  
    const selectedOrg = organizations.find(
      (org) => org.organization_name === selectedOrgName
    );
  
    if (selectedOrg) {
      localStorage.setItem("selectedOrganizationId", selectedOrg.organization_id);
      localStorage.setItem("selectedOrganization", selectedOrgName); // ✅ Save Name
      console.log("Selected Organization ID:", selectedOrg.organization_id);
  
      window.location.reload(); // ✅ Reload Page
    } else {
      localStorage.removeItem("selectedOrganizationId");
      localStorage.removeItem("selectedOrganization");
      console.log("No organization selected");
       // Reload the page
  window.location.reload();
    }
  };
  
  
  const handleProfile = () => {
    localStorage.removeItem("authToken");
    navigate("/admin/setting");
  };

  const drawer = (
    <div
      style={{
        backgroundColor: "#ffffff",
        height: "100vh",
        borderRight: "2px solid lightgray",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        className="p-3 mx-auto"
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        <img src={logo} alt="Logo" className="h-8 w-8" />
        <span
          style={{
            fontFamily: "Poppins",
            fontSize: "25.71px",
            fontWeight: 600,
            lineHeight: "38.57px",
            letterSpacing: "0.1em",
            textAlign: "center",
            color: "#000000", // Updated text color
          }}
        >
          Performix
        </span>
      </div>

      {/* Select input */}
      <div className="mb-2 mx-2">
      <Select
  id="organization"
  required
  className="w-full"
  value={selectedOrganization}
  onChange={handleNextClick} // ✅ Fix: This will now get the event (e)
  style={{
    backgroundColor: "#f3f4f6",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "8px",
    fontSize: "14px",
    color: "#374151",
  }}
>
  <option value="">Select an organization</option>
  {organizations.map((org) => (
    <option key={org.organization_id} value={org.organization_name}>
      {org.organization_name}
    </option>
  ))}
</Select>

      </div>

      {/* Search Input */}
      {/* <form class="max-w-md mx-2">
        <div class="relative">
          <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            class="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search ...."
            required
          />
        </div>
      </form> */}

      {/* Menu List */}
      <List
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: 0,
          },
        }}
      >
        {listItemData.map((value, i) => (
          <RenderItem key={i} value={value} />
        ))}
      </List>

      {/* Logout */}
      <List style={{ padding: "20px", marginTop: "0px" }}>
        <ListItem
          disablePadding
          onClick={handleProfile}
          sx={{
            borderRadius: "8px",
            justifyContent: "center",
            cursor: "pointer",
            width: "150px",
            "&:hover .MuiTypography-root": {
              color: "#485E68", // Updated hover color
            },
          }}
        >
          <ListItemText
            primary={
              <Typography
                variant="body2"
                sx={{
                  fontSize: 18,
                  color: "#485E68", // Updated text color
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontFamily: "Poppins",
                }}
                title="logout"
              >
                <IoSettingsOutline fontSize="large" />
                Setting
              </Typography>
            }
          />
        </ListItem>
      </List>

      {/* Logout */}
      <List style={{ padding: "20px", marginTop: "0px" }}>
        <ListItem
          disablePadding
          onClick={handleLogout}
          sx={{
            borderRadius: "8px",
            justifyContent: "center",
            cursor: "pointer",
            width: "150px",
            "&:hover .MuiTypography-root": {
              color: "#485E68", // Updated hover color
            },
          }}
        >
          <ListItemText
            primary={
              <Typography
                variant="body2"
                sx={{
                  fontSize: 14,
                  color: "#485E68", // Updated text color
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontFamily: "Poppins",
                }}
                title="logout"
              >
                <LogoutIcon fontSize="small" />
                Logout
              </Typography>
            }
          />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { md: drawerWidth },
        flexShrink: { md: 0 },
      }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}

const RenderItem = ({ value }) => {
  const isActive = window.location.pathname === value.link;

  return (
    <ListItem disablePadding>
      <ListItemButton
        component={NavLink}
        to={value.link}
        sx={{
          backgroundColor: "transparent",
          color: isActive ? "#485E68" : "#485E68",
          "&:hover": {
            color: "#2C3E50", // Updated hover color
            borderLeft: "4px solid #2C3E50", // Hover effect
            "& .MuiTypography-root": {
              color: "#2C3E50", // Updated hover text color
            },
          },
          borderLeft: isActive ? "4px solid #485E68" : "none",
          paddingLeft: "16px",
          marginTop: "20px",
        }}
      >
        {value.icon}
        <ListItemText
          primary={
            <Typography
              variant="body2"
              sx={{
                fontSize: 16, // Increased text size
                color: isActive ? "#485E68" : "#485E68",
                fontFamily: "Poppins",
                paddingLeft: "10px",
              }}
              title={value.label}
            >
              {value.label}
            </Typography>
          }
        />
      </ListItemButton>
    </ListItem>
  );
};

SideNav.propTypes = {
  window: PropTypes.func,
};

export default SideNav;
