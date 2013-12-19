        // HTTP Portion
var http = require('http');
var fs = require('fs'); // Using the filesystem module
var httpServer = http.createServer(requestHandler);
var path = require('path');

var HTTP_OK = 200,
    HTTP_ERR_UNKNOWN = 500,
    HTTP_ERR_NOT_FOUND = 404;

httpServer.listen(8080);

function requestHandler(req, res) {
    var filepath =  (req.url == '/' ? 'index.html' : '.' +req.url) ,
        fileext = path.extname(filepath); 

    console.log("Request for " + filepath+ " received.");
    fs.exists(filepath, function (f) {
        if (f) {
            fs.readFile(filepath, function (err, content) {
                if (err) {
                    res.writeHead(HTTP_ERR_UNKNOWN);
                    console.log('????');
                    res.end();
                } else {
                    res.writeHead(HTTP_OK, contentType(fileext));
                        console.log('seems ok');
                    res.end(content);
                }
            });
        } else {
            console.log('File not found');
            res.writeHead(HTTP_ERR_NOT_FOUND);
            res.end();
        }
    });
}

function contentType(ext) {
    var ct;

    switch (ext) {
    case '.html':
        ct = 'text/html';
        break;
    case '.css':
        ct = 'text/css';
        break;
    case '.js':
        ct = 'text/javascript';
        break;
    case '.jpg':
        ct = 'image/jpeg';   
    case '.png':
        ct = 'image/png';           
    default:
        ct = 'text/plain';
        break;
    }

    return {'Content-Type': ct};
}

var io = require('socket.io').listen(httpServer);

var inc = 0;
var switch2 = false;
var point1x;
var point1y;
var point2x;
var point2y;

var players = new Array();
var displaySocket = null;

//var users = new Array();

io.sockets.on('connection', function (socket) {
        // We are given a websocket object in our function
		var playerId = null;

		//from pixel play	 
        if (displaySocket === null) {
                console.log('Setting displaySocket');
                displaySocket = socket.id;
                io.sockets.emit('players', {id: displaySocket, type: "display"});
                console.log('displaySocket has been set:' + displaySocket);
        }
        else if (displaySocket !== null) {
                console.log("We have a new player joining: " + socket.id);
                
                //////////
                // interacting with serverplayer
                // ---------------------------
                // - only needs id.
                // - sends things through updateUserTouch from mobUserPosition
                var player = { "id": socket.id };

                players.push(player);
                console.log("players array", players);
                console.log("I'm about to emit createPlayer");
                io.sockets.emit('createPlayer', player);
                socket.emit('createMyself', player);
                console.log("createMyself sent with socket.id");
                io.sockets.emit('players', players);
        }
	

    socket.on('playerConnect', function (data) {
        //console.log(data);
        //var playerNumber = data.id;
        //this is sending
        console.log("createPlayer RECEIVEDDDDDDD");        
    });
    
    // When this user emits, client side: socket.emit('otherevent',some data);
    socket.on('mobUserPosition', function(playerData) {
        // Data comes in as whatever was sent, including objects
        console.log("Received: 'mobUserPosition is' " + playerData.x + " " + playerData.y + " " + playerData.id);
        //socket.broadcast.emit('othermouse', data);
        for (var i = 0; i < players.length; i++) {
            if(players[i].id == playerData.id){
                console.log( "I'm in mobUserPosition and I found the player");
                var x = (playerData.curX - playerData.prevX);
                var y = (playerData.curY - playerData.prevY);
                var l = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
                var dx = x / l;
                var dy = y / l;
                console.log("I'm about to emit calcTouch from server");
                console.log(playerData);
                socket.broadcast.emit('updateUserTouch', {"l": l, "dx": dx, "dy": dy, "id": players[i].id});
            }
            //.magnitude 
             //this should send the "l" vector to the index page
        }
    });
    
    socket.on('disconnect', function() {
        console.log("Client has disconnected " + socket.id);
        io.sockets.emit('leave', {socketId: socket.id, id: playerId});
        //players.splice(playerId, 1);
        console.log("removing player ID: " + playerId);
    });
});