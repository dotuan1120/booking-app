require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const authRouter = require('./routes/auth')
const bookingRouter = require('./routes/booking')
const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@booking-app.ezkyl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`);
    console.log("MongoDB connected")
  } catch (error) {
    console.log(error.message);
    process.exit(1)
  }
}

connectDB()

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/bookings', bookingRouter);

const PORT = 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))