var WebSocket = require('ws').Server,
    wss = new WebSocket({port: 9000}),
    fs = require('fs');

var mapJson = null,
    tilesets = null;

setupServer();

wss.on('connection', function connection(ws) {
  
    ws.on('message', function incoming(message) {
        var data = JSON.parse(message);
        if(typeof data === "object" && data.action != undefined){
            switch(data.action){
                case "loadMap":
                    loadMap(ws, data.x, data.y);
                    break;
                case "loadPlayer":
                    loadPlayer(ws, data.account, data.password);
                    break;
                case "checkTileInfo":
                    checkTileInfo(ws, data.x, data.y);
                    break;
            }
        }
    });

});

function setupServer(){
    fs.readFile(__dirname + '/maps/map.json', function(err, json){
        mapJson = JSON.parse(json.toString());
        tilesets = loadTileSets();
    });
}

function loadMap(ws, x, y){
    if(x > mapJson.width || y > mapJson.height || x < 0 || y < 0) {
        var response = {
            action: "mapResponse",
            status: 1, // Error
            message: "Invalid position"
        };
    } else {
        var tiles = loadTilesRange(x, y);
        var response = {
            action: "mapResponse",
            status: 0, // Success
            data: tiles
        };
        //console.log(JSON.stringify(response));
    }

    ws.send(JSON.stringify(response));
}

function loadTilesRange(_x, _y){
    var layers = {},
        c = 0;

    layers.map = [];
    layers.tilesets = tilesets;

    /**
     * Tiles to count before and after from center
     * Add +1 to exced the canvas on client... 
     * It is because when the player is walking, we need to have a buffer to load map...
     */
    var tilesBeforeX = 11, //11 + 1
        tilesBeforeY = 6, //6 + 1
        tilesAfterX = 13, //13 + 1
        tilesAfterY = 8; //7 + 1


    for(var i = 0; i < mapJson.layers.length; i++){
        layers.map[i] = [];
    }
    
    var pos = 0;

    var initX = _x - tilesBeforeX;
    var endX = _x + tilesAfterX;
    if(initX <= 0) initX = 1;
    if(initX > mapJson.width) initX = mapJson.width;

    var initY = _y - tilesBeforeY;
    var endY = _y + tilesAfterY;
    if(initY <= 0) initY = 1;
    if(initY > mapJson.height) initY = mapJson.height;

    for(var y = initY; y <= endY; y++){
        for(var x = initX; x <= endX; x++){
            for(var l = 0; l < layers.map.length; l++){
                pos = (y * mapJson.width) - mapJson.width + x;
                layers.map[l][c] = mapJson.layers[l].data[(pos-1)];
            }
            c++;
        }
    }

    return layers;
}

function loadTileSets(){
    var dataTiles = [],
        auxTilesets,
        auxTiles,
        auxColision,
        auxTilePos,
        c = 0,
        col = 0,
        imgTile = "";

    for(var t = 0; t < mapJson.tilesets.length; t++){
        auxTilesets = mapJson.tilesets[t];
        dataTiles[t] = {};
        dataTiles[t].animation = [];

        imgTile = mapJson.tilesets[t].image.split("/");
        imgTile = imgTile[imgTile.length-1];
        dataTiles[t].imgTile = imgTile;
        dataTiles[t].firstgid = mapJson.tilesets[t].firstgid;
        dataTiles[t].collision = [];
        
        for(auxTiles in auxTilesets.tiles){
            if(auxTilesets.tiles[auxTiles].animation != undefined){
                auxTilePos = parseInt(auxTiles) + parseInt(auxTilesets.firstgid);

                dataTiles[t].animation[c] = {};
                dataTiles[t].animation[c].tile = auxTilePos;
                dataTiles[t].animation[c].animation = [];
                for(var a = 0; a < auxTilesets.tiles[auxTiles].animation.length; a++){
                    dataTiles[t].animation[c].animation[a] = {};
                    dataTiles[t].animation[c].animation[a].tileid = parseInt(auxTilesets.tiles[auxTiles].animation[a].tileid) + 1;
                    dataTiles[t].animation[c].animation[a].duration = auxTilesets.tiles[auxTiles].animation[a].duration;
                }

                c++;
            }
        }

        for(auxColision in auxTilesets.tileproperties){
            if(auxTilesets.tileproperties[auxColision].collision){
                dataTiles[t].collision[col] = auxColision;
                col++;
            }
        }
    }
    //console.log(dataTiles);
    return dataTiles;
}

function checkTileInfo(ws, x, y){
    var collision = getCollision(x, y);
    var tileId = collision.lastId;

    var tileInfo = {
        lastId: collision.lastId,
        firstId: collision.firstId,
        collision: collision.collision,
        x: x,
        y: y,
        //way: ["east", "east", "east", "east", "east", "east", "east", "east", "east", "east", "east", "east", "east"]
        way: ["west", "west", "west", "west", "west", "west", "west", "west", "west", "west", "west", "west", "west"]
        //way: ["north", "north", "north", "north", "north", "north", "north", "north"]
        //way: ["south", "south", "south", "south", "south", "south", "south", "south"]
    };

    var response = {
        action: "checkTileInfoResponse",
        data: tileInfo
    };

    ws.send(JSON.stringify(response));
}

function getCollision(x, y){
    var pos = ((y + 1) * mapJson.width) - mapJson.width + x + 1;
    var collision = false;
    var tileId = 0;

    for(var i = 0; i < mapJson.layers.length; i++){
        if(mapJson.layers[i].data[(pos-1)] != 0){
            tileId = mapJson.layers[i].data[(pos-1)];
            
            for(var j = 0; j < tilesets.length; j++){
                for(var k = 0; k < tilesets[j].collision.length; k++){
                    if((parseInt(tilesets[j].collision[k]) + tilesets[j].firstgid) == mapJson.layers[i].data[(pos-1)]){
                        collision = true;
                    }
                }
            }
        }
    }

    tile = {};
    tile.firstId = mapJson.layers[0].data[(pos-1)];
    tile.lastId = tileId;
    tile.collision = collision;
    return tile;
}

function loadPlayer(ws, account, password){
    var player = {
        name: "Rnl Rula",
        level: 1,
        sex: 1, //0 = female, 1 = male
        vocation: 0, //0 for beginner
        skills: {
            melee: 1,
            sword: 1,
            shield: 1
        },
        equips: {
            helmet: 0,
            armor: 0,
            legs: 0,
            boots: 0,
            leftHand: 0,
            rightHand: 0
        },
        position: {
            x: 51,
            y: 49
        }
    };
    var response = {
        action: "loadPlayerResponse",
        data: player
    };
    ws.send(JSON.stringify(response));
}