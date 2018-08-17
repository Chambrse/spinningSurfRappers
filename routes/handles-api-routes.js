var db = require("../models");
 module.exports = function(app){
     //GET route for all the posts
     app.get("/api/handles", function(req, res){
        var query ={};
        if(req.query.author_id){
            query.HandlesId = req.query.handles_id;
        } 
        db.UserDetails.findAll({
            where: query,
            include:[db.Handles]
        }).then(function(dbHandles){
            res.json(dbHandles);
        });
 });
 // GET route to retrieve a single tweet
 app.get("/api/handles/:id", function(req, res){
     db.Handles.findOne({
        where:{
            id:req.params.id,
        } 
     }).then(function(dbHandles){
         res.json(dbHandles);
     });
 });
 //PUT route to update tweets
 app.put("/api/handles", function(req, res){
     db.Handles.update(
         req.body,
         {
             where: {
                 id: req.body.id
             }
         }).then(function(dbHandles){
             res.json(dbHandles);
         });
 });
};