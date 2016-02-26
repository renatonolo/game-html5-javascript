var WebSocket = require('ws').Server,
    wss = new WebSocket({port: 9000}),
    fs = require('fs'),
    mysql = require('mysql'),
    MysqlConnection = require('./classes/mysql.class.js'),
    Player = require('./classes/player.class.js'),
    Map = require('./classes/map.class.js');

var mysqlClass = null,
    player = null,
    mapJson = null,
    tilesets = null;

setupServer();

wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(message) {
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
                    console.log(data);
                    map.checkTileInfo(ws, data.account, data.x, data.y);
                    break;
                case "sendPosition":
                    player.updatePosition(data.account, data.position.x, data.position.y);
            }
        }
    });

});

function setupServer(){

    var mysqlConn = new MysqlConnection();
    mysqlConn.mysql = mysql;
    mysqlConn.connect("127.0.0.1", "3306", "root", "159357", "gameHTML5");

    player = new Player();
    player.setup(mysqlConn);

    map = new Map();

    fs.readFile(__dirname + '/maps/map.json', function(err, json){
        mapJson = JSON.parse(json.toString());
        map.setup(mapJson, mysqlConn);
    });
}