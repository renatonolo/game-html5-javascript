function Chat(){
    this.ws = null;
    this.inputTextChat = null;
    this.textAreaChat = null;
    this.map = null;
    this.player = null;
    this.characters = {};

    this.setup = function(ws, inputTextChat, textAreaChat, map, player, characters){
        this.ws = ws;
        this.inputTextChat = inputTextChat;
        this.textAreaChat = textAreaChat;
        this.map = map;
        this.player = player;
        this.characters = characters;

        var self = this;

        this.inputTextChat.addEventListener("keypress", function(e){
            if(e.keyCode == 13){
                self.sendChatMessage();
            }
        });

        this.ws.callbackChatMessageResponse = this.callbackChatMessageResponse;
        this.ws.ctxChatMessageResponse = this;
    };

    this.sendChatMessage = function(){
        var msg = this.inputTextChat.value;
        this.inputTextChat.value = "";
        if(msg != ""){
            if(msg.length > 150){
                this.player.statusText = "Too long text. Limit 150 caracteres.";
            } else {
                var request = {
                    action: 'sendChatMessage',
                    x: this.map.position.x,
                    y: this.map.position.y,
                    message: msg,
                    uid: this.player.uid
                };
                this.ws.sendMessage(JSON.stringify(request));
            }
        }
    };

    this.callbackChatMessageResponse = function(ctxChat, data){
        if(ctxChat.player.uid == data.from){
            ctxChat.textAreaChat.value += "\nMe: " + data.message;
            ctxChat.player.chatMessage = data.message;
        } else {
            var char = ctxChat.characters[data.from];
            ctxChat.textAreaChat.value += "\n" + char.name + ": " + data.message;
            char.chatMessage = data.message;
        }
        ctxChat.textAreaChat.scrollTop = ctxChat.textAreaChat.scrollHeight;
    };
}