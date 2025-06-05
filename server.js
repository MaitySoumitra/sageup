const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();


const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true })); // for form data
app.use(express.json());
// Example EJS route
app.get('/ejs-example', (req, res) => {
    res.render('example', { title: 'EJS Example', message: 'Hello from EJS!' });
});
// Middleware
app.use(cors());


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  

})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Route handling
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/profiles', require('./routes/profileRoute'));
app.use('/api/contacts',    require('./routes/contactRoute'));

// Default route
app.get('/', (req, res) => {
 
  res.render('layout', { title: 'SageUp'});
});
app.get('/login', (req, res) => {
  res.render('user/login', { title: 'Login Page' });
});
app.get('/register', (req, res) => {
  res.render('user/register', { title: 'Register Page' });
});
app.get('/edit-profile', (req, res) => {
  res.render('profile/edit-profile', { title: 'Profile Page' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

