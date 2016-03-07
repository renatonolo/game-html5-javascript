var Facebook = require('facebook-node-sdk');

var express = require('express');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var uuid = require('node-uuid');

var WebSocket = require('ws').Server;
var fs = require('fs');
var http = require('http');
var path = require('path');
var mysql = require('mysql');

var configs = require('./server/configs.js');
var gameRoute = require('./server/routes/game.js');

var server = null;
var app = null;

var MysqlConnection = require('./server/classes/mysql.class.js');
var Player = require('./server/classes/player.class.js');
var Map = require('./server/classes/map.class.js');
var Character = require('./server/classes/character.class.js');
var Account = require('./server/classes/account.class.js');

var accessToken = null;
var clients = [];
var mysqlClass = null;
var account = null;
var player = null;
var character = null;
var mapJson = null;
var tilesets = null;

setupServer();


/**
 * Setup Server
 */
function setupServer(){

    configExpress();
    startHttpServer();
    startWebsocketServer();

    var mysqlConn = new MysqlConnection();
    mysqlConn.mysql = mysql;
    mysqlConn.connect(configs.mysql.host, configs.mysql.port, configs.mysql.username, configs.mysql.password, configs.mysql.database);

    player = new Player();
    player.setup(mysqlConn, uuid);

    account = new Account();
    account.setup(mysqlConn, uuid);

    character = new Character();
    character.setup(mysqlConn, wss);

    map = new Map();

    configRoutes();

    fs.readFile(configs.server.mapsPath, function(err, json){
        mapJson = JSON.parse(json.toString());
        map.setup(mapJson, mysqlConn);
    });
}

function startHttpServer(){
    /**
     * Config http server
     */
    server = http.createServer(app);

    server.listen(configs.server.port, configs.server.ipaddress, function(){
        console.log((new Date()) + " Server started: " + configs.server.ipaddress + ":" + configs.server.port);
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
                        player.loadPlayer(ws, data.player);
                        break;
                    case "checkTileInfo":
                        map.checkTileInfo(ws, data.uid, data.x, data.y);
                        break;
                    case "sendPosition":
                        player.updatePosition(data.uid, data.position.x, data.position.y, data.walking, data.direction);
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

function configFacebook(req){
    facebook.options({
        appId: configs.facebookAuth.clientID,
        appSecret: configs.facebookAuth.clientSecret,
        redirectUri: configs.facebookAuth.callbackURL
    });

    return req.session.access_token;
}

function configExpress(){
    app = express();

    // Configure view
    app.set('views', __dirname + '/client');
    app.set('view engine', 'ejs');

    app.use(morgan('dev'));
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(expressSession({ secret: 'keyboard cat'}));
    app.use(Facebook.middleware({ appId: configs.facebookAuth.clientID, secret: configs.facebookAuth.clientSecret }));
    
    //app.use(express.compress());
    app.use(express.static(__dirname + '/client'));
}

function configRoutes(){
    app.get("/",  function(req, res){
        res.render('login');
    });

    app.get("/status/:status",  function(req, res){
        res.render('login', {status: req.params.status});
    });

    app.get("/login", Facebook.loginRequired({scope: 'email'}), gameRoute.login);

    app.get("/game", function(req, res){
        gameRoute.game(account, req, res);
    });

    app.get("/start/:accountUid", 
        function(req, res, next){
            return player.getByAccount(req, res, next);
        },
        function(req, res, next){
            return gameRoute.renderStart(req, res);
        }
    );

    app.get("/create/:facebookID", gameRoute.create);

    app.post("/create", 
        function(req, res, next){
            return account.get(req, res, next);
        }, 
        function(req, res, next){
            return account.insert(req, res, next);
        }, 
        function(req, res, next){
            return player.insert(req, res, next);
        }, 
        function(req, res, next){
            return player.associateWithAccount(req, res, next);
        }, function(req, res, next){
            return gameRoute.renderCreate(req, res, next);
        });
}