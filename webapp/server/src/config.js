import dotenv from 'dotenv';
import path from 'path';

if(process.env.NODE_ENV != 'production'){
  dotenv.config({ path: path.resolve(__dirname, '.env') });
}

// Change configurations here
// Mongo currently connected to 'test' database
module.exports = {
  jwt_secret: process.env.JWT_SECRET || 'no jwt secret specified',
  mongoose: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:9999999'
  },
}