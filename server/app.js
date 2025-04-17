import express from "express";
import { config } from "dotenv";
import cors from "cors";
import dbConnect from "./db/db.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { Server } from "socket.io";
import { createServer } from "http";
import authRoutes from "./routes/AuthRoutes.js";
import { AdminRouter } from "./routes/AdminRoutes.js";

config(); // Load env variables

const app = express();
const port = process.env.PORT || 3001;
const server = createServer(app);

// 🔐 Allowed origins for both Express and Socket.IO
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
];

// ✅ Express CORS Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  })
);

// ✅ Socket.IO Initialization with CORS
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173", // Vite frontend
      "http://localhost:5174",
    ],
    methods: ["GET", "POST"],
    credentials: true,
    transports: ['websocket', 'polling'], // ✅ Allow both transports
  },
});

// ✅ Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API Routes
app.use("/tracker/auth", authRoutes);
app.use("/tracker/admin", AdminRouter);

// ✅ Static & View Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

//Upload periodically in mongoDb
// const gpsBuffer = [];
// const FLUSH_INTERVAL_MS = 30000;// 30 seconds interval of flush to mongo

// setInterval(async () => {
//   if (gpsBuffer.length > 0) {
//     try {
//       await Log.insertMany(gpsBuffer);
//       console.log(`✅ Flushed ${gpsBuffer.length} GPS logs to MongoDB`);
//       gpsBuffer.length = 0;
//     } catch (err) {
//       console.error("❌ Error inserting GPS logs:", err);
//     }
//   }
// }, FLUSH_INTERVAL_MS);

// ✅ WebSocket Logic
io.on("connection", (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  socket.on("send-location", (data) => {
    console.log(`📍 Location received from ${socket.id}:`, data);
    // const { latitude, longitude, speed = 0, eta_minutes = 10 } = data;

    // // Add to buffer
    // gpsBuffer.push({
    //   lat: latitude,
    //   long: longitude,
    //   speed,
    //   eta_minutes,
    //   timestamp: new Date(),
    // });
    
    io.emit("receive-location", { id: socket.id, ...data });
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
    io.emit("user-disconnect", socket.id);
  });

  socket.onAny((event, ...args) => {
    console.log(`📩 Event received: ${event}`, args);
  });
});


// ✅ Root Route
app.get("/", (req, res) => {
  res.render("index");
});

// ✅ Start Server
server.listen(port, () => {
  console.log(`🚀 Server with Socket.io is running on http://localhost:${port}`);
});

// ✅ Connect to MongoDB
dbConnect();
