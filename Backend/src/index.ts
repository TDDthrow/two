import * as express from 'express';
import authRoutes from './routes/auth.route'
import messageRoutes from './routes/message.route'
import  * as dotenv from 'dotenv'
import { connetDB } from './lib/db';
import * as cookieParser from 'cookie-parser'
import * as cors from 'cors'
import { app, server } from './lib/socket';


dotenv.config()
app

app.use(express.json({ limit: "3mb" }));
app.use(express.urlencoded({ limit: "3mb", extended: true }));

app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from Vite
    credentials: true,              // If cookies are needed
}));

// app.use(cors({
//   origin: "http://localhost:5173", // Frontend URL
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true // Allow cookies if needed
// }));

app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connetDB()
});
 
