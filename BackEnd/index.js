const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const client = require('./conn');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

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

    //console.log(req.body);

    const getHash = "SELECT * FROM students WHERE id ='"+id+"'";
    
    client.query(getHash, (err,results) =>{
        if(err){
            console.error('Error executing query:', err);
        } else{
            //console.log(result.rows[0].password);
            hash = results.rows[0].password;

            bcrypt.compare(password, hash, function(err, result) {
                if (err) {
                    console.log('There was an error with bcrypt', err);
                } else {
                    if (result) {

                        //generate access token
                        const payload ={
                            id: results.rows[0].id,
                            emai: results.rows[0].email
                        }

                        const options = { expiresIn: '5h' };
                        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, options);
                        
                        res.status(200).send({
                            message: "login successful",
                            jwt_token: token
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

function verifyAccessToken(token) {

    const secret = process.env.JWT_SECRET_KEY;
  
    try {
      const decoded = jwt.verify(token, secret);
      return { success: true, data: decoded };
    } 
    catch (error) 
    {
      return { success: false, error: error.message };
    }
}

/**
 * This is the middleware that we will inject on all requests to authenticate
 * the jwt token. The jwt token is returned in the login payload and
 * saved as a cookie on the client side.
 * 
 * If the token is valid, we store the decoded payload in req.user and 
 * proceed with the request. If the token is invalid, we return a 403 
 * Forbidden status with an error message.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns the Data that
 */

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      return res.sendStatus(401);
    }
  
    const result = verifyAccessToken(token);
  
    if (!result.success) { //forbidden
      return res.status(403).json({ error: result.error });
    }
  
    req.user = result.data;
    next(); //the middleware actually forms part of the function that is using it.
}

app.get('/test', async (req, res) => {

    res.status(200).send({
        message: 'KZN',
    })
});

/**
 * sample of user:
 * "user": {
        "id": "u18105883",
        "emai": "theaman249@gmail.com",
        "iat": 1714944075,
        "exp": 1714962075
    }
    The middleware, through verifyAccessToken, actually decrypts the token and returns the original
    values. Which is pretty ne 
*/

app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Welcome to the protected route!', user: req.user });
});

app.get('/getAllUserData',authenticateToken, (req,res) =>{

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

app.post('/getUserData',authenticateToken,async (req,res)=>{

    const {id} = req.body;

    const getUserDataQuery = "SELECT * FROM students WHERE id ='"+id+"'";

    client.query(getUserDataQuery, (err, result) =>{

        if(err){
            res.status(500).send({
                message: "unable to get user data"
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

    
})