var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8000;

var express = require('express');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var WebSocket = require('ws').Server;
var fs = require('fs');
var http = require('http');
var path = require('path');
var mysql = require('mysql');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var connectEnsureLogin = require('connect-ensure-login');
var configAuth = require('./server/config/auth.js');

var server = null;
var app = null;

var MysqlConnection = require('./server/classes/mysql.class.js');
var Player = require('./server/classes/player.class.js');
var Map = require('./server/classes/map.class.js');
var Character = require('./server/classes/character.class.js');

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
    configPassport();
    configExpress();

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

    fs.readFile(__dirname + '/server/maps/map.json', function(err, json){
        mapJson = JSON.parse(json.toString());
        map.setup(mapJson, mysqlConn);
    });
}

function startHttpServer(){
    /**
     * Config http server
     */
    server = http.createServer(app);

    server.listen(port, ipaddress, function(){
        console.log((new Date()) + " Server started: " + ipaddress + ":" + port);
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
                        player.loadPlayer(ws, data.provider, data.socialID);
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

function configPassport(){
    passport.use(new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL
    },
    function(accessToken, refreshToken, profile, cb) {
        // In this example, the user's Facebook profile is supplied as the user
        // record.  In a production-quality application, the Facebook profile should
        // be associated with a user record in the application's database, which
        // allows for account linking and authentication with other identity
        // providers.
        return cb(null, profile);
    }));

    passport.serializeUser(function(user, cb) {
        cb(null, user);
    });

    passport.deserializeUser(function(obj, cb) {
        cb(null, obj);
    });
}

function configExpress(){
    app = express();

    // Configure view
    app.set('views', __dirname + '/client');
    app.set('view engine', 'ejs');

    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
    
    app.use(passport.initialize());
    app.use(passport.session());

    //app.use(express.compress());
    app.use(express.static(__dirname + '/client'));

    configRoutes();
}

function configRoutes(){
    app.get("/", function(req, res){
        res.redirect("/login")
    });

    app.get("/game", function(req, res){
        res.render("index", {user: req.user});
    });

    app.get('/login', function(req, res){
        res.render('login');
    });

    app.get('/auth/facebook', passport.authenticate('facebook'));

    app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }),
        function(req, res) {
            res.redirect('/game');
        }
    );

    app.get('/profile', connectEnsureLogin.ensureLoggedIn(),
        function(req, res){
            res.render('profile', { user: req.user });
        }
    );
}