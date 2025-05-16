import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        // Drop existing users collection if it exists
        const db = mongoose.connection.db;
        const collections = await db.listCollections({ name: 'users' }).toArray();
        if (collections.length > 0) {
            await db.dropCollection('users');
            console.log('Dropped existing users collection');
        }
        
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;
