const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());


const authRoutes = require('./routes/auth');
const leaveRoutes = require('./routes/leaveRoutes');


app.use('/api/auth', authRoutes);
app.use('/api/leave', leaveRoutes);


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

  app.get('/', (req, res) => {
    res.send('Welcome to the Leave Management System API');
  })

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
