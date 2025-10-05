const mongoose = require('mongoose');
const User = require('./backend/models/user');
require('dotenv').config();

async function checkUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const user = await User.findOne({ email: 'testuser@example.com' });
    if (user) {
      console.log('User found:', user);
    } else {
      console.log('User not found');
    }
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkUser();
