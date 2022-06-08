const router = require('express').Router();

const { filterByQuery, findById, createNewAnimal, validateAnimal, } = require('../../lib/animals');
const { animals } = require('../../data/animals');


// pay attention to order of routes; A param route must come after the other GET route.
    // adding to route
    router.get('/animals', (req, res) => {
        // accessing the query property on the req object
        let results = animals;
        if(req.query) {
            results = filterByQuery(req.query, results);
        }
        res.json(results);
    });


// GET route for animals
router.get('/animals/:id', (req, res) => {
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
    router.post('/animals', (req, res) => {
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

    module.exports = router;

