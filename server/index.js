import dotenv from 'dotenv';
dotenv.config();
import express, { json, urlencoded } from "express";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine the base directory
const baseDir = process.env.NODE_ENV === 'production' ? path.join(process.cwd(), "/server") : __dirname;

// Database connection
mongoose.connect(process.env.MONGO_ATLAS_URI, {
    serverSelectionTimeoutMS: 100000
})
    .then(() => console.log('Connected to Genesisio DB successfully'))
    .catch(err => console.log(`ERROR In Connection to Genesisio DB: \n ${err}`));

// CORS configuration
const allowedOrigins = {
    // development: '*',
    development: 'http://localhost:5173',
    production: 'https://www.genesisio.net'
};

const corsOptions = {
    origin: allowedOrigins[process.env.NODE_ENV],
    methods: ["POST", "GET", "PATCH", "DELETE", "PUT", "OPTIONS"],
    credentials: true,
    optionsSuccessStatus: 204
};

// Use CORS middleware
app.use(cors(corsOptions));

// Parse JSON and URL-encoded bodies
app.use(json());
app.use(urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(baseDir, "./public/")));
app.set('trust proxy', 1);

// Routers
import './src/cronjobs/refreshTokenJob.js';
import authRouter from './src/auth/JWT.js';
import indexRouter from './src/routes/indexRouter.js';
import imageRouter from './src/routes/imageRouter.js';

app.use('/api', indexRouter);
app.use('/api/img', imageRouter);
app.use('/api/auth', authRouter);

// Root endpoint
app.get('/', (req, res) => res.json({ message: 'Get a life bro!' }));

// Start server
app.listen(port, () => console.log(`Client server listening on http://localhost:${port}/`));
