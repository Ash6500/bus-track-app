import Bus from "../models/busSchema.js";
import Route from "../models/routesSchema.js"; // Import the Route model
import Stop from "../models/stopsSchema.js";
import User from "../models/userSchema.js";


export const getDriver = async (req, res) => {
  try {
    const { role } = req.params;

    if (!['admin', 'user', 'driver'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role type' });
    }

    const users = await User.find({ role }).select('name identity role _id');

    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users by role:', err);
    res.status(500).json({ error: 'Server error while fetching users' });
  }
};


export const addBus = async (req, res) => {
    try {
      const { busNumber, driverId, capacity, routeId, status } = req.body;
  
      // ✅ Validate required fields
      if (!busNumber || !driverId || !capacity || !routeId) {
        return res.status(400).json({ error: "Missing required fields." });
      }
  
      // ✅ Check if the busNumber already exists
      const existingBus = await Bus.findOne({ busNumber });
      if (existingBus) {
        return res.status(409).json({ error: "Bus number already exists." });
      }
  
      // ✅ Verify driver exists and is a 'driver'
      const driver = await User.findById(driverId);
      if (!driver || driver.role !== "driver") {
        return res.status(400).json({ error: "Invalid driver ID or user is not a driver." });
      }
  
      // ✅ Verify the route exists
      const route = await Route.findById(routeId);
      if (!route) {
        return res.status(404).json({ error: "Route not found." });
      }
  
      // ✅ Create and save the new bus
      const newBus = new Bus({
        busNumber,
        driverId,
        capacity,
        routeId,
        status: status || "inactive",
      });
  
      await newBus.save();
  
      return res.status(201).json({ message: "Bus added successfully!", bus: newBus });
    } catch (error) {
      console.error("Error adding bus:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

  export const getAllBuses = async (req, res) => {
    try {
      const buses = await Bus.find()
        .populate({
          path: 'driverId',
          select: 'name identity phone role', // Only get needed fields
        })
        .populate({
          path: 'routeId',
          select: 'routeName source destination', // Add any route info needed
        })
        .sort({ createdAt: -1 }); // Latest first
  
      return res.status(200).json({ buses });
    } catch (error) {
      console.error('Error fetching buses:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  export const updateBus = async (req, res) => {
    try {
      const busId = req.params.busId;  // Fetching busId from URL parameters
      const { driverId, capacity, routeId, status } = req.body;
  
      // Validate if busId is present
      if (!busId) {
        return res.status(400).json({ error: 'Bus ID is required' });
      }
  
      // Find the bus by its ID
      const bus = await Bus.findById(busId);
      if (!bus) {
        return res.status(404).json({ error: 'Bus not found' });
      }
  
      // Optionally, check if the driver exists if provided
      if (driverId) {
        const driver = await User.findById(driverId);
        if (!driver || driver.role !== 'driver') {
          return res.status(400).json({ error: 'Invalid driver ID or user is not a driver.' });
        }
        bus.driverId = driverId;
      }
  
      // Update capacity, routeId, and status only if provided
      if (capacity) bus.capacity = capacity;
      if (routeId) bus.routeId = routeId;
      if (status) bus.status = status;
  
      // Save the updated bus details
      await bus.save();
  
      return res.status(200).json({ message: 'Bus updated successfully!', bus });
    } catch (error) {
      console.error('Error updating bus:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };


export const assignDriverToBus = async (req, res) => {
  try {
    const { busId, driverId } = req.body;

    // ✅ Validate inputs
    if (!busId || !driverId) {
      return res.status(400).json({ error: "Missing busId or driverId." });
    }

    // ✅ Check if the driver exists and is a driver
    const driver = await User.findById(driverId);
    if (!driver || driver.role !== "driver") {
      return res.status(400).json({ error: "Invalid driver ID or user is not a driver." });
    }

    // ✅ Check if the driver is already assigned to a bus
    const alreadyAssigned = await Bus.findOne({ driverId });
    if (alreadyAssigned) {
      return res.status(409).json({ error: "Driver is already assigned to another bus." });
    }

    // ✅ Find the bus and update its driverId
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ error: "Bus not found." });
    }

    bus.driverId = driverId;
    await bus.save();

    return res.status(200).json({ message: "Driver assigned to bus successfully.", bus });
  } catch (error) {
    console.error("Error assigning driver to bus:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


// ✅ ADD A NEW ROUTE
export const addRoute = async (req, res) => {
    try {
        const { routeName, source, destination, totalDistance, estimatedTime } = req.body;

        // Create a new Route with an empty stops array
        const newRoute = new Route({
            routeName,
            source,
            destination,
            stops: [], // Initially empty
            totalDistance,
            estimatedTime,
        });

        await newRoute.save();

        return res.status(201).json({ message: "Route added successfully!", route: newRoute });
    } catch (error) {
        console.error("Error adding route:", error);
        return res.status(500).json({ error: "Failed to add route" });
    }
};

// ✅ ADD A NEW STOP TO A SPECIFIC ROUTE
export const uploadStops = async (req, res) => {
    try {
        const { routeId, stops } = req.body; // Expect stops as an array

        // ✅ Validate if stops is an array and contains valid data
        if (!Array.isArray(stops) || stops.length === 0) {
            return res.status(400).json({ error: "Invalid stops data. Must be a non-empty array." });
        }

        // ✅ Find the route by ID
        const route = await Route.findById(routeId);
        if (!route) {
            return res.status(404).json({ error: "Route not found" });
        }

        // ✅ Transform stops to match the schema
        const formattedStops = stops.map((stop) => ({
            name: stop.stopName, // Convert `stopName` to `name`
            location: {
                type: "Point",
                coordinates: [parseFloat(stop.longitude), parseFloat(stop.latitude)], // Ensure correct order
            },
            landmark: stop.landmark || "",
        }));

        // ✅ Insert new stops into the database
        const newStops = await Stop.insertMany(formattedStops);

        // ✅ Map new stops with their sequence order
        const stopEntries = newStops.map((stop, index) => ({
            stopId: stop._id,
            order: index + 1, // Assigning order automatically based on array index
        }));

        // ✅ Push stops with order into the route
        route.stops.push(...stopEntries);
        await route.save();

        return res.status(201).json({ message: "Stops added successfully!", stops: stopEntries });
    } catch (error) {
        console.error("Error adding stops:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
