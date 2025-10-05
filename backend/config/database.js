const mongoose = require('mongoose');
require('dotenv').config();

/**
 * Connect to MongoDB.
 * Priority:
 * 1) Use process.env.DATABASE_URL if provided
 * 2) Fallback to an in-memory MongoDB instance for local development
 */
exports.connectDB = async () => {
    const dbUrl = process.env.DATABASE_URL;

    if (dbUrl && (dbUrl.startsWith('mongodb://') || dbUrl.startsWith('mongodb+srv://'))) {
        try {
            await mongoose.connect(dbUrl, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('Database connected successfully');
            return;
        } catch (error) {
            console.log('Error while connecting server with Database using DATABASE_URL');
            console.log(error);
            process.exit(1);
        }
    }

    // Dev fallback: spin up an in-memory MongoDB so the API can run without a local Mongo server
    try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connected using in-memory MongoDB (development fallback)');

        // On process exit, stop the memory server
        const cleanup = async () => {
            try { await mongoose.disconnect(); } catch (_) {}
            try { await mongod.stop(); } catch (_) {}
            process.exit(0);
        };
        process.on('SIGINT', cleanup);
        process.on('SIGTERM', cleanup);
        process.on('exit', async () => { try { await mongod.stop(); } catch (_) {} });
    } catch (error) {
        console.log('Failed to start in-memory MongoDB. Please set a valid DATABASE_URL.');
        console.log(error);
        process.exit(1);
    }
};

