// var cors = require('cors'),
// express = require('express'),
// tweetRouter = express.Router(),
// mysql = require('mysql');

// tweetRouter.all('*', cors());
// var getTweets = function(){
//     tweetRouter.route('/')
//     .get(function(req,res){
//         connection.query('SELECT * from handles', req.params.id, function(err, rows, fields){
//             if (err){
//                 console.log(err);
//                 res.statusCode = 500;
//                 res.send({
//                     result: 'error',
//                     err: err.code
//                 });
//             }
//             res.send(rows);
//         });
//     });
//     return tweetRouter;
// };
// module.exports = {
//     getTweets: getTweets
// };