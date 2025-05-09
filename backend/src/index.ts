import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import routes from './routes';
import { createAdmin } from './types/create-admin';
import { createVideo } from './types/create-video';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [process.env.FRONTEND_URL || '', 'http://localhost:5174'].filter(Boolean), // Allow both frontends
    methods: ['GET', 'POST'],
  },
});

app.set('io', io);

app.use(cors({
  origin: [process.env.FRONTEND_URL || '', 'http://localhost:5174'], // Allow both frontends
  credentials: true,
}));

// Add a higher limit for file uploads if needed
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api', routes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

 createAdmin()
// createVideo()
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});