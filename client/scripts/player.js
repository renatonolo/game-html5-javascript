function Player(playerUid){
    
    this.webscket = null;

    this.uid = null;
    this.playerUid = playerUid;
    this.vocation = null;
    this.level = null;
    this.skills = {};
    this.sex = null;
    this.name = null;
    this.equips = {};
    this.position = {};

    this.imgPlayer = null;
    this.playerDimensions = null;

    this.frameAnimation = 1;
    this.walkingAnnimation = 0;

    this.walking = false;
    this.direction = "south";
    this.wayToGo = [];
    this.offsetX = 0;
    this.offsetY = 0;
    this.wayCount = 0;

    this.statusText = "";
    this.statusTextTime = 0;
    this.printedStatusText = "";

    this.chatMessage = "";
    this.chatMessageTime = 0;
    this.printedChatMessage = "";

    this.setup = function(ctx){
        this.imgPlayer = new Image();
        this.websocket = ctx.websocket;
        var action = {
            action: "loadPlayer",
            player: this.playerUid,
        };
        this.websocket.callbackLoadPlayerResponse = this.callbackLoadPlayerResponse;
        this.websocket.ctxLoadPlayerResponse = ctx;
        this.websocket.sendMessage(JSON.stringify(action));
    };

    this.callbackLoadPlayerResponse = function(ctx, data){
        ctx.player.uid = data.data.uid;
        ctx.player.name = data.data.name;
        ctx.player.sex = data.data.sex;
        ctx.player.level = data.data.level;
        ctx.player.vocation = data.data.vocation;
        ctx.player.skills = data.data.skills;
        ctx.player.equips = data.data.equips;
        ctx.player.position = data.data.position;

        switch(ctx.player.vocation){
            case 0:
                ctx.player.imgPlayer.src = config.imgBeginnerPath;
                ctx.player.playerDimensions = new BeginnerDimensions().getDimensions();
                break;
        }

        ctx.run(ctx, true);
    };

    this.draw = function(ctx){
        switch(ctx.player.vocation){
            case 0:
                ctx.player.drawBeginner(ctx);
                break;
        }
    };

    this.drawBeginner = function(ctx){
        var player = ctx.player;
        
        if(!player.walking){
            var posX = Math.round(config.screenTileW / 2) * config.tileW - config.tileW;
            var posY = Math.round(config.screenTileH / 2) * config.tileH - (2 * config.tileH);

            var aux = player.position.x - ctx.map.position.x;
            posX += aux * config.tileW + player.playerDimensions[player.direction].stopped[0].leftOffset;

            aux = player.position.y - ctx.map.position.y;
            posY += aux * config.tileH;
            
            ctx.foreground.drawImage(
                player.imgPlayer, 
                player.playerDimensions[player.direction].stopped[0].x, 
                player.playerDimensions[player.direction].stopped[0].y, 
                player.playerDimensions[player.direction].stopped[0].w, 
                player.playerDimensions[player.direction].stopped[0].h, 
                posX, 
                posY, 
                player.playerDimensions[player.direction].stopped[0].w, 
                player.playerDimensions[player.direction].stopped[0].h
            );
            
        } else {
            if(player.frameAnimation % 10 == 0){
                player.walkingAnnimation++;
                if(player.walkingAnnimation > 3) player.walkingAnnimation = 0;
            }

            switch(player.direction){
                case "north":
                    player.offsetY--;
                    if(Math.abs(player.offsetY) >= config.tileH){
                        player.offsetY = 0;
                        player.position.y--;
                        player.wayCount++;
                        player.updateMapPosition(ctx, posX, posY);
                        player.sendPosition(player);
                    }
                break;
                case "south":
                    player.offsetY++;
                    if(player.offsetY >= config.tileH){
                        player.offsetY = 0;
                        player.position.y++;
                        player.wayCount++;
                        player.updateMapPosition(ctx, posX, posY);
                        player.sendPosition(player);
                    }
                break;
                case "east":
                    player.offsetX++;
                    if(player.offsetX >= config.tileW){
                        player.offsetX = 0;
                        player.position.x++;
                        player.wayCount++;
                        player.updateMapPosition(ctx, posX, posY);
                        player.sendPosition(player);
                    }
                break;
                case "west":
                    player.offsetX--;
                    if(Math.abs(player.offsetX) >= config.tileW){
                        player.offsetX = 0;
                        player.position.x--;
                        player.wayCount++;
                        player.updateMapPosition(ctx, posX, posY);
                        player.sendPosition(player);
                    }
                break;
            }

            var posX = Math.round(config.screenTileW / 2) * config.tileW - config.tileW;
            var posY = Math.round(config.screenTileH / 2) * config.tileH - (2 * config.tileH);

            var aux = player.position.x - ctx.map.position.x;
            posX += aux * config.tileW + player.offsetX + player.playerDimensions[player.direction].walking[player.walkingAnnimation].leftOffset;

            aux = player.position.y - ctx.map.position.y;
            posY += aux * config.tileH + player.offsetY;

            ctx.foreground.drawImage(
                player.imgPlayer, 
                player.playerDimensions[player.direction].walking[player.walkingAnnimation].x, 
                player.playerDimensions[player.direction].walking[player.walkingAnnimation].y, 
                player.playerDimensions[player.direction].walking[player.walkingAnnimation].w, 
                player.playerDimensions[player.direction].walking[player.walkingAnnimation].h, 
                posX, 
                posY, 
                player.playerDimensions[player.direction].walking[player.walkingAnnimation].w, 
                player.playerDimensions[player.direction].walking[player.walkingAnnimation].h
            );

            if(player.wayCount >= player.wayToGo.length) {
                player.walking = false;
                player.wayCount = 0;
                player.sendPosition(player);
            } else {
                player.direction = player.wayToGo[player.wayCount];
            }
        }
    };

    this.drawName = function(ctx, elapsed){
        var player = ctx.player;
        var toPrint = player.name;
        var posX = Math.round(config.screenTileW / 2) * config.tileW - config.tileW;
        var posY = Math.round(config.screenTileH / 2) * config.tileH - (2 * config.tileH);

        var aux = player.position.x - ctx.map.position.x;
        posX += aux * config.tileW + player.offsetX + player.playerDimensions[player.direction].walking[player.walkingAnnimation].leftOffset;

        aux = player.position.y - ctx.map.position.y;
        posY += aux * config.tileH + player.offsetY;

        if(player.chatMessage != ""){
            if(player.chatMessage.length > 50){
                var splitCount = Math.round(player.chatMessage.length / 50);
                for(var i = 0; i < splitCount; i++) player.printedChatMessage += player.chatMessage.substr(i * 50, 50) + '\n';
            } else player.printedChatMessage = player.chatMessage;
            player.chatMessage = "";
        } else {
            if(player.printedChatMessage != ""){
                player.chatMessageTime += elapsed
                if(player.chatMessageTime <= 7000){
                    toPrint += ":\n" + player.printedChatMessage;
                } else {
                    player.chatMessageTime = 0;
                    player.printedChatMessage = "";
                }
            }
        }

        ctx.foreground.font = "900 9pt Verdana";
        ctx.foreground.lineWidth = 0.5;
        ctx.foreground.fillStyle = "#00FF00";
        ctx.foreground.strokeStyle = 'black';
        ctx.foreground.textAlign = "center";

        var lines = toPrint.split('\n');
        if(lines.length > 1){
            for(var i = 0; i < lines.length; i++){
                y = (posY - 5);
                y = y - ((lines.length - 1 - i) * 15);
                ctx.foreground.fillText(lines[i], (posX + (config.tileW / 2)), y);
                ctx.foreground.strokeText(lines[i], (posX + (config.tileW / 2)), y);
            }
        } else {
            ctx.foreground.fillText(toPrint, (posX + (config.tileW / 2)), (posY - 5));
            ctx.foreground.strokeText(toPrint, (posX + (config.tileW / 2)), (posY - 5));
        }
    }

    this.handleTileInfo = function(ctx, data){
        console.log(data);
        if(!data.data.collision){
            ctx.gotoTile(ctx, data);
        } else {
            ctx.statusText = "You can't go to this tile.";
        }
    };

    this.gotoTile = function(ctx, data){
        if(data.data.way.length > 0){
            ctx.walking = true;
            ctx.wayToGo = data.data.way;
            ctx.direction = data.data.way[0];
        }
    };

    this.drawStatusText = function(ctx, elapsed){
        if(ctx.player.statusText != ""){
            ctx.player.printedStatusText = ctx.player.statusText;
            ctx.foreground.font = "900 13px Verdana";
            ctx.foreground.lineWidth = 0.5;
            ctx.foreground.fillStyle = "#FFFFFF";
            ctx.foreground.textAlign = "center";
            ctx.foreground.fillText(ctx.player.printedStatusText, ((config.screenTileW * config.tileW) / 2), (config.screenTileH * config.tileH - 4));
            ctx.foreground.strokeText(ctx.player.printedStatusText, ((config.screenTileW * config.tileW) / 2), (config.screenTileH * config.tileH - 4));
            ctx.player.statusTextTime = 0;
            ctx.player.statusText = "";
        } else {
            if(ctx.player.statusTextTime > config.statusTextTime && ctx.player.printedStatusText != ""){
                ctx.player.printedStatusText = "";
            } else {
                ctx.foreground.font = "900 13px Verdana";
                ctx.foreground.lineWidth = 0.5;
                ctx.foreground.fillStyle = "#FFFFFF";
                ctx.foreground.textAlign = "center";
                ctx.foreground.fillText(ctx.player.printedStatusText, ((config.screenTileW * config.tileW) / 2), (config.screenTileH * config.tileH - 4));
                ctx.foreground.strokeText(ctx.player.printedStatusText, ((config.screenTileW * config.tileW) / 2), (config.screenTileH * config.tileH - 4));
                ctx.player.statusTextTime += elapsed;
            }
        }
    };

    this.sendPosition = function(ctx){
        var action = {
            action: "sendPosition",
            uid: ctx.uid,
            position: ctx.position,
            walking: ctx.walking,
            direction: ctx.direction
        };
        ctx.websocket.sendMessage(JSON.stringify(action));
    };

    this.updateMapPosition = function(ctxMain, posX, posY){
        var limits = ctxMain.map.getVisibleLimits(ctxMain.map);
        var mid = ctxMain.map.getMiddleMap();

        if(ctxMain.player.position.x == limits.limitXMin && ctxMain.player.direction == "west") ctxMain.map.position.x = limits.limitXMin - mid.midX + 1;
        if(ctxMain.player.position.x == limits.limitXMax && ctxMain.player.direction == "east") ctxMain.map.position.x = limits.limitXMax + mid.midX - 1;
        if(ctxMain.player.position.y == limits.limitYMin && ctxMain.player.direction == "north") ctxMain.map.position.y = limits.limitYMin - mid.midY + 1;
        if(ctxMain.player.position.y == limits.limitYMax && ctxMain.player.direction == "south") ctxMain.map.position.y = limits.limitYMax + mid.midY - 2;
    }
}