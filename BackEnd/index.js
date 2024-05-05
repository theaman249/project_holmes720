const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const client = require('./conn');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
const port = 3000;

dotenv.config({path: '.env'})

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

    const {id, fname, lname, email, password, year_of_study, role} = req.body;

    console.log(req.body);

    const alreadyExist = "SELECT id FROM students WHERE id ='"+id+"'";

    client.query(alreadyExist, (err,result)=>{
        if(err){
            console.log('There was an error with an existing user', err)
        } else{

            if(result.rows.length > 0){
                res.send({
                    message: "user already exists",
                })
            }
            else{
                bcrypt.hash(password, saltRounds, function(err, hash) {
                if(err){
                    console.log('There was an error with bcrypt', err);
                } else{
                    // Store hash in your password DB.
                    const query = "INSERT INTO students (id, fname, lname, email, password,year_of_study,role) VALUES ('" +
                    id + "', '" + fname + "', '" + lname + "', '" + email + "', '" + hash + "', '"+parseInt(year_of_study)+"','"+role+"')";

                    client.query(query,(err, result)=>{
                        if (err) {
                            console.error('Error executing query:', err);
                        } else {
                            console.log('Register executed successfully.');
                            console.log('Inserted rows:', result.rowCount);

                            res.send({
                                message: "registration successful",
                            })
                        }
                    });     
                }
                });
            }
        }
    })

    

    

});

app.post('/login', (req, res) =>{

    const {id, password} = req.body;
    var hash = "";

    console.log(req.body);

    const getHash = "SELECT password FROM students WHERE id ='"+id+"'";
    
    client.query(getHash, (err,result) =>{
        if(err){
            console.error('Error executing query:', err);
        } else{
            //console.log(result.rows[0].password);
            hash = result.rows[0].password;

            bcrypt.compare(password, hash, function(err, result) {
                if (err) {
                    console.log('There was an error with bcrypt', err);
                } else {
                    if (result) {
                       res.status(200).send({
                        message: "login successful",
                       });
                    } 
                    else {
                        res.status(401).send({
                            message: "login unsuccessful",
                        });
                    }
                }
            });
        }
    }); 
});

app.get('/test', async (req, res) => {

    console.log(process.env.JWT_SECRET_KEY);

    res.status(200).send({
        message: 'KZN',
    })
});

app.get('/test', async (req, res) => {

    console.log(process.env.JWT_SECRET_KEY);

    res.status(200).send({
        message: 'KZN',
    })
});

app.get('/getAllUserData', (req,res) =>{

    const getAllUsersDataQuery = "SELECT * FROM students";

    client.query(getAllUsersDataQuery, (err, result) =>{

        if(err){
            res.status(500).send({
                message: "unable to get all user data"
            })
        }
        else{

            var arr_return = [];

            for(let i=0;i<result.rows.length;++i){

                var obj = {
                    id: result.rows[i].id,
                    name: result.rows[i].fname,
                    surname: result.rows[i].lname,
                    email: result.rows[i].email,
                    year_of_study: result.rows[i].year_of_study,
                    role: result.rows[i].role
                }

                arr_return.push(obj);

            }

            res.status(200).send({
                data: arr_return
            })
        }
    })

});

app.get('/getUserData', async (req,res)=>{

    

    const getUserDataQuery = ""
})