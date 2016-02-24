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
        this.imgTile = [];
    };

    this.load = function(websocket, ctxMain){
        var action = {
            action: 'loadMap',
            x: this.position.x,
            y: this.position.y
        };
        websocket.callbackMapResponse = function(ctx, data){
            ctxMain.mapLoaded = data;
            for(var i = 0; i < data.data.tilesets.length; i++){
                ctx.imgTile[i] = {};
                ctx.imgTile[i].image = new Image();
                ctx.imgTile[i].image.src = "imgs/" + data.data.tilesets[i].imgTile;
                ctx.imgTile[i].firstgid = data.data.tilesets[i].firstgid;
            }
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
            timeLessAnim = 0,
            imgToUse = null,
            iImage = 0;

        pos = (y * config.screenTileW) - config.screenTileW + x;
        posX = x * config.tileW - config.tileW;
        posY = y * config.tileH - config.tileH;

                
        tileId = map.data.map[l][pos - 1];

        if(tileId == undefined) return;
        
        //Animation calcs
        
        //Select ImgToUse
        for(var ix = 0; ix < map.data.tilesets.length; ix++){
            if((ix < (map.data.tilesets.length - 1) && tileId >= map.data.tilesets[ix].firstgid && tileId < map.data.tilesets[ix+1].firstgid)){
                imgToUse = ctx.imgTile[ix].image;
                iImage = ix;
            } else if(ix == map.data.tilesets.length - 1 && tileId >= map.data.tilesets[ix].firstgid){
                imgToUse = ctx.imgTile[ix].image;
                iImage = ix;
            }
        }

        for(var a = 0; a < map.data.tilesets[iImage].animation.length; a++){
            if(tileId == map.data.tilesets[iImage].animation[a].tile){
                tileAnimated = true;
                if(ctx.tilesAnim[tileId] == undefined){
                    tileId = map.data.tilesets[iImage].animation[a].animation[0].tileid;
                    ctx.tilesAnim[tileId] = {};
                    ctx.tilesAnim[tileId].timeLastAnim = 0;
                    ctx.tilesAnim[tileId].position = 0;
                } else {
                    if(ctx.tilesAnim[tileId].timeLastAnim >= map.data.tilesets[iImage].animation[a].animation[ctx.tilesAnim[tileId].position].duration){
                        ctx.tilesAnim[tileId].position++;
                        if(ctx.tilesAnim[tileId].position >= map.data.tilesets[iImage].animation[a].animation.length) ctx.tilesAnim[tileId].position = 0;
                        ctx.tilesAnim[tileId].timeLastAnim = 0;
                        tileId = map.data.tilesets[iImage].animation[a].animation[ctx.tilesAnim[tileId].position].tileid;
                    } else {
                        ctx.tilesAnim[tileId].timeLastAnim += elapsed;
                        tileId = map.data.tilesets[iImage].animation[a].animation[ctx.tilesAnim[tileId].position].tileid;
                    }
                }
            }
        }
        //End of animation calcs
        
        if(tileId == 0) return;
        var tileClip = tileId;
        if(iImage > 0) tileClip = tileId - map.data.tilesets[iImage].firstgid + 1;

        //if( ctx.oldMap.data == undefined || tileId != ctx.oldMap.data[l][pos-1]){
            if(tileClip > 0 && tileClip % config.numTilePerLine == 0) clipTileX = config.numTilePerLine * config.tileW - config.tileW;
            else clipTileX = parseInt((tileClip % config.numTilePerLine)) * config.tileW - config.tileW;
            if(tileClip > 0 && tileClip <= config.numTilePerLine) clipTileY = 0;
            else if(tileClip > 0 && tileClip % config.numTilePerLine == 0) clipTileY = parseInt((tileClip / config.numTilePerLine)) * config.tileH - config.tileH;
            else clipTileY = parseInt((tileClip / config.numTilePerLine)) * config.tileH;

            ctx.canvas.drawImage(imgToUse, clipTileX, clipTileY, config.tileW, config.tileH, posX, posY, config.tileW, config.tileH);
        //}
    };
}