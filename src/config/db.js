import mongoose from 'mongoose';
import dotenv from 'dotenv';
import chalk from 'chalk';
import { devLog } from '../utils/devlogger.js';

dotenv.config();

// const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/school_management';
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
    });
    devLog(`MongoDB Connected On Port: ${chalk.bold.red(conn.connection.host)}`,{level:"r"})
  } catch (error) {
     devLog(`MongoDB Connected Error: ${chalk.bold.red(error.message)}`,{level:"err"})
    process.exit(1);
  }
};

export default connectDB;