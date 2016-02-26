function Player(acc, pass){
    
    this.webscket = null;

    this.account = acc;
    this.password = pass;
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

    this.setup = function(ctx){
        this.imgPlayer = new Image();
        this.websocket = ctx.websocket;
        var action = {
            action: "loadPlayer",
            account: this.account,
            password: this.password
        };
        this.websocket.callbackLoadPlayerResponse = this.callbackLoadPlayerResponse;
        this.websocket.ctxLoadPlayerResponse = ctx;
        this.websocket.sendMessage(JSON.stringify(action));
    };

    this.callbackLoadPlayerResponse = function(ctx, data){
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
    }

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
            posX += aux * config.tileW;

            aux = player.position.y - ctx.map.position.y;
            posY += aux * config.tileH;
            
            ctx.foreground.drawImage(player.imgPlayer, player.playerDimensions[player.direction].stopped[0].x, player.playerDimensions[player.direction].stopped[0].y, player.playerDimensions[player.direction].stopped[0].w, player.playerDimensions[player.direction].stopped[0].h, posX, posY, player.playerDimensions[player.direction].stopped[0].w, player.playerDimensions[player.direction].stopped[0].h);
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
                        //player.direction = player.wayToGo[player.wayCount];
                        player.sendPosition(player);
                    }
                break;
                case "south":
                    player.offsetY++;
                    if(player.offsetY >= config.tileH){
                        player.offsetY = 0;
                        player.position.y++;
                        player.wayCount++;
                        //player.direction = player.wayToGo[player.wayCount];
                        player.sendPosition(player);
                    }
                break;
                case "east":
                    player.offsetX++;
                    if(player.offsetX >= config.tileW){
                        player.offsetX = 0;
                        player.position.x++;
                        player.wayCount++;
                        //player.direction = player.wayToGo[player.wayCount];
                        player.sendPosition(player);
                    }
                break;
                case "west":
                    player.offsetX--;
                    if(Math.abs(player.offsetX) >= config.tileW){
                        player.offsetX = 0;
                        player.position.x--;
                        player.wayCount++;
                        //player.direction = player.wayToGo[player.wayCount];
                        player.sendPosition(player);
                    }
                break;
            }

            var posX = Math.round(config.screenTileW / 2) * config.tileW - config.tileW;
            var posY = Math.round(config.screenTileH / 2) * config.tileH - (2 * config.tileH);

            var aux = player.position.x - ctx.map.position.x;
            posX += aux * config.tileW + player.offsetX + playerDimensions[player.direction].walking[player.walkingAnnimation].leftOffset;

            aux = player.position.y - ctx.map.position.y;
            posY += aux * config.tileH + player.offsetY;

            ctx.foreground.drawImage(player.imgPlayer, player.playerDimensions[player.direction].walking[player.walkingAnnimation].x, player.playerDimensions[player.direction].walking[player.walkingAnnimation].y, player.playerDimensions[player.direction].walking[player.walkingAnnimation].w, player.playerDimensions[player.direction].walking[player.walkingAnnimation].h, posX, posY, player.playerDimensions[player.direction].walking[player.walkingAnnimation].w, player.playerDimensions[player.direction].walking[player.walkingAnnimation].h);            

            if(player.wayCount >= player.wayToGo.length) {
                player.walking = false;
                player.wayCount = 0;
            } else {
                player.direction = player.wayToGo[player.wayCount];
            }
        }
    }

    this.handleTileInfo = function(ctx, data){
        console.log(data);
        if(!data.data.collision){
            ctx.gotoTile(ctx, data);
        } else {
            ctx.statusText = "You can't go to this tile.";
        }
    }

    this.gotoTile = function(ctx, data){
        if(data.data.way.length > 0){
            ctx.walking = true;
            ctx.wayToGo = data.data.way;
            ctx.direction = data.data.way[0];
        }
    }

    this.drawStatusText = function(ctx, elapsed){
        if(ctx.player.statusText != ""){
            ctx.player.printedStatusText = ctx.player.statusText;
            ctx.foreground.font = "bold 12px Verdana";
            ctx.foreground.fillStyle = "#FFFFFF";
            ctx.foreground.textAlign = "center";
            ctx.foreground.fillText(ctx.player.printedStatusText, ((config.screenTileW * config.tileW) / 2), (config.screenTileH * config.tileH - 4));
            ctx.player.statusTextTime = 0;
            ctx.player.statusText = "";
        } else {
            if(ctx.player.statusTextTime > config.statusTextTime && ctx.player.printedStatusText != ""){
                ctx.player.printedStatusText = "";
            } else {
                ctx.foreground.font = "bold 12px Verdana";
                ctx.foreground.fillStyle = "#FFFFFF";
                ctx.foreground.textAlign = "center";
                ctx.foreground.fillText(ctx.player.printedStatusText, ((config.screenTileW * config.tileW) / 2), (config.screenTileH * config.tileH - 4));
                ctx.player.statusTextTime += elapsed;
            }
        }
    }

    this.sendPosition = function(ctx){
        var action = {
            action: "sendPosition",
            account: ctx.account,
            position: ctx.position
        };
        ctx.websocket.sendMessage(JSON.stringify(action));
    }
}