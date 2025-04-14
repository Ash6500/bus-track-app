import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from "@mui/material";

const sampleStats = {
  totalBuses: 12,
  totalDrivers: 8,
  activeTrips: 5,
  totalRoutes: 6,
};

const buses = [
  { id: "BUS001", lat: 28.61, lng: 77.21, route: "R1", driver: "John Doe", speed: 40 },
  { id: "BUS002", lat: 28.62, lng: 77.22, route: "R2", driver: "Jane Smith", speed: 35 },
];

const drivers = [
  { name: "John Doe", contact: "1234567890", bus: "BUS001", status: "Active" },
  { name: "Jane Smith", contact: "9876543210", bus: "BUS002", status: "Inactive" },
];

const Dashboard = () => {
  return (
    <Box p={4} sx={{ backgroundColor: "#000" }}>
      <Typography variant="h3" color="textPrimary" gutterBottom>
        🧭 Admin Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={4} mb={4}>
        {Object.entries(sampleStats).map(([key, value]) => (
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
        <MapContainer center={[28.61, 77.21]} zoom={13} style={{ height: "450px", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {buses.map((bus) => (
            <Marker key={bus.id} position={[bus.lat, bus.lng]}>
              <Popup>
                <Typography variant="body2">
                  <strong>🚌 {bus.id}</strong>
                  <br />
                  Driver: {bus.driver}
                  <br />
                  Route: {bus.route}
                  <br />
                  Speed: {bus.speed} km/h
                </Typography>
              </Popup>
            </Marker>
          ))}
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
                <TableCell sx={{ fontWeight: "bold", backgroundColor: "#3f51b5", color: "white" }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: "bold", backgroundColor: "#3f51b5", color: "white" }}>Bus</TableCell>
                <TableCell sx={{ fontWeight: "bold", backgroundColor: "#3f51b5", color: "white" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {drivers.map((d, i) => (
                <TableRow key={i} sx={{ "&:hover": { backgroundColor: "#ADD8E6" } }}>
                  <TableCell>{d.name}</TableCell>
                  <TableCell>{d.contact}</TableCell>
                  <TableCell>{d.bus}</TableCell>
                  <TableCell
                    sx={{
                      color: d.status === "Active" ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {d.status}
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

