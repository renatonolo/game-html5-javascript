function Mouse(canvas, foreground){

    this.canvas = canvas;
    this.ctxMain;
    this.foreground = foreground;
    this.frameAnimation = 0;
    this.imgTarget = null;
    this.imgTargetNow = 1;
    this.mouseTilePosition = {
        x: -1,
        y: -1
    };
    this.mouseClick = {
        x: -1,
        y: -1
    };

    this.setup = function(ctxMain){
        var self = this;

        this.ctxMain = ctxMain;

        this.imgTarget = new Image();
        this.imgTarget.src = config.targetPath;

        this.canvas.addEventListener("mousemove", function(e){
            self.mouseTilePosition = self.findMouseTile(e, self.ctxMain);
        });

        this.canvas.addEventListener("click", function(e){
            self.mouseClick = self.findMouseTile(e, self.ctxMain);
        })
    };

    this.findMouseTile = function(e, ctxMain){
        var canvas = this.canvas;
        var posMapX = 0;
        var posMapY = 0;
        var auxX = 0;
        var auxY = 0;
        var mouseX = e.clientX - canvas.offsetLeft;
        var mouseY = e.clientY - canvas.offsetTop;
        var tileX = parseInt(mouseX / config.tileW) + 1;
        var tileY = parseInt(mouseY / config.tileH) + 1;
        
        var midX = Math.round(config.screenTileW / 2);
        var midY = Math.round(config.screenTileH / 2);

        var mapDX = ctxMain.map.position.x - midX;
        var mapDY = ctxMain.map.position.y - midY;

        var playerDX = ctxMain.player.position.x - midX;
        var playerDY = ctxMain.player.position.y - midY;

        if(mapDX == playerDX && mapDY == playerDY){
            if(midX > tileX) {
                auxX = midX - tileX;
                posMapX = ctxMain.player.position.x - auxX;
            } else if(midX < tileX) {
                auxX = tileX - midX;
                posMapX = ctxMain.player.position.x + auxX;
            } else {
                posMapX = ctxMain.map.position.x;
            }

            if(midY > tileY) {
                auxY = midY - tileY;
                posMapY = ctxMain.player.position.y - auxY;
            } else if(midY < tileY) {
                auxY = tileY - midY;
                posMapY = ctxMain.player.position.y + auxY;
            } else {
                posMapY = ctxMain.map.position.y;
            }
        } else {
            if(midX < tileX){
                posMapX = ctxMain.map.position.x + tileX - midX;
            } else if(midX > tileX){
                auxX = midX - tileX;
                posMapX = ctxMain.map.position.x - auxX;
            } else {
                posMapX = ctxMain.map.position.x;
            }

            if(midY < tileY){
                posMapY = ctxMain.map.position.y + tileY - midY;
            } else if(midY > tileY){
                auxY = midY - tileY;
                posMapY = ctxMain.map.position.y - auxY;
            } else {
                posMapY = ctxMain.map.position.y;
            }
        }

        return {
            x: tileX,
            y: tileY,
            mapX: posMapX,
            mapY: posMapY
        };
    }

    this.draw = function(){

        var posX = (this.mouseTilePosition.x * config.tileW) - config.tileW;
        var posY = (this.mouseTilePosition.y * config.tileH) - config.tileH;

        if(posX < 0 || posY < 0) return;

        var clipTileX = this.imgTargetNow * config.tileW - config.tileW;

        this.foreground.beginPath();
        this.foreground.lineWidth = "2";
        this.foreground.strokeStyle="white";
        this.foreground.rect(posX, posY, config.tileW, config.tileH);
        this.foreground.stroke();
    }
}