import cors from "cors";
import 'dotenv/config';
import express from "express";
import sequelize from "./db/connection.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import instructorRoutes from "./routes/instructorRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";

import {seed} from './scripts/seed.js';

const app = express();



// Middleware
app.use(cors({
    origin: "*",
}));
app.use(express.json());

// Sync database
sequelize.sync({ alter: true }).then(() => {
    console.log("Database synced");
}).catch(err => {
    console.error("Database sync failed:", err);
});

app.use('/api/seed-now', async (req, res)=>{
    try {
        await seed();
        res.json({message: "Seeded Successfully"});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/student', studentRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});