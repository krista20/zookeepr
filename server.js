// to start Express.js:
    const express = require('express');
    //telling app to use this port
    const PORT = process.env.PORT || 3001;
    // to instantiate the server
    const app = express();
// importing data to use fs library to write data to animals.json
const fs = require('fs');
//  This is another module built into the Node.js API that provides utilities for working with file and directory paths
const path = require('path');

// middleware to connect to script & css links from out HTML homepage
app.use(express.static('public'));

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());




    // filter function
    function filterByQuery(query, animalsArray) {
        let personalityTraitsArray = [];
        // Note that we save the animalsArray as filteredResults here:
        let filteredResults = animalsArray;
        if (query.personalityTraits) {
          // Save personalityTraits as a dedicated array.
          // If personalityTraits is a string, place it into a new array and save.
          if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
          } else {
            personalityTraitsArray = query.personalityTraits;
          }
          // Loop through each trait in the personalityTraits array:
          personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array.
            // Remember, it is initially a copy of the animalsArray,
            // but here we're updating it for each trait in the .forEach() loop.
            // For each trait being targeted by the filter, the filteredResults
            // array will then contain only the entries that contain the trait,
            // so at the end we'll have an array of animals that have every one 
            // of the traits when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(
              animal => animal.personalityTraits.indexOf(trait) !== -1
            );
          });
        }
        if (query.diet) {
          filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
        }
        if (query.species) {
          filteredResults = filteredResults.filter(animal => animal.species === query.species);
        }
        if (query.name) {
          filteredResults = filteredResults.filter(animal => animal.name === query.name);
        }
        // return the filtered results:
        return filteredResults;
      }


      //finding animal by unique id
      function findById(id, animalsArray) {
          const result = animalsArray.filter(animal => animal.id === id)[0];
          return result;
      };

// create a separate function to handle taking the data from req.body and adding it to our animals.json file.
function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(
        //We want to write to our animals.json file in the data subdirectory, so we use the method path.join() to join the value of __dirname,
        //which represents the directory of the file we execute the code in, with the path to the animals.json file.
        path.join(__dirname, './data/animals.json'),
        //we need to save the JavaScript array data as JSON, so we use JSON.stringify() to convert it. 
        //null and 2, are means of keeping our data formatted:
            //null argument means we don't want to edit any of our existing data
            // 2 indicates we want to create white space between our values to make it more readable.
        JSON.stringify({ animals: animalsArray }, null, 2)
    );
    // console.log(body);
    //return finished code to post route for response
    return animal;
}

// pay attention to order of routes; A param route must come after the other GET route.
    // adding to route
    app.get('/api/animals', (req, res) => {
        // accessing the query property on the req object
        let results = animals;
        if(req.query) {
            results = filterByQuery(req.query, results);
        }
        res.json(results);
    });

// GET route for animals
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
    res.json(result);
  }  else {
      res.send(404);
  }
});


// route that accepts data to be used or stored server-side
// (2nd way of how data gets stored on server): 
    // Users of the app populate the server with data by sending data from the client side of the application to the server.
app.post('/api/animals', (req, res) => {
    // req.body is where our incoming content will be
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();
    // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {
        // add animal to json file and animals array in this function
    const animal = createNewAnimal(req.body, animals);
     res.json(animal);
    }
});


// Getting index.html to be served from our Express.js server, by adding this route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Getting animals.html to be served from our Express.js server, by adding this route
app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

// Getting zookeepers.html to be served from our Express.js server, by adding this route
app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

// Getting wildcard route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});


// to make server listen
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

// creates a route that the front end can request data from
const { animals } = require('./data/animals');


// validate our data
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
}
