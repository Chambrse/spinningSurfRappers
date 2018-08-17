var express = require('express');
var db = require("../models");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

app.get("/api/handles", function(req, res){
  db.UserDetails.findAll({
      include: [db.handles]
  }).then(function(dbUserDetails){
      res.json(dbUserDetails);
  });
});
app.get("/api/")
module.exports = router;
