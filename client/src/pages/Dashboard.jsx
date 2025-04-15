import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import axios from "axios";

const URL = import.meta.env.VITE_SERVER_URL;

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, busRes, driverRes] = await Promise.all([
          axios.get(`${URL}/admin/getDashboardStats`),
          axios.get(`${URL}/admin/getAllBuses`),
          axios.get(`${URL}/admin/getAllDrivers`),
        ]);

        setStats(statsRes.data); // { totalBuses, totalDrivers, activeTrips, totalRoutes }
        setBuses(busRes.data.buses); // [{ busNumber, location: { coordinates }, driverId, ... }]
        setDrivers(driverRes.data);  // [{ name, phone, busNumber, status }]
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <Box p={4} sx={{ backgroundColor: "#000" }}>
      <Typography variant="h3" color="textPrimary" gutterBottom>
        🧭 Admin Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={4} mb={4}>
        {Object.entries(stats).map(([key, value]) => (
          <Grid item xs={6} sm={3} key={key}>
            <Card sx={{ padding: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  {key.replace(/([A-Z])/g, " $1")}
                </Typography>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Map Section */}
      <Card sx={{ mb: 4, borderRadius: 2, overflow: "hidden", boxShadow: 3 }}>
        <MapContainer center={[20.2961, 85.8245]} zoom={13} style={{ height: "450px", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {buses.map((bus) => {
  const coords = bus?.location?.coordinates;
  if (!coords || coords.length !== 2) return null;

  const [lng, lat] = coords;

  return (
    <Marker key={bus._id} position={[lat, lng]}>
      <Popup>
        <Typography variant="body2">
          <strong>🚌 {bus.busNumber}</strong><br />
          Driver: {bus.driverId?.name || "Unassigned"}<br />
          Route: {bus.routeId?.routeName || "N/A"}
        </Typography>
      </Popup>
    </Marker>
  );
})}

        </MapContainer>
      </Card>

      {/* Driver Management */}
      <Card sx={{ padding: 4, boxShadow: 3 }}>
        <Typography variant="h5" color="textPrimary" fontWeight="bold" gutterBottom>
          👨‍✈️ Driver Management
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", backgroundColor: "#3f51b5", color: "white" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold", backgroundColor: "#3f51b5", color: "white" }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: "bold", backgroundColor: "#3f51b5", color: "white" }}>Bus</TableCell>
                <TableCell sx={{ fontWeight: "bold", backgroundColor: "#3f51b5", color: "white" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {buses.map((bus, i) => (
                <TableRow key={i} sx={{ "&:hover": { backgroundColor: "#ADD8E6" } }}>
                  <TableCell>{bus.driverId.name}</TableCell>
                  <TableCell>{bus.driverId.phone}</TableCell>
                  <TableCell>{bus.busNumber || "Unassigned"}</TableCell>
                  <TableCell
                    sx={{
                      color: bus.status === "active" ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {bus.status?.toLowerCase()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default Dashboard;
