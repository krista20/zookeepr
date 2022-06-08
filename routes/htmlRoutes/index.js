const path = require('path');
const router = require('express').Router();

// Getting index.html to be served from our Express.js server, by adding this route
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// Getting animals.html to be served from our Express.js server, by adding this route
router.get('/animals', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/animals.html'));
});

// Getting zookeepers.html to be served from our Express.js server, by adding this route
router.get('/zookeepers', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});

// Getting wildcard route
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

module.exports = router;