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
        if(!ctx.player.walking){
            var posX = Math.round((ctx.canvas.width / 2) - (ctx.player.playerDimensions[ctx.player.direction].stopped[0].w / 2) + ctx.player.playerDimensions[ctx.player.direction].stopped[0].leftOffset);
            var posY = Math.round((ctx.canvas.height / 2) - (ctx.player.playerDimensions[ctx.player.direction].stopped[0].h / 2) + ctx.player.playerDimensions[ctx.player.direction].stopped[0].topOffset);
            posX += ctx.player.offsetX;
            posY += ctx.player.offsetY - 18;
            
            ctx.foreground.drawImage(ctx.player.imgPlayer, ctx.player.playerDimensions[ctx.player.direction].stopped[0].x, ctx.player.playerDimensions[ctx.player.direction].stopped[0].y, ctx.player.playerDimensions[ctx.player.direction].stopped[0].w, ctx.player.playerDimensions[ctx.player.direction].stopped[0].h, posX, posY, ctx.player.playerDimensions[ctx.player.direction].stopped[0].w, ctx.player.playerDimensions[ctx.player.direction].stopped[0].h);
        } else {
            if(ctx.player.frameAnimation % 10 == 0){
                ctx.player.walkingAnnimation++;
                if(ctx.player.walkingAnnimation > 3) ctx.player.walkingAnnimation = 0;
            }

            if(ctx.player.direction == "south"){
                ctx.player.offsetY++;
                if(ctx.player.offsetY % config.tileH == 0){
                    if(ctx.player.wayCount < ctx.player.wayToGo.length - 1){
                        ctx.player.wayCount++;
                        ctx.player.direction = ctx.player.wayToGo[ctx.player.wayCount];
                    } else {
                        ctx.player.wayCount = 0;
                        ctx.player.walking = false;
                    }
                    ctx.player.position.y++;
                }
            } else if(ctx.player.direction == "north"){
                ctx.player.offsetY--;
                if(ctx.player.offsetY % config.tileH == 0){
                    if(ctx.player.wayCount < ctx.player.wayToGo.length - 1){
                        ctx.player.wayCount++;
                        ctx.player.direction = ctx.player.wayToGo[ctx.player.wayCount];
                    } else {
                        ctx.player.wayCount = 0;
                        ctx.player.walking = false;
                    }
                    ctx.player.position.y--;
                }
            } else if(ctx.player.direction == "east"){
                ctx.player.offsetX++;
                if(ctx.player.offsetX % config.tileW == 0){
                    if(ctx.player.wayCount < ctx.player.wayToGo.length - 1){
                        ctx.player.wayCount++;
                        ctx.player.direction = ctx.player.wayToGo[ctx.player.wayCount];
                    } else {
                        ctx.player.wayCount = 0;
                        ctx.player.walking = false;
                    }
                    ctx.player.position.x++;
                }
            } else if(ctx.player.direction == "west"){
                ctx.player.offsetX--;
                if(ctx.player.offsetX % config.tileW == 0){
                    if(ctx.player.wayCount < ctx.player.wayToGo.length - 1){
                        ctx.player.wayCount++;
                        ctx.player.direction = ctx.player.wayToGo[ctx.player.wayCount];
                    } else {
                        ctx.player.wayCount = 0;
                        ctx.player.walking = false;
                    }
                    ctx.player.position.x--;
                }
            }

            posX = Math.round((ctx.canvas.width / 2) - (ctx.player.playerDimensions[ctx.player.direction].walking[ctx.player.walkingAnnimation].w / 2) + ctx.player.playerDimensions[ctx.player.direction].walking[ctx.player.walkingAnnimation].leftOffset);
            posY = Math.round((ctx.canvas.height / 2) - (ctx.player.playerDimensions[ctx.player.direction].walking[ctx.player.walkingAnnimation].h / 2) + ctx.player.playerDimensions[ctx.player.direction].walking[ctx.player.walkingAnnimation].topOffset);
            posX += ctx.player.offsetX;
            posY += ctx.player.offsetY - 18;

            if(posY < 0){
                posY -= ctx.player.offsetY - 1;
                ctx.player.offsetY = 7 * config.tileH;
                posY += ctx.player.offsetY;
                ctx.map.position.y -= 13;
            }

            if(posX < 0){
                posX -= ctx.player.offsetX - 1;
                ctx.player.offsetX = 12 * config.tileW;
                posX += ctx.player.offsetX;
                ctx.map.position.x -= 24;
            }

            if(posY > (ctx.canvas.height - ctx.player.playerDimensions[ctx.player.direction].walking[ctx.player.walkingAnnimation].h)){
                posY -= ctx.player.offsetY - config.tileH;
                ctx.player.offsetY = (7 * config.tileH - 36) * - 1;
                posY += ctx.player.offsetY;
                ctx.map.position.y += 13;
            }

            if(posX > (ctx.canvas.width - ctx.player.playerDimensions[ctx.player.direction].walking[ctx.player.walkingAnnimation].w)){
                posX -= ctx.player.offsetX - config.tileW;
                ctx.player.offsetX = 12 * config.tileW * -1;
                posX += ctx.player.offsetX;
                ctx.map.position.x += 24;
            }
            ctx.foreground.drawImage(ctx.player.imgPlayer, ctx.player.playerDimensions[ctx.player.direction].walking[ctx.player.walkingAnnimation].x, ctx.player.playerDimensions[ctx.player.direction].walking[ctx.player.walkingAnnimation].y, ctx.player.playerDimensions[ctx.player.direction].walking[ctx.player.walkingAnnimation].w, ctx.player.playerDimensions[ctx.player.direction].walking[ctx.player.walkingAnnimation].h, posX, posY, ctx.player.playerDimensions[ctx.player.direction].walking[ctx.player.walkingAnnimation].w, ctx.player.playerDimensions[ctx.player.direction].walking[ctx.player.walkingAnnimation].h);            
        }
        
        //document.getElementById("txtConsole").innerHTML = "Player Position: " + ctx.player.position.x + ", " + ctx.player.position.y;
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
        ctx.walking = true;
        ctx.wayToGo = data.data.way;
        ctx.direction = data.data.way[0];
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
}