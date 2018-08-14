var express = require('express');
var db = require("../models");
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('underConstruction');
});


// Test the sequelize mysql connection. Should display json of the test database items.
router.get('/test', function (req, res, next) {
  db.testTable.findAll().then(function (data) {
    console.log(data);
    res.json(data);
  });
});

module.exports = router;
