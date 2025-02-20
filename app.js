// const's
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const PORT = process.env.PORT || 10000;

// MongoDB connection
const uri = `mongodb+srv://nesiagoodloe03:${process.env.MONGO_PWD}@cluster0.pff8r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// app.uses
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('./public/'));

// mongo client
const client = new MongoClient(uri);

// connect to MongoDB
async function run() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}
run().catch(console.error);

// render the main form
app.get('/', (req, res) => {
  res.sendFile('index.html'); // Make sure this points to your HTML form file
});

// handle form submission
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

  // insert into mongo
  await client.db("nesias-db").collection("my-collection").insertOne(formData);
  
  // redirect to /read to show the results
  res.redirect('/read');
});

// display the submitted data
app.get('/read', async (req, res) => {
  try {
    const results = await client.db("nesias-db").collection("my-collection").find({}).toArray();
    res.render('results', { data: results }); // Pass the data to the EJS view
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send('Error retrieving data');
  }
});

// update form
app.get('/update/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const response = await client.db("nesias-db").collection("my-collection").findOne({ _id: new ObjectId(id) });
    res.render('update', { response }); // Pass the fetched response to the update view
  } catch (err) {
    console.error('Error fetching data for update:', err);
    res.status(500).send('Error retrieving data for update');
  }
});

// handle update 
app.post('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { Fname, Lname, date, phonenum, Lnumber, activities, landmark, dest, places } = req.body;

  const updatedData = {
    firstName: Fname,
    lastName: Lname,
    date: date,
    phoneNumber: phonenum,
    lNumber: Lnumber,
    activities: Array.isArray(activities) ? activities : [], // This will now work correctly
    landmark: landmark || '',
    foodChoice: dest || '',
    places: places || ''
  };

  try {
    await client.db("nesias-db").collection("my-collection").updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
    res.redirect('/read');
  } catch (err) {
    console.error('Error updating data:', err);
    res.status(500).send('Error updating data');
  }
});

// handle delete 
app.post('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await client.db("nesias-db").collection("my-collection").deleteOne({ _id: new ObjectId(id) });
    res.redirect('/read');
  } catch (err) {
    console.error('Error deleting data:', err);
    res.status(500).send('Error deleting data');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running & listening on port ${PORT}`);
});
