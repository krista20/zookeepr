// to start Express.js:
    const express = require('express');
    //telling app to use this port
    const PORT = process.env.PORT || 3001;
    // to instantiate the server
    const app = express();

// The require() statements will read the index.js files in each of the directories indicated. 
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');


// middleware to connect to script & css links from out HTML homepage
app.use(express.static('public'));

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

// This is our way of telling the server that any time a client navigates to <ourhost>/api, the app will use the router we set up in apiRoutes.
//If / is the endpoint, then the router will serve back our HTML routes. 
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);


// to make server listen
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

// creates a route that the front end can request data from
const { animals } = require('./data/animals');