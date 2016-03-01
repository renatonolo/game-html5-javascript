function Character(){
    this.main = null;
    this.websocket = null;

    this.imgCharacter = {};
    this.characterDimensions = null;
    this.characterDimensions = {};

    this.frameAnimation = 0;
    this.walkingAnnimation = 0;

    this.setup = function(){
        this.imgCharacter[0] = new Image(); //Beginner
        this.imgCharacter[0].src = config.imgBeginnerPath; //Beginner
        this.characterDimensions[0] = new BeginnerDimensions().getDimensions(); //Beginner
    }

    this.loadCharacters = function(ctx, xMap, yMap){
        this.websocket = ctx.websocket;
        this.main = ctx;
        var action = {
            action: "loadCharacters",
            x: xMap,
            y: yMap
        };
        this.websocket.callbackRefreshCharacter = this.callbackRefreshCharacter;
        this.websocket.ctxRefreshCharacter = this.main;
        this.websocket.sendMessage(JSON.stringify(action));
    };

    this.callbackRefreshCharacter = function(main, data){
        if(typeof data.data[0] == "undefined") {
            var aux = data.data;
            data.data = [];
            data.data[0] = aux;
        }

        var limits = main.map.getVisibleLimits(main.map);

        for(var i = 0; i < data.data.length; i++){
            if(main.player.uid == data.data[i].uid) continue;
            charX = data.data[i].position.x;
            charY = data.data[i].position.y;

            var founded = false;

            for(var uid in main.characters){
                if(uid == data.data[i].uid){
                    if(charX < limits.limitXMin || charX > limits.limitXMax || charY < limits.limitYMin || charY > limits.limitYMax) {
                        delete main.characters[uid];
                        return;
                    }

                    var aux = {};
                    if(typeof main.characters[uid].wayToGo != "undefined") aux = main.characters[uid].wayToGo[0];
                    else {
                        aux.x = 0;
                        aux.y = 0;
                        aux.direction = "south";
                    }

                    if(data.data[i].vocation) main.characters[uid].vocation = data.data[i].vocation;
                    if(data.data[i].level) main.characters[uid].level = data.data[i].level;
                    if(data.data[i].sex) main.characters[uid].sex = data.data[i].sex;
                    if(data.data[i].name) main.characters[uid].name = data.data[i].name;
                    if(aux.x != data.data[i].position.x || aux.y != data.data[i].position.y)
                        main.characters[uid].wayToGo.push(data.data[i].position);
                    
                    founded = true;
                }
            }

            if(!founded){
                if(charX < limits.limitXMin || charX > limits.limitXMax || charY < limits.limitYMin || charY > limits.limitYMax) return;
                char = {};
                char.vocation = data.data[i].vocation;
                char.level = data.data[i].level;
                char.sex = data.data[i].sex;
                char.name = data.data[i].name;
                char.wayToGo = [];
                char.wayToGo.push(data.data[i].position);
                char.position = data.data[i].position;

                char.walkingAnnimation = 0;
                char.offsetX = 0;
                char.offsetY = 0;

                main.characters[data.data[i].uid] = char;
            }
        }
    };

    this.draw = function(main){
        if(main.characters.length <= 0) return;

        for(var uid in main.characters){
            var char = main.characters[uid];
            switch(char.vocation){
                case 0:
                    main.character.drawBeginner(main, char);
                    break;
            }
        }
    };

    this.drawBeginner = function(main, char){

        if(char.wayToGo.length == 1){
            var position = char.wayToGo[0];

            var posX = Math.round(config.screenTileW / 2) * config.tileW - config.tileW;
            var posY = Math.round(config.screenTileH / 2) * config.tileH - (2 * config.tileH);

            var aux = position.x - main.map.position.x;
            posX += aux * config.tileW + main.character.characterDimensions[char.vocation][position.direction].stopped[0].leftOffset;

            aux = position.y - main.map.position.y;
            posY += aux * config.tileH;
            
            main.foreground.drawImage(
                main.character.imgCharacter[char.vocation], 
                main.character.characterDimensions[char.vocation][position.direction].stopped[0].x, 
                main.character.characterDimensions[char.vocation][position.direction].stopped[0].y, 
                main.character.characterDimensions[char.vocation][position.direction].stopped[0].w, 
                main.character.characterDimensions[char.vocation][position.direction].stopped[0].h, 
                posX, 
                posY, 
                main.character.characterDimensions[char.vocation][position.direction].stopped[0].w, 
                main.character.characterDimensions[char.vocation][position.direction].stopped[0].h
            );
        } else if(char.wayToGo.length > 1){
            if(main.character.frameAnimation % 10 == 0){
                char.walkingAnnimation++;
                if(char.walkingAnnimation > 3) char.walkingAnnimation = 0;
            }

            var newPos = char.wayToGo[1];

            if(char.position.x != newPos.x || char.position.y != newPos.y){
                switch(newPos.direction){
                    case "north":
                        char.offsetY--;
                        if(Math.abs(char.offsetY) >= config.tileH){
                            char.offsetY = 0;
                            char.position.y--;
                            char.wayToGo.shift();
                        }
                    break;
                    case "south":
                        char.offsetY++;
                        if(Math.abs(char.offsetY) >= config.tileH){
                            char.offsetY = 0;
                            char.position.y++;
                            char.wayToGo.shift();
                        }
                    break;
                    case "east":
                        char.offsetX++;
                        if(Math.abs(char.offsetX) >= config.tileW){
                            char.offsetX = 0;
                            char.position.x++;
                            char.wayToGo.shift();
                        }
                    break;
                    case "west":
                        char.offsetX--;
                        if(Math.abs(char.offsetX) >= config.tileW){
                            char.offsetX = 0;
                            char.position.x--;
                            char.wayToGo.shift();
                        }
                    break;
                }
            }

            var posX = Math.round(config.screenTileW / 2) * config.tileW - config.tileW;
            var posY = Math.round(config.screenTileH / 2) * config.tileH - (2 * config.tileH);

            var aux = char.position.x - main.map.position.x;
            posX += aux * config.tileW + char.offsetX + main.character.characterDimensions[char.vocation][newPos.direction].walking[char.walkingAnnimation].leftOffset;

            aux = char.position.y - main.map.position.y;
            posY += aux * config.tileH + char.offsetY;

            main.foreground.drawImage(
                main.character.imgCharacter[char.vocation], 
                main.character.characterDimensions[char.vocation][newPos.direction].walking[char.walkingAnnimation].x, 
                main.character.characterDimensions[char.vocation][newPos.direction].walking[char.walkingAnnimation].y, 
                main.character.characterDimensions[char.vocation][newPos.direction].walking[char.walkingAnnimation].w, 
                main.character.characterDimensions[char.vocation][newPos.direction].walking[char.walkingAnnimation].h, 
                posX, 
                posY, 
                main.character.characterDimensions[char.vocation][newPos.direction].walking[char.walkingAnnimation].w, 
                main.character.characterDimensions[char.vocation][newPos.direction].walking[char.walkingAnnimation].h
            );
        }
    };

    this.drawName = function(main){
        
        for(var uid in main.characters){
            var char = main.characters[uid];
            var position = char.wayToGo[0];

            var posX = Math.round(config.screenTileW / 2) * config.tileW - config.tileW;
            var posY = Math.round(config.screenTileH / 2) * config.tileH - (2 * config.tileH);

            var aux = position.x - main.map.position.x;
            posX += aux * config.tileW + char.offsetX + main.character.characterDimensions[char.vocation][position.direction].walking[char.walkingAnnimation].leftOffset;

            aux = position.y - main.map.position.y;
            posY += aux * config.tileH + char.offsetY;

            main.foreground.font = "bold 11px Verdana";
            main.foreground.fillStyle = "#00FF00";
            main.foreground.textAlign = "center";
            main.foreground.fillText(char.name, (posX + (config.tileW / 2)), (posY - 5));
        }
    }
}