function Websocket(host, port){

    this.host = host;
    this.port = port;
    this.ws = null;

    //Callbacks
    this.callbackMapResponse = null;
    this.ctxMapResponse = null;

    this.callbackLoadPlayerResponse = null;
    this.ctxLoadPlayerResponse = null;
    
    this.callbackCheckTileInfoResponse = null;
    this.ctxCheckTileInfoResponse = null;

    this.callbackLoadCharactersResponse = null;
    this.ctxLoadCharactersResponse = null;

    this.callbackRefreshCharacter = null;
    this.ctxRefreshCharacter = null;

    this.callbackChatMessageResponse = null;
    this.ctxChatMessageResponse = null;

    this.connect = function(ctx, callback){
        var self = this;
        var url = 'ws://' + this.host + ':' + this.port + '/';
        this.ws = new WebSocket(url);

        this.ws.onopen = function(){
            callback(ctx);
        };

        this.ws.onmessage = function(e){
            var data = JSON.parse(e.data);
            self.handleMessages(data);
        }
    };

    this.handleMessages = function(data){
        if(data.action != undefined){
            switch(data.action){
                case "mapResponse":
                    this.callbackMapResponse(this.ctxMapResponse, data);
                    break;
                case "loadPlayerResponse":
                    this.callbackLoadPlayerResponse(this.ctxLoadPlayerResponse, data);
                    break;
                case "checkTileInfoResponse":
                    this.callbackCheckTileInfoResponse(this.ctxCheckTileInfoResponse, data);
                    break;
                case "loadCharactersResponse":
                    this.callbackRefreshCharacter(this.ctxRefreshCharacter, data);
                    break;
                case "refreshCharacterResponse":
                    this.callbackRefreshCharacter(this.ctxRefreshCharacter, data);
                    break;
                case "chatMessageResponse":
                    this.callbackChatMessageResponse(this.ctxChatMessageResponse, data);
                    break;
            }
        }
    };

    this.sendMessage = function(action){
        this.ws.send(action);
    }
}