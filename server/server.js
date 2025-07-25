import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { notFound, errorHandler } from './utils/errorHandler.js';
import routes from './routes/index.js';
import { admin, db, auth } from './config/firebase.config.js';

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test Firebase Connection
async function testFirebaseConnection() {
  try {
    // Test Firestore connection
    await db.collection('test').doc('test').get();
    console.log('✅ Firebase Firestore connection successful');
    
    // Test Auth connection
    await auth.listUsers(1);
    console.log('✅ Firebase Auth connection successful');
  } catch (error) {
    console.error('❌ Firebase connection failed:', error.message);
    process.exit(1); // Exit if Firebase connection fails
  }
}

// Routes
app.use('/api', routes);

// Error Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Test Firebase connection after server starts
  await testFirebaseConnection();
  
  // Additional debug info
  console.log('🛠️  Environment:', process.env.NODE_ENV || 'development');
  console.log('🔥 Firebase Project:', admin.app().options.projectId);
});