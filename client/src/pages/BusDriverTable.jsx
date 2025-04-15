import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom

const URL = import.meta.env.VITE_SERVER_URL;

const BusDriverTable = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();  // Hook to navigate to another page

  const fetchBuses = async () => {
    try {
      const response = await axios.get(`${URL}/admin/getAllBuses`); // You must have this endpoint
      setBuses(response.data.buses);
    } catch (error) {
      console.error('Failed to fetch buses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
        <Typography variant="h6" mt={2}>Loading bus details...</Typography>
      </Box>
    );
  }

  const handleEdit = (bus) => {
    console.log("Edit clicked for bus:", bus);
    navigate(`/edit-bus/${bus._id}`, { state: { bus } });
  };

  return (
    <Box mt={5} px={3}>
      <Typography variant="h5" gutterBottom>Bus & Driver Details</Typography>
      <Box display="flex" justifyContent="flex-end" mb={2}>
    <Tooltip title="Add New Bus">
      <IconButton
        color="primary"
        onClick={() => navigate('/addbus')}
        sx={{ border: '1px solid #1976d2', borderRadius: '4px', px: 2 }}
      >
        <Typography fontWeight="bold" color="primary">+ Add Bus</Typography>
      </IconButton>
    </Tooltip>
  </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Bus Number</strong></TableCell>
              <TableCell><strong>Driver</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell><strong>Capacity</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Route</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {buses.map((bus) => (
              <TableRow key={bus._id}>
                <TableCell>{bus.busNumber}</TableCell>
                <TableCell>{bus.driverId?.name || 'Unassigned'}</TableCell>
                <TableCell>{bus.driverId?.phone || '-'}</TableCell>
                <TableCell>{bus.capacity}</TableCell>
                <TableCell>{bus.status}</TableCell>
                <TableCell>{bus.routeId?.routeName || '-'}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit Bus">
                    <IconButton color="primary" onClick={() => handleEdit(bus)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BusDriverTable;
