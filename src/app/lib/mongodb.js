import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URL;
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URL environment variable');
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDB() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false }).then(mongo => mongo);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDB;
