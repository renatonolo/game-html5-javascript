function Main(){

    this.canvas = null;
    this.foreground = null;
    this.map = null;
    this.websocket = null;
    this.mouse = null;
    this.player = null;
    this.characters = {};
    this.character = null;
    this.spanFps = null;
    this.frameAnimation = 1;
    this.mapLoaded = null;

    var fps, 
        fpsInterval, 
        startTime, 
        now, 
        then, 
        elapsed,
        stop,
        frameCount;

    this.main = function(){
        this.canvas = document.getElementById("foreground");
        this.foreground = this.canvas.getContext('2d');
        this.spanFps = document.getElementById("fps");

        this.websocket = new Websocket(config.hostWS, config.portWS);
        this.map = new Map(this.foreground);
        this.mouse = new Mouse(this.canvas, this.foreground);
        this.player = new Player("123456", "123456");
        this.character = new Character();

        this.map.setup();
        this.mouse.setup(this);
        this.character.setup();

        this.fps = config.fps;
        this.fpsInterval = 1000 / this.fps;
        this.then = Date.now();
        this.startTime = this.then;

        this.stop = false;
        this.frameCount = 0;

        this.websocket.connect(this, this.run);
    };

    this.run = function(ctx, playerLoaded){
        if(playerLoaded == undefined) ctx.player.setup(ctx);
        if(playerLoaded == true) {
            ctx.map.position.x = ctx.player.position.x;
            ctx.map.position.y = ctx.player.position.y;
            ctx.character.loadCharacters(ctx, ctx.map.position.x, ctx.map.position.y);
            ctx.mainLoop(ctx);
        }
    };

    this.mainLoop = function(ctx){
        if(stop) return;
        self = ctx;

        requestAnimationFrame(function(){
            self.mainLoop(ctx);
        });
        
        ctx.now = Date.now();
        ctx.elapsed = ctx.now - ctx.then;

        if(ctx.elapsed > ctx.fpsInterval) {
            ctx.then = ctx.now - (ctx.elapsed % ctx.fpsInterval);

            /**
             * Game Loop Area
             */
            if(ctx.mouse.mouseClick.x > 0 && ctx.mouse.mouseClick.y > 0) {
                ctx.player.wayCount = 0;
                ctx.map.checkTileInfo(ctx.websocket, ctx.mouse.mouseClick, ctx.player, ctx.player.handleTileInfo);
                ctx.mouse.mouseClick.x = 0;
                ctx.mouse.mouseClick.y = 0;
            }

            ctx.mouse.frameAnimation = this.frameAnimation;
            ctx.map.frameAnimation = this.frameAnimation;
            ctx.player.frameAnimation = this.frameAnimation;
            ctx.character.frameAnimation = this.frameAnimation;
            ctx.map.load(ctx.websocket, ctx);

            if(ctx.mapLoaded != null){
                ctx.map.draw(ctx.map, ctx.mapLoaded, ctx.elapsed, 0);
                ctx.map.draw(ctx.map, ctx.mapLoaded, ctx.elapsed, 1);
                ctx.mouse.draw();
                ctx.player.draw(ctx);
                ctx.character.draw(ctx);
                ctx.map.draw(ctx.map, ctx.mapLoaded, ctx.elapsed, 2);
                ctx.player.drawStatusText(ctx, ctx.elapsed);
                ctx.player.drawName(ctx);
                ctx.character.drawName(ctx);
                //ctx.map.draw(ctx.map, ctx.mapLoaded, ctx.elapsed, 3);
            }

            //Frame annimation
            this.frameAnimation++;
            if(ctx.frameAnimation > config.fps) ctx.frameAnimation = 1;

            /**
             * End of Game Loop Area
             */

            var sinceStart = ctx.now - ctx.startTime;
            ctx.frameCount++;
            var currentFps = Math.round(1000 / (sinceStart / ctx.frameCount) * 100) / 100;
            ctx.spanFps.innerHTML = currentFps;
        }
    };

}