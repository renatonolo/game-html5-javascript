var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

var WebSocket = require('ws').Server;
    
var fs = require('fs');
var http = require('http');
var path = require('path');
var server = null;
var mysql = require('mysql');

var MysqlConnection = require('./classes/mysql.class.js');
var Player = require('./classes/player.class.js');
var Map = require('./classes/map.class.js');
var Character = require('./classes/character.class.js');

var clients = [];
var mysqlClass = null;
var player = null;
var character = null;
var mapJson = null;
var tilesets = null;

setupServer();


/**
 * Setup Server
 */
function setupServer(){

    //
    //SERVER SIDE
    //
    startHttpServer();
    startWebsocketServer();
    
    var mysqlConn = new MysqlConnection();
    mysqlConn.mysql = mysql;
    var host = process.env.OPENSHIFT_MYSQL_DB_HOST || "127.0.0.1";
    var port = process.env.OPENSHIFT_MYSQL_DB_PORT || "3306";
    var username = "root";
    var password = "159357";
    var database = "gameHTML5";
    //var username = "admin1Dc4G2u";
    //var password = "HVXQEb8Dv_F8";
    //var database = "gamehtml5";
    mysqlConn.connect(host, port, username, password, database);

    player = new Player();
    player.setup(mysqlConn);

    character = new Character();
    character.setup(mysqlConn, wss);

    map = new Map();

    fs.readFile(__dirname + '/maps/map.json', function(err, json){
        mapJson = JSON.parse(json.toString());
        map.setup(mapJson, mysqlConn);
    });
}

function startHttpServer(){
    server = http.createServer( function(req, res) {

        var now = new Date();

        var filename = req.url || "index.html";
        var ext = path.extname(filename);
        var localPath = __dirname;

        localPath = localPath.replace("/server", "");
        localPath += "/client";

        var validExtensions = {
            ".html" : "text/html",          
            ".js": "application/javascript", 
            ".css": "text/css",
            ".txt": "text/plain",
            ".jpg": "image/jpeg",
            ".gif": "image/gif",
            ".png": "image/png",
            ".ico": "image/ico"
        };

        var isValidExt = validExtensions[ext];

        if (isValidExt) {

            localPath += filename;
            fs.exists(localPath, function(exists) {
                if(exists) {
                    console.log("Serving file: " + localPath);
                    getFile(localPath, res, ext);
                } else {
                    console.log("File not found: " + localPath);
                    res.writeHead(404);
                    res.end();
                }
            });

        } else {
            console.log("Invalid file extension detected: " + ext)
        }
    });

    server.listen(port, ipaddress, function(){
        console.log((new Date()) + " Server started: " + ipaddress + ":" + port);
    });
}

function getFile(localPath, res, mimeType) {
    fs.readFile(localPath, function(err, contents) {
        if(!err) {
            res.setHeader("Content-Length", contents.length);
            res.setHeader("Content-Type", mimeType);
            res.statusCode = 200;
            res.end(contents);
        } else {
            res.writeHead(500);
            res.end();
        }
    });
}

function startWebsocketServer(){
    wss = new WebSocket({
        server: server,
        autoAcceptConnections: false
    });

    wss.on('connection', function connection(ws) {
        clients.push(ws);

        ws.on('message', function incoming(message) {
            //console.log(ws);

            var data = JSON.parse(message);
            if(typeof data === "object" && data.action != undefined){
                switch(data.action){
                    case "loadMap":
                        map.loadMap(ws, data.x, data.y);
                        break;
                    case "loadPlayer":
                        player.loadPlayer(ws, data.account, data.password);
                        break;
                    case "checkTileInfo":
                        map.checkTileInfo(ws, data.account, data.x, data.y);
                        break;
                    case "sendPosition":
                        player.updatePosition(data.account, data.position.x, data.position.y, data.walking, data.direction);
                        character.refreshCharacter(data.uid);
                        break;
                    case "loadCharacters":
                        character.loadCharacters(ws, data.x, data.y);
                        break;
                }
            }
        });
    });

    wss.broadcast = function broadcast(data) {
        wss.clients.forEach(function each(client) {
            client.send(data);
        });
    };
}