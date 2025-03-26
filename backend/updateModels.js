import mongoose from 'mongoose';
import User from './models/User.js';  // Adjust the path to your User model

const URL = process.env.MONGODB_URL;

mongoose.connect(URL)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const updateUsers = async () => {
  try {
    const result = await User.updateMany({}, { 
      $set: { 
        resetPasswordToken: null, 
        resetPasswordExpire: null 
      } 
    });
    console.log(`Updated ${result.nModified} users`);
  } catch (err) {
    console.error('Error updating users:', err);
  } finally {
    mongoose.connection.close();  // Close the connection when done
  }
};

// Run the update function
updateUsers();
