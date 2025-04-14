import express from "express";
import { finalDestinationETA, predictETA } from "../controller/busController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/predict-eta",verifyToken, predictETA);
router.post("/final_destination_eta",finalDestinationETA);

export default router;
