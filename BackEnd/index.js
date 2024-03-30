const express = require('express');
const cors = require('cors');
const client = require('./conn');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json()); //for json data
app.use(bodyParser.urlencoded({ extended: false })); //for URL encoded data

app.get('/', (req, res) => {

    const message ={
        "msg": "Hello World"
    };

    res.send(JSON.stringify(message));

});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.get('/testConnection', async (req, res) => {
    const query = 'SELECT * FROM students';
    const errorMessage = 'students not found, students might be empty';

    try {
        const { rows } = await client.query(query);

    if (rows.length === 0) {
      res.status(404).json({ error: errorMessage });
    } else {
      res.json(rows);
    }
    } catch (error) {
      console.error('Error querying the database:', error);
      res.status(500).send('Internal Server Error');
    } 
});

app.post('/register', (req, res) =>{

    const {id, fname, lname, email, password} = req.body;

    console.log(req.body);


    res.send({
        message: "registration successful",
        email:email
    })

});