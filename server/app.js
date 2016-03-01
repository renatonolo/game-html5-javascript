var WebSocket = require('ws').Server,
    wss = new WebSocket({
        host: process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
        port: process.env.OPENSHIFT_NODEJS_PORT || 8080}),
    fs = require('fs'),
    mysql = require('mysql'),
    MysqlConnection = require('./classes/mysql.class.js'),
    Player = require('./classes/player.class.js'),
    Map = require('./classes/map.class.js');
    Character = require('./classes/character.class.js');

var clients = [],
    mysqlClass = null,
    player = null,
    character = null,
    mapJson = null,
    tilesets = null;

setupServer();

wss.on('connection', function connection(ws) {
    clients.push(ws);

    ws.on('message', function incoming(message) {
        console.log(ws);

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

function setupServer(){

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