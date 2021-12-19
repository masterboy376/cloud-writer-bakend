const connectToMongo = require('./db');
const express = require('express');
const app = express();
const port = 3000;


// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('hello world')
  connectToMongo();
})

app.listen(port, ()=>{
    console.log(`http://localhost:${port}`);
})