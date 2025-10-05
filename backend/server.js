const express = require('express')
const app = express();
const portfinder = require('portfinder');

// packages
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

// connection to DB and cloudinary
const { connectDB } = require('./config/database');
const { cloudinaryConnect } = require('./config/cloudinary');

// routes
const userRoutes = require('./routes/user');
const profileRoutes = require('./routes/profile');
// const paymentRoutes = require('./routes/payments');
const courseRoutes = require('./routes/course');


// middleware 
app.use(express.json()); // to parse json body
app.use(cookieParser());
app.use(
    cors({
        // origin: 'http://localhost:5173', // frontend link
        origin: "*",
        credentials: true
    })
);
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp'
    })
)


const BASE_PORT = parseInt(process.env.PORT, 10) || 4000;

// connections (initialize before starting server)
connectDB();
cloudinaryConnect();

// mount route
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/profile', profileRoutes);
// app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/course', courseRoutes);

// Default Route
app.get('/', (req, res) => {
    // console.log('Your server is up and running..!');
    res.send(`<div>
    This is Default Route  
    <p>Everything is OK</p>
    </div>`);
});

// Add a catch-all 404 handler for unmatched routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

// Use portfinder to find an available port
portfinder.getPort({ port: BASE_PORT }, (err, availablePort) => {
    if (err) {
        console.error('Error finding available port:', err);
        process.exit(1);
    }
    
    app.listen(availablePort, () => {
        console.log(`Server Started on PORT ${availablePort}`);
        if (availablePort !== BASE_PORT) {
            console.log(`Note: Original port ${BASE_PORT} was in use, using ${availablePort} instead`);
        }
    });
});