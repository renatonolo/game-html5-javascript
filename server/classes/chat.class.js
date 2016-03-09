function ChatClass(){

    this.wss = null;
    this.db = null;

    this.tilesBeforeX = 0;
    this.tilesBeforeY = 0;
    this.tilesAfterX = 0;
    this.tilesAfterY = 0;

    this.message = "";
    this.from = "";

    this.setup = function(db, wss, beforeX, beforeY, afterX, afterY){
        this.db = db;
        this.wss = wss;

        this.tilesBeforeX = beforeX;
        this.tilesBeforeY = beforeY;
        this.tilesAfterX = afterX;
        this.tilesAfterY = afterY;
    };

    this.sendChatMessage = function(uid, x, y, message){
        var limits = this.getVisibleLimits(x, y);
        var sql = "SELECT * FROM players WHERE" + 
                    " position_x >= " + limits.limitXMin + 
                    " AND position_x <= " + limits.limitXMax + 
                    " AND position_y >= " + limits.limitYMin + 
                    " AND position_y <= " + limits.limitYMax + 
                    " AND online = 1";
        this.message = message;
        this.from = uid;
        this.db.query(sql, this, this.sendChatMessageCallback);
    };

    this.sendChatMessageCallback = function(ctxChat, rows){
        var to = null;
        if(rows.length > 0){
            to = [];
            for(var i = 0; i < rows.length; i++){
                to.push(rows[i].uid);
            }
            var response = {
                action: 'chatMessageResponse',
                message: ctxChat.message,
                from: ctxChat.from
            };
            console.log(to);
            console.log(response);
            ctxChat.wss.sendToClients(to, JSON.stringify(response));
        }
    }

    this.getVisibleLimits = function(x, y){
        var mid = this.getMiddleMap();
        console.log(mid);
        var limitXMin = x - mid.midX + 1;
        var limitXMax = x + mid.midX - 1;

        var limitYMin = y - mid.midY + 1;
        var limitYMax = y + mid.midY - 1;

        return {
            limitXMin: limitXMin,
            limitXMax: limitXMax,
            limitYMin: limitYMin,
            limitYMax: limitYMax
        };
    };

    this.getMiddleMap = function(){
        var midX = this.tilesBeforeX + 1;
        var midY = this.tilesBeforeY + 1;

        return {
            midX: midX,
            midY: midY
        };
    };
}

module.exports = ChatClass;