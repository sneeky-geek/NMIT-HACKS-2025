# Civic Scroll Backend

This is the backend server for the Civic Scroll application, handling media uploads, storage, and reel management.

## Features

- Secure file upload and storage for reels (images and videos)
- RESTful API for CRUD operations on reels
- MongoDB integration for data persistence
- Express.js server with proper middleware setup

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/civic-scroll
   UPLOAD_DIR=uploads
   NODE_ENV=development
   ```

3. Start MongoDB:
   ```
   # Using local MongoDB instance
   mongod
   
   # Or if using MongoDB Atlas, configure the MONGODB_URI in .env
   ```

4. Start the server:
   ```
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Reels

- `GET /api/reels` - Get all reels (optionally filtered by userId)
- `GET /api/reels/:id` - Get a specific reel by ID
- `POST /api/reels` - Upload a new reel (requires media file and userId)
- `PUT /api/reels/:id` - Update a reel (likes, soundOn)
- `DELETE /api/reels/:id` - Delete a reel

## Directory Structure

- `/src` - Source code
  - `/controllers` - Request handlers
  - `/models` - Database models
  - `/routes` - API routes
  - `/middleware` - Custom middleware
- `/uploads` - Media storage directory 