const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const formRoutes = require('./routes/form');
const responseRoutes = require('./routes/resp');
const bodyParser = require('body-parser');

require('dotenv').config();
const app = express();

// Increase limit to 10MB (or more if needed)
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/forms', formRoutes);
app.use('/api/responses', responseRoutes);

// MongoDB Atlas Connection
mongoose.connect(process.env.MongoDBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {console.log('Connected to MongoDB')
  const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
}
)
  .catch(err => console.error('Atlas connection error:', err));

app.get("/test", ()=>{
    console.log("test route");
    res.json("Server is running successfully");
})