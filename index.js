
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var mongodb = require("mongodb").MongoClient;
var ObjectID = mongodb.ObjectID;

var db;
var collection;

app.use(bodyParser.json());

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});


mongodb.connect("mongodb://yasin:crushinto123_@ds117109.mlab.com:17109/chatdb", function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  db = database;
  console.log("Database connection ready");


});


  http.listen(3000, function(){
  console.log('listening on *:3000');
});


io.on('connection', function(socket){

    console.log("one user connected " + socket.id);
    socket.on('new message', function(data){
    	console.log(data);
        io.emit('new message', data);

        collection.insert( {content:data} , function(err, o) {
        if (err) { console.warn(err.message); }
        else  console.log("chat message inserted into db: " + data);
      });
    
  });

	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
		console.log(msg);

        collection = db.collection('chat messages');
        collection.insert( {content:msg} , function(err, o) {
        if (err) { console.warn(err.message); }
        else  console.log("chat message inserted into db: " + msg);
      });
	});

     

	

});

