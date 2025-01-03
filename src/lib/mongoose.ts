import mongoose from 'mongoose';

let isConnect: boolean = false;


export const connectToData = async () => {
  if(!process.env.mongoURL) {
    console.error('MONGO_URL is not set');
    return;
  }
  if (isConnect) {
    console.log('Already connected to database');
    return;
  }

  try {
    await mongoose.connect(process.env.mongoURL as string, {
      dbName: 'e-learning',
    });
    isConnect = true;
    console.log('Connected to database');
  } catch (error) {
    console.error('Error connecting to database: ', error);
  }
}