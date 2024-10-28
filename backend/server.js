const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Leave = require('./models/Leave');
const cron = require('node-cron');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const twilio = require('twilio');

dotenv.config();

const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);//imp
app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.urlencoded({extended : false})) 


// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error("MongoDB Connection Error: ", err));

// Twilio setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
let client;
try {
  client = new twilio(accountSid, authToken);
} catch (error) {
  console.error("Twilio Client Setup Error: ", error);
}

// Function to send SMS with the daily approved leaves link
const sendDailyLink = async () => {
  try {
    console.log("Attempting to send SMS...");
    const message = await client.messages.create({
      body: 'Check today’s approved leaves: https://yourdomain.com/approved-leaves-today',
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.TWILIO_Recevier
    });
    console.log('Message sent: ', message.sid);
  } catch (error) {
    console.error('Failed to send message:', error);
  }
};


// Temporarily comment out to see if this affects server startup
sendDailyLink();

// Routes
const authRoutes = require('./routes/auth');
const leaveRoutes = require('./routes/leaveRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/leave', leaveRoutes);

// Cron job to delete leaves older than 7 days
cron.schedule('0 0 * * *', async () => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const result = await Leave.deleteMany({
      createdAt: { $lt: sevenDaysAgo }
    });
    console.log(`Deleted ${result.deletedCount} leave(s) older than 7 days.`);
  } catch (error) {
    console.error('Error deleting old leaves:', error);
  }
});

// Uncomment only for testing if needed
cron.schedule('*/1 * * * *', sendDailyLink); // Sends every minute for testing

app.get('/', (req, res) => {
  res.send('Welcome to the Leave Management System API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
