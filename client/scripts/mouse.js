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
            self.mouseTilePosition = self.findMouseTile(e);
        });

        this.canvas.addEventListener("click", function(e){
            self.mouseClick = self.findMouseTile(e);
        })
    };

    this.findMouseTile = function(e, ctxMain){
        var canvas = this.canvas;
        var mouseX = e.clientX - canvas.offsetLeft;
        var mouseY = e.clientY - canvas.offsetTop;
        var tileX = parseInt(mouseX / config.tileW) + 1;
        var tileY = parseInt(mouseY / config.tileH) + 1;
        
        var midX = Math.round(config.screenTileW / 2);
        var midY = Math.round(config.screenTileH / 2);

        var posX = this.ctxMain.player.position.x;
        var posY = this.ctxMain.player.position.y;

        if(tileX < midX) posX -= (midX - tileX);
        else if(tileX > midX) posX += (tileX - midX);

        if(tileY < midY) posY -= (midY - tileY);
        else if(tileY > midY) posY += (tileY - midY);

        return {
            x: tileX,
            y: tileY,
            mapX: posX,
            mapY: posY
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