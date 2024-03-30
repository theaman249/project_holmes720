const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

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