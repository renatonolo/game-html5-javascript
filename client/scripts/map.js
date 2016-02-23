function Map(canvas){
    
    this.canvas = canvas;
    this.oldMap = {};
    this.imgTile;
    this.position = {
        x: 51,
        y: 49
    };
    this.frameAnimation = 0;
    this.animation = 0;
    this.tilesAnim = {};

    this.setup = function(){
        this.imgTile = new Image();
        this.imgTile.src = config.tilesheetPath;
    };

    this.load = function(websocket, ctxMain){
        var action = {
            action: 'loadMap',
            x: this.position.x,
            y: this.position.y
        };
        websocket.callbackMapResponse = function(ctx, data){
            ctxMain.mapLoaded = data;
        };
        websocket.ctxMapResponse = this;
        websocket.sendMessage(JSON.stringify(action));
    };

    this.checkTileInfo = function(websocket, pos, ctxCallback, callback){
        var action = {
            action: 'checkTileInfo',
            x: pos.x,
            y: pos.y
        };
        websocket.callbackCheckTileInfoResponse = callback;
        websocket.ctxCheckTileInfoResponse = ctxCallback;
        websocket.sendMessage(JSON.stringify(action));
    };

    this.draw = function(ctx, map, elapsed, level){
        console.log(map);
        //for(var l = 0; l < map.data.length; l++){
        var l = level;
            for(var x = 0; x <= config.screenTileW; x++){
                for(var y = 0; y <= config.screenTileH; y++){
                    ctx.drawTile(ctx, map, elapsed, l, x, y);
                }
            }
        //}

        ctx.oldMap = map;
    };

    this.drawTile = function(ctx, map, elapsed, l, x, y){
        var pos = 0,
            posX = 0,
            posY = 0,
            tileId = 0,
            tileAnimated = false,
            tileW = config.tileW,
            tileH = config.tileH,
            clipX = 0,
            clipY = 0,
            timeLessAnim = 0;

        pos = (y * config.screenTileW) - config.screenTileW + x;
        posX = x * config.tileW - config.tileW;
        posY = y * config.tileH - config.tileH;

                
        tileId = map.data.map[l][pos - 1];

        //Animation calcs
        for(var a = 0; a < map.data.tilesets.animation.length; a++){
            if(tileId == map.data.tilesets.animation[a].tile){
                tileAnimated = true;
                if(ctx.tilesAnim[tileId] == undefined){
                    tileId = map.data.tilesets.animation[a].animation[0].tileid;
                    ctx.tilesAnim[tileId] = {};
                    ctx.tilesAnim[tileId].timeLastAnim = 0;
                    ctx.tilesAnim[tileId].position = 0;
                } else {
                    if(ctx.tilesAnim[tileId].timeLastAnim >= map.data.tilesets.animation[a].animation[ctx.tilesAnim[tileId].position].duration){
                        ctx.tilesAnim[tileId].position++;
                        if(ctx.tilesAnim[tileId].position >= map.data.tilesets.animation[a].animation.length) ctx.tilesAnim[tileId].position = 0;
                        ctx.tilesAnim[tileId].timeLastAnim = 0;
                        tileId = map.data.tilesets.animation[a].animation[ctx.tilesAnim[tileId].position].tileid;
                    } else {
                        ctx.tilesAnim[tileId].timeLastAnim += elapsed;
                        tileId = map.data.tilesets.animation[a].animation[ctx.tilesAnim[tileId].position].tileid;
                    }
                }
            }
        }
        //End of animation calcs
        
        if(tileId == 0) return;

        //if( ctx.oldMap.data == undefined || tileId != ctx.oldMap.data[l][pos-1]){
            if(tileId > 0 && tileId % config.numTilePerLine == 0) clipTileX = config.numTilePerLine * config.tileW - config.tileW;
            else clipTileX = parseInt((tileId % config.numTilePerLine)) * config.tileW - config.tileW;
            if(tileId > 0 && tileId <= config.numTilePerLine) clipTileY = 0;
            else if(tileId > 0 && tileId % config.numTilePerLine == 0) clipTileY = parseInt((tileId / config.numTilePerLine)) * config.tileH - config.tileH;
            else clipTileY = parseInt((tileId / config.numTilePerLine)) * config.tileH;

            ctx.canvas.drawImage(ctx.imgTile, clipTileX, clipTileY, config.tileW, config.tileH, posX, posY, config.tileW, config.tileH);
        //}
    };
}