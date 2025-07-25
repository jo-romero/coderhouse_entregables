// db.js
const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://main-user:g5tOZV972iCThf6F@cluster0.eip2q6q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: 'entrega3', // Elegí el nombre que quieras para tu DB
    });
    console.log('✅ Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB Atlas:', error);
  }
};

module.exports = connectDB;