import { Router } from "express";
import { addRoute, uploadStops, addBus, getDriver, assignDriverToBus, getAllBuses, updateBus, getDashboardStats, getAllDrivers } from "../controller/adminController.js";

export const AdminRouter = Router();

AdminRouter.post("/addRoute",addRoute);
AdminRouter.post("/uploadStops",uploadStops);
AdminRouter.post("/addBus",addBus);
AdminRouter.get("/getAllBuses",getAllBuses);
AdminRouter.post("/assignDriverToBus",assignDriverToBus);
AdminRouter.put("/updateBus/:busId",updateBus);
AdminRouter.get("/user/:role", getDriver);
AdminRouter.get("/getDashboardStats",getDashboardStats);
AdminRouter.get("/getAllDrivers",getAllDrivers);

