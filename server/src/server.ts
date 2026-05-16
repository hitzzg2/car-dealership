import 'dotenv/config';
import app from './app';
import connectDB from './config/database';

const PORT = parseInt(process.env.PORT || '3001', 10);

const start = async (): Promise<void> => {
  await connectDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📁 Environment: ${process.env.NODE_ENV}`);
  });
};

start().catch(console.error);
