import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Paper,
  MenuItem,
} from '@mui/material';
import axios from 'axios';

const URL = import.meta.env.VITE_SERVER_URL;

const EditBus = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [bus, setBus] = useState(location.state?.bus || {});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!bus._id) {
      setLoading(true);
      const fetchBus = async () => {
        try {
          const response = await axios.get(`${URL}/admin/getBusById/${id}`);
          setBus(response.data.bus);
        } catch (error) {
          console.error('Failed to fetch bus:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchBus();
    }
  }, [bus._id, id]);

  const handleUpdateBus = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${URL}/admin/updateBus/${id}`, bus);
      alert('Bus updated successfully');
      navigate('/admin/bus-driver-table');
    } catch (error) {
      console.error('Failed to update bus', error);
      alert('Failed to update bus');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBus((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
        <Typography mt={2}>Loading bus details...</Typography>
      </Box>
    );
  }

  return (
    <Box mt={5} px={3}>
      <Typography variant="h5" gutterBottom>
        Edit Bus
      </Typography>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box component="form" onSubmit={handleUpdateBus}>
          <TextField
            label="Bus Number"
            name="busNumber"
            value={bus.busNumber || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Driver ID"
            name="driverId"
            value={bus.driverId?._id || bus.driverId || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Capacity"
            name="capacity"
            value={bus.capacity || ''}
            onChange={handleChange}
            type="number"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Route ID"
            name="routeId"
            value={bus.routeId?._id || bus.routeId || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            select
            label="Status"
            name="status"
            value={bus.status || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="maintenance">Maintenance</MenuItem>
          </TextField>

          <Box mt={2}>
            <Button variant="contained" color="primary" fullWidth type="submit">
              Update Bus
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditBus;
