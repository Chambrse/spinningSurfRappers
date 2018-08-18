var express = require('express');
var db = require("../models");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/api/handles", function(req, res){
  db.UserDetails.findAll({
      include: [db.handles]
  }).then(function(dbUserDetails){
      res.json(dbUserDetails);
  });
});
// router.get("/api/")
module.exports = router;
