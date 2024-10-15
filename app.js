// Constants
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
const uri = `mongodb+srv://nesiagoodloe03:${process.env.MONGO_PWD}@cluster0.pff8r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// App uses
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('./public/'));

// Mongo client
const client = new MongoClient(uri);

// Connect to MongoDB
async function run() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}
run().catch(console.error);

// Render the main form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.ejs')); // Ensure this points to the correct HTML form file
});

// Handle form submission
app.post('/submit', async (req, res) => {
  console.log('Received POST request to /submit');
  console.log('Form data:', req.body);

  const { Fname, Lname, date, phonenum, Lnumber, activities, landmark, dest, places } = req.body;

  const formData = {
    firstName: Fname,
    lastName: Lname,
    date: date,
    phoneNumber: phonenum,
    lNumber: Lnumber,
    activities: Array.isArray(activities) ? activities : [],
    landmark: landmark || '',
    foodChoice: dest || '',
    places: places || ''
  };

  // Insert into MongoDB
  try {
    await client.db("nesias-db").collection("my-collection").insertOne(formData);
    // Redirect to /read to show the results
    res.redirect('/read');
  } catch (err) {
    console.error('Error inserting data into MongoDB:', err);
    res.status(500).send('Error saving data'); // Handle errors gracefully
  }
});

// Display the submitted data
app.get('/read', async (req, res) => {
  try {
    const results = await client.db("nesias-db").collection("my-collection").find({}).toArray();
    res.render('results', { data: results }); // Pass the data to the EJS view
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send('Error retrieving data');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running & listening on port ${PORT}`);
});
