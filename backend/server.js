const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Leave = require('./models/Leave');
const cron=require('node-cron');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); 
const cors=require('cors');
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cookieParser()); 

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

const authRoutes = require('./routes/auth');
const leaveRoutes = require('./routes/leaveRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/leave', leaveRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

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

app.get('/', (req, res) => {
  res.send('Welcome to the Leave Management System API');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
