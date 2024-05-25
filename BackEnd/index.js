const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const client = require('./conn');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const axios = require('axios');

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
                            email: results.rows[0].email,
                            role: results.rows[0].role
                        }

                        const options = { expiresIn: '5h' };
                        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, options);
                        
                        res.status(200).send({
                            message: "login successful",
                            jwt_token: token,
                            payload: payload
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

app.post('/getModulesForAYear', authenticateToken ,(req, res) =>{

    const {year_of_study} = req.body;

    const getModulesForAYearQuery = `SELECT * FROM modules WHERE year_of_study = ${year_of_study}`;

    client.query(getModulesForAYearQuery, (err,result) =>{
        if(err){
            res.status(500).send({
                message: "unable to get module data"
            })
        }
        else{
            var arr_return = [];

            for(let i=0;i<result.rows.length;++i){

                var obj = {
                    id: result.rows[i].id,
                    name: result.rows[i].name,
                    year_of_study: result.rows[i].year_of_study,
                    semester: result.rows[i].semester
                }

                arr_return.push(obj);

            }

            res.status(200).send({
                data: arr_return
            })
        }
    })

});

app.post('/registerModules', authenticateToken, async (req, res) =>{
    const {id, arr_modules} = req.body;
    const user = req.user; // Get user data from the request object
    const promises = [];

    let arr_clearedModulesForRegistration = [];

    //console.log(req.body);

    try {
        const { rows } = await client.query(`
        SELECT 
            m.name AS module_name, 
            m.id AS module_id,
            m.year_of_study,
            m.semester
        FROM 
            students_modules sm
        INNER JOIN 
            modules m ON sm.module_id = m.id
        WHERE 
            sm.student_id = $1;
    `, [id])
    
    if (rows.length > 0) {
        const data = rows.map(row => ({
            id: row.module_id,
            name: row.module_name,
            semester: row.semester,
            year_of_study: row.year_of_study,
        }));

        console.log(data);

        for(let i =0;i<data.length;++i){

            let found = false;

            for(let k=0;k<arr_modules.length;++k)
            {
                if(arr_modules[k] === data[i].id){ //user is already registered for the module
                    found = true;
                    break;
                }
                
                if(found === false){
                    arr_clearedModulesForRegistration.push(arr_modules[k]);
                }
            }
        }

        //console.log(arr_clearedModulesForRegistration);

        //link the module to the student.

        for (let i = 0; i < arr_clearedModulesForRegistration.length; ++i) {
            //console.log(i);
            const registerModulesQuery = `INSERT INTO students_modules(student_id,module_id) VALUES('${id}','${arr_clearedModulesForRegistration[i]}')`;
            // Push each query promise to the array
            promises.push(new Promise((resolve, reject) => {
                client.query(registerModulesQuery, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            }));
        }
    
        // Wait for all promises to resolve
        Promise.all(promises)
            .then(() => {
                res.status(200).send({
                    id: id,
                    message: "successfully deregistered student"
                });
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send({
                    message: "unable to execute query"
                });
            });



    } else {
        res.status(404).send({
            message: "No modules found for the given student ID"
        });
    }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "query execution failed"
        });
    }

    
    
});

app.post('/deregisterModules', authenticateToken, (req, res) => {
    const { id, arr_modules } = req.body;

    //console.log(req.body);
    //console.log(arr_modules.length);

    // Array to hold all promises
    const promises = [];

    for (let i = 0; i < arr_modules.length; ++i) {
        //console.log(i);
        const deregisterModulesQuery = `DELETE FROM students_modules WHERE student_id = '${id}' AND module_id = '${arr_modules[i]}' `;
        // Push each query promise to the array
        promises.push(new Promise((resolve, reject) => {
            client.query(deregisterModulesQuery, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        }));
    }

    // Wait for all promises to resolve
    Promise.all(promises)
        .then(() => {
            res.status(200).send({
                id: id,
                message: "successfully deregistered student"
            });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send({
                message: "unable to execute query"
            });
        });
});


app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Welcome to the protected route!', user: req.user });
});


app.get('/getAllUserData',authenticateToken, (req,res) =>{

    const getAllUsersDataQuery = "SELECT * FROM students";

    client.query(getAllUsersDataQuery, (err, result) =>{

        if(err){
            res.status(500).send({
                message: "unable to execute query"
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

app.post('/getModulesUserTakes', authenticateToken, async(req,res) =>{
    const { id } = req.body;

    try {
        const { rows } = await client.query(`
        SELECT 
            m.name AS module_name, 
            m.id AS module_id,
            m.year_of_study,
            m.semester
        FROM 
            students_modules sm
        INNER JOIN 
            modules m ON sm.module_id = m.id
        WHERE 
            sm.student_id = $1;
    `, [id]);
    
    if (rows.length > 0) {
        const arr_return = rows.map(row => ({
            id: row.module_id,
            name: row.module_name,
            semester: row.semester,
            year_of_study: row.year_of_study,
        }));

        res.status(200).send({
            data: arr_return
        });
    } else {
        res.status(404).send({
            message: "No modules found for the given student ID"
        });
    }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "Unable to get module data"
        });
    }
})

app.post('/getModuleDetail', authenticateToken, async (req, res) =>{
    const {id} = req.body;

    const getModuleQuery = "SELECT * FROM modules WHERE id ='"+id+"'";

    client.query(getModuleQuery, (err, result) =>{

        if(err){
            res.status(500).send({
                message: "unable to get module data"
            })
        }
        else{

            var arr_return = [];

            for(let i=0;i<result.rows.length;++i){

                var obj = {
                    id: result.rows[i].id,
                    name: result.rows[i].name,
                    year_of_study: result.rows[i].year_of_study,
                    semester: result.rows[i].semester
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

