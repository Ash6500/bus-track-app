import React from "react";
import { Link } from "react-router-dom"; // If you are using react-router for navigation
import { Card, CardContent, Grid, Typography, Button, Box } from "@mui/material";

const AdminHome = () => {
  // Sample data for system stats and recent activities
  const sampleStats = {
    totalBuses: 12,
    activeDrivers: 8,
    runningTrips: 5,
    totalRoutes: 6,
  };

  const recentActivities = [
    "🚌 BUS001 started Trip on Route R1",
    "✅ Driver John Doe logged in",
    "🛑 BUS002 completed Route R2",
  ];

  const quickLinks = [
    { label: "Manage Buses", path: "/admin/buses" },
    { label: "Manage Drivers", path: "/admin/drivers" },
    { label: "Trip Logs", path: "/admin/trips" },
    { label: "Routes", path: "/admin/routes" },
  ];

  return (
    <Box p={4} sx={{ spaceY: 8 }}>
      {/* Welcome Section */}
      <Card sx={{ background: "linear-gradient(to right, #3f51b5, #2196f3)", color: "white", p: 4, mb: 4 }}>
        <CardContent>
          <Typography variant="h3" component="h1" fontWeight="bold">Welcome, Admin!</Typography>
          <Typography variant="body1" mt={2}>Here's a quick summary of today's activity in the Bus Tracking System.</Typography>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <Grid container spacing={4} mb={4}>
        {Object.entries(sampleStats).map(([key, value]) => (
          <Grid item xs={6} sm={3} key={key}>
            <Card sx={{ textAlign: "center", p: 3, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary">{key.replace(/([A-Z])/g, " $1")}</Typography>
                <Typography variant="h4" color="primary">{value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activities */}
      <Card sx={{ p: 4, boxShadow: 3, mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" color="textPrimary" mb={2}>Recent Activities</Typography>
          <ul>
            {recentActivities.map((activity, idx) => (
              <li key={idx} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                <Typography variant="body1" color="textSecondary" mr={2}>✔️</Typography>
                <Typography variant="body1" color="textSecondary">{activity}</Typography>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Quick Links / Navigation */}
      <Grid container spacing={4}>
        {quickLinks.map((link, idx) => (
          <Grid item xs={6} sm={3} key={idx}>
            <Link to={link.path} style={{ textDecoration: "none" }}>
              <Button 
                variant="contained" 
                fullWidth 
                sx={{
                  background: "linear-gradient(to right, #26c6da, #00bcd4)",
                  textAlign: "center",
                  fontWeight: "bold",
                  '&:hover': {
                    background: "linear-gradient(to right, #00bcd4, #26c6da)"
                  }
                }}
              >
                {link.label}
              </Button>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminHome;
