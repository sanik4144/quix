import 'dotenv/config';
import express from "express";
import cors from "cors";
import sequelize from "./db/con.js";
import * as models from "./models/index.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import instructorRoutes from "./routes/instructorRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";

const app = express();



// Middleware
app.use(cors());
app.use(express.json());

// Sync database
sequelize.sync({ alter: true }).then(() => {
    console.log("Database synced");
}).catch(err => {
    console.error("Database sync failed:", err);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/student', studentRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});