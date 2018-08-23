var db = require("../models");

module.exports = function (app) {
    //GET route to return ALL handles
    app.get("/api/handles", function (req, res) {
        db.Handles.findAll({}).then(function(dbHandles){
            res.json(dbHandles);
        });
    });

    // This get call will retrieve a handles JSON data
    app.get("/api/handles/:handleName", function (req, res) {
        const handleName = req.params.handleName;
        db.Handles.findOne({
            where: {
                handleName: handleName,
            },
            include: [{
                model: db.UsersHandles,
                include: db.UserDetails
            }]
        }).then(function (dbHandle) {
            res.json(dbHandle);


        });
    });

    // POST route to add a new handle if it doesn't exist
    app.post("/api/handles", function (req, res) {
        const newHandleName = req.body.handleName;
        db.findOne({
            where: {
                handleName: newHandleName
            }
        }).then(function (dbHandle) {
            if (!dbHandle) {
                db.Handles.create({
                    handleName: newHandleName
                }).then(function (dbHandle) {
                    res.json("New handle, " + dbHandle.handleName + " created. ");
                });
            }
            else {
                res.json(dbHandle.handleName + " already exists. ");
            }
        });
    });

    //PUT route to update tweets
    app.put("/api/handles", function (req, res) {
        db.Handles.update(
            req.body,
            {
                where: {
                    id: req.body.id
                }
            }).then(function (dbHandles) {
                res.json(dbHandles);
            });
    });
};