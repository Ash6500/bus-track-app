import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import OperationDetails from '../components/OperationDetails';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate

const URL = import.meta.env.VITE_SERVER_URL;

const AddBus = () => {
  const [busNumber, setBusNumber] = useState('');
  const [driverId, setDriverId] = useState('');
  const [capacity, setCapacity] = useState('');
  const [routeId, setRouteId] = useState('');
  const [status, setStatus] = useState('inactive');

  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [opMessage, setOpMessage] = useState('');
  const [opSeverity, setOpSeverity] = useState('success');
  const [showOp, setShowOp] = useState(false);

  const navigate = useNavigate(); // ✅ Initialize navigate

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [driverRes, routeRes] = await Promise.all([
          axios.get(`${URL}/admin/user/driver`),
          axios.get(`${URL}/auth/getAllRoutes`),
        ]);
        setDrivers(driverRes.data);
        setRoutes(routeRes.data.routes);
      } catch (err) {
        console.error('Error fetching data', err);
        setOpMessage('❌ Failed to load drivers or routes.');
        setOpSeverity('error');
        setShowOp(true);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (showOp) {
      const timer = setTimeout(() => setShowOp(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showOp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { busNumber, driverId, capacity, routeId, status };

    try {
      await axios.post(`${URL}/admin/addBus`, payload);
      setOpMessage('✅ Bus added successfully!');
      setOpSeverity('success');
      setShowOp(true);

      // Clear form
      setBusNumber('');
      setDriverId('');
      setCapacity('');
      setRouteId('');
      setStatus('inactive');

      // ✅ Redirect after short delay
      setTimeout(() => {
        navigate('/admin/bus-driver-table');
      }, 1000);
    } catch (err) {
      console.error('Error adding bus:', err);
      setOpMessage('❌ Failed to add bus. Please try again.');
      setOpSeverity('error');
      setShowOp(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 4 }}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
  <Button 
    variant="outlined" 
    color="secondary" 
    onClick={() => navigate('/admin/bus-driver-table')}
  >
    View Assigned Drivers
  </Button>
</Box>

      <Typography variant="h5" gutterBottom>
        Add New Bus
      </Typography>

      <OperationDetails
        message={opMessage}
        severity={opSeverity}
        open={showOp}
        onClose={() => setShowOp(false)}
      />

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          label="Bus Number"
          value={busNumber}
          onChange={(e) => setBusNumber(e.target.value)}
          fullWidth
          required
          margin="normal"
        />

        <TextField
          label="Driver"
          value={driverId}
          onChange={(e) => setDriverId(e.target.value)}
          select
          fullWidth
          required
          margin="normal"
        >
          <MenuItem value="">Select Driver</MenuItem>
          {drivers.map((driver) => (
            <MenuItem key={driver._id} value={driver._id}>
              {driver.name} ({driver.identity})
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Capacity"
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          fullWidth
          required
          margin="normal"
        />

        <TextField
          label="Route"
          value={routeId}
          onChange={(e) => setRouteId(e.target.value)}
          select
          fullWidth
          required
          margin="normal"
        >
          <MenuItem value="">Select Route</MenuItem>
          {routes.map((route) => (
            <MenuItem key={route._id} value={route._id}>
              {route.routeName}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          select
          fullWidth
          margin="normal"
        >
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
          <MenuItem value="maintenance">Maintenance</MenuItem>
        </TextField>

        <Box mt={3}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Add Bus'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default AddBus;
