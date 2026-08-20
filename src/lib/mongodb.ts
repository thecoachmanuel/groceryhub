import mongoose from 'mongoose';
import { seedInitialDataIfNeeded } from './seed';

if (typeof window === 'undefined') {
  try {
    const nativeDns = eval("require('node:dns')");
    if (nativeDns && typeof nativeDns.setServers === 'function') {
      nativeDns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
    }
  } catch {
    // Ignore DNS override errors in restricted environments
  }
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://groceryhub:ooydl4ZOrDUakClM@cluster0.8r3acxq.mongodb.net/groceryhub?appName=Cluster0';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(async (m) => {
      // Safely seed default registered users & products on connection
      try {
        await seedInitialDataIfNeeded();
      } catch (seedErr) {
        console.warn('Seed execution warning:', seedErr);
      }
      return m;
    }).catch((err) => {
      cached.promise = null;
      console.error('MongoDB connection error:', err);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
