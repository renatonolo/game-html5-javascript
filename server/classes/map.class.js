function MapClass(){
    this.ws = null;
    this.mapJson = null;
    this.tilesets = null;
    this.db = null;

    this.setup = function(mapJson, db){
        this.mapJson = mapJson;
        this.tilesets = this.loadTileSets();
        this.db = db;
    };

    this.loadMap = function(ws, x, y){
        this.ws = ws;
        if(x > this.mapJson.width || y > this.mapJson.height || x < 0 || y < 0) {
            var response = {
                action: "mapResponse",
                status: 1, // Error
                message: "Invalid position"
            };
        } else {
            var tiles = this.loadTilesRange(x, y);
            var response = {
                action: "mapResponse",
                status: 0, // Success
                data: tiles
            };
            //console.log(JSON.stringify(response));
        }

        ws.send(JSON.stringify(response));
    };

    this.loadTilesRange = function(_x, _y){
        var layers = {},
        c = 0;

        layers.map = [];
        layers.tilesets = this.tilesets;

        /**
         * Tiles to count before and after from center
         * Add +1 to exced the canvas on client... 
         * It is because when the player is walking, we need to have a buffer to load map...
         */
        var tilesBeforeX = 11, //11 + 1
            tilesBeforeY = 6, //6 + 1
            tilesAfterX = 13, //13 + 1
            tilesAfterY = 8; //7 + 1


        for(var i = 0; i < this.mapJson.layers.length; i++){
            layers.map[i] = [];
        }
        
        var pos = 0;

        var initX = _x - tilesBeforeX;
        var endX = _x + tilesAfterX;
        if(initX <= 0) initX = 1;
        if(initX > this.mapJson.width) initX = this.mapJson.width;

        var initY = _y - tilesBeforeY;
        var endY = _y + tilesAfterY;
        if(initY <= 0) initY = 1;
        if(initY > this.mapJson.height) initY = this.mapJson.height;

        for(var y = initY; y <= endY; y++){
            for(var x = initX; x <= endX; x++){
                for(var l = 0; l < layers.map.length; l++){
                    pos = (y * this.mapJson.width) - this.mapJson.width + x;
                    layers.map[l][c] = this.mapJson.layers[l].data[(pos-1)];
                }
                c++;
            }
        }

        return layers;
    };

    this.loadTileSets = function(){
        var dataTiles = [],
            auxTilesets,
            auxTiles,
            auxColision,
            auxTilePos,
            c = 0,
            col = 0,
            imgTile = "";

        for(var t = 0; t < this.mapJson.tilesets.length; t++){
            auxTilesets = this.mapJson.tilesets[t];
            dataTiles[t] = {};
            dataTiles[t].animation = [];

            imgTile = this.mapJson.tilesets[t].image.split("/");
            imgTile = imgTile[imgTile.length-1];
            dataTiles[t].imgTile = imgTile;
            dataTiles[t].firstgid = this.mapJson.tilesets[t].firstgid;
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
    };

    this.checkTileInfo = function(ws, uid, x, y){
        this.ws = ws;
        console.log(uid);
        this.db.query("SELECT * FROM players WHERE uid = '" + uid + "'", this, this.checkTileInfoCallback, [x, y]);
    };

    this.checkTileInfoCallback = function(ctxMap, rows, args){
        if(rows.length == 1){
            var x = args[0];
            var y = args[1];
            var from = {};
            var to = {};

            from.x = rows[0].position_x;
            from.y = rows[0].position_y;
            to.x = x;
            to.y = y;

            var collision = ctxMap.getCollision(x, y);
            var tileId = collision.lastId;
            var way = ctxMap.getWayToTile(ctxMap, from, to);

            var tileInfo = {
                lastId: collision.lastId,
                firstId: collision.firstId,
                collision: collision.collision,
                x: x,
                y: y,
                way: way
            };

            var response = {
                action: "checkTileInfoResponse",
                data: tileInfo
            };

            ctxMap.ws.send(JSON.stringify(response));
        }
    };

    this.getCollision = function(x, y){
        var pos = ((y + 1) * this.mapJson.width) - this.mapJson.width + x + 1;
        var collision = false;
        var tileId = 0;

        for(var i = 0; i < this.mapJson.layers.length; i++){
            if(this.mapJson.layers[i].data[(pos-1)] != 0){
                tileId = this.mapJson.layers[i].data[(pos-1)];
                
                for(var j = 0; j < this.tilesets.length; j++){
                    for(var k = 0; k < this.tilesets[j].collision.length; k++){
                        if((parseInt(this.tilesets[j].collision[k]) + this.tilesets[j].firstgid) == this.mapJson.layers[i].data[(pos-1)]){
                            collision = true;
                        }
                    }
                }
            }
        }

        tile = {};
        tile.firstId = this.mapJson.layers[0].data[(pos-1)];
        tile.lastId = tileId;
        tile.collision = collision;
        return tile;
    };

    this.getWayToTile = function(ctxMap, from, to){
        var way = ctxMap.getPath(from, to);
        return way;
    };

    this.getPath = function(firstNode, destinationNode){
        var openNodes = [];
        var closedNodes = [];
        var currentNode = firstNode;
        var testNode = {};
        var connectedNodes = [];
        var travelCost = 10;
        var g;
        var h;
        var f;
        currentNode.g = 0;
        currentNode.h = this.heuristic(currentNode, destinationNode, travelCost);
        currentNode.f = currentNode.g + currentNode.h;
        var l = 0;
        var i = 0;

        var collision;

        while(currentNode.x != destinationNode.x || currentNode.y != destinationNode.y){
            connectedNodes = this.getNodesAround(currentNode.x, currentNode.y);
            l = connectedNodes.length;
            for(i = 0; i < l; i++){
                testNode = connectedNodes[i];
                collision = this.getCollision(testNode.x, testNode.y).collision;

                if(collision === true) continue;

                g = currentNode.g + travelCost;
                h = this.heuristic(testNode, destinationNode, travelCost);
                f = g + h;

                if(this.inList(openNodes, testNode) || this.inList(closedNodes, testNode)){
                    if(testNode.f > f){
                        testNode.f = f;
                        testNode.g = g;
                        testNode.h = h;
                        testNode.parentNode = currentNode;
                    }
                } else {
                    testNode.f = f;
                    testNode.g = g;
                    testNode.h = h;
                    testNode.parentNode = currentNode;
                    openNodes.push(testNode);
                }
            }
            closedNodes.push(currentNode);
            if(openNodes.length == 0){
                return null;
            }
            openNodes.sort(this.byCost);
            currentNode = openNodes.shift();
            //console.log(currentNode);
            //console.log("==================");
        }
        //console.log(openNodes);
        var path = [];
        path = this.buildPath(currentNode, firstNode);
        return this.getDirections(path);
    };

    this.getNodesAround = function(x, y){
        var around = [];
        /*around[0] = {
            x: x-1,
            y: y-1,
            g: 14
        };*/
        around[0] = {
            x: x,
            y: y-1,
            g: 10
        };
        /*around[2] = {
            x: x+1,
            y: y-1,
            g: 14
        };*/
        around[1] = {
            x: x+1,
            y: y,
            g: 10
        };
        /*around[4] = {
            x: x+1,
            y: y+1,
            g: 14
        };*/
        around[2] = {
            x: x,
            y: y+1,
            g: 10
        };
        /*around[6] = {
            x: x-1,
            y: y+1,
            g: 14
        };*/
        around[3] = {
            x: x-1,
            y: y,
            g: 10
        };
        return around;
    };

    this.inList = function(list, pos){
        for(var i = 0; i < list.length; i++){
            if(list[i].x == pos.x && list[i].y == pos.y){
                return true;
            }
        }
        return false;
    };

    this.heuristic = function(from, to, cost){
        return Math.abs(from.x - to.x) + Math.abs(from.y + to.y);
    };

    this.getNodeLowestCost = function(list){
        var node = null;
        for(var i = 0; i < list.length; i++){
            if(node == null){
                node = list[i];
            } else if(node.f > list[i].f){
                node = list[i];
            }
        }
        return node;
    };

    this.byCost = function(a, b){
        return a.f - b.f;
    };

    this.buildPath = function(destinationNode, startNode){
        var path = [];
        var node = destinationNode;
        path.push(node);
        while(node.x != startNode.x || node.y != startNode.y){
            node = node.parentNode;
            path.unshift(node);
        }
        return path;
    }

    this.getDirections = function(path){
        var way = [];
        if(path.length > 1){
            for(var i = 1; i < path.length; i++){
                if(i > 0){
                    if(path[i].x > path[i-1].x && path[i].y == path[i-1].y){
                        way.push("east");
                    } else if(path[i].x < path[i-1].x && path[i].y == path[i-1].y){
                        way.push("west");
                    } else if(path[i].x == path[i-1].x && path[i].y > path[i-1].y){
                        way.push("south");
                    } else if(path[i].x == path[i-1].x && path[i].y < path[i-1].y){
                        way.push("north");
                    }
                }
            }
        }
        return way;
    }

}

module.exports = MapClass;