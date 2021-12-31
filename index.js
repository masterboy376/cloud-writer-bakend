const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

connectToMongo();

//cors funtionality
app.use(cors());

//send req to the body by this middleware
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, ()=>{
    console.log(`http://localhost:${port}`);
})