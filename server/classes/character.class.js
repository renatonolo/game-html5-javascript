function PlayerClass(){

    this.ws = null;
    this.wss = null;
    this.db = null;

    this.uid = "";
    this.name = "";
    this.level = 1;
    this.sex = 1;
    this.vocation = 0;
    this.position = {};
    this.position.x = 51;
    this.position.y = 49;

    this.setup = function(db, wss){
        this.db = db;
        this.wss = wss;
    };

    this.loadCharacters = function(ws, x, y){
        this.ws = ws;

        var screenTileW = 25,
            screenTileH = 15;
        
        var midX = Math.round(screenTileW / 2);
        var midY = Math.round(screenTileH / 2);

        var limitXMin = x - midX + 1;
        var limitXMax = x + midX - 1;

        var limitYMin = y - midY + 1;
        var limitYMax = y + midY - 1;
        
        var sql = "SELECT * FROM players WHERE position_x >= " + limitXMin + 
                    " AND position_x <= " + limitXMax + 
                    " AND position_y >= " + limitYMin + 
                    " AND position_y <= " + limitYMax + 
                    " AND online = 1";
        this.db.query(sql, this, this.loadCharactersCallback);
    };

    this.loadCharactersCallback = function(ctxCharacter, rows){
        var character = [];
        var characters = {
            status: "Not found"
        };
        
        if(rows.length > 0){
            for(var i = 0; i < rows.length; i++){
                character[i] = {
                    uid: rows[i].uid,
                    name: rows[i].name,
                    level: rows[i].level,
                    sex: rows[i].sex, //0 = female, 1 = male
                    vocation: rows[i].vocation, //0 for beginner
                    position: {
                        x: rows[i].position_x,
                        y: rows[i].position_y,
                        direction: rows[i].direction
                    }
                };
            }
        }

        var response = {
            action: "loadCharactersResponse",
            data: character
        };

        ctxCharacter.ws.send(JSON.stringify(response));
    };

    this.refreshCharacter = function(uid){
        this.db.query("SELECT * FROM players WHERE uid = '" + uid + "'", this, this.refreshCharacterCallback);
    };

    this.refreshCharacterCallback = function(ctxCharacter, rows){
        var character = {
            status: "Not found"
        };
        
        if(rows.length == 1){
            if(rows[0].walking == 0) return;
            
            character = {
                uid: rows[0].uid,
                name: rows[0].name,
                level: rows[0].level,
                sex: rows[0].sex, //0 = female, 1 = male
                vocation: rows[0].vocation, //0 for beginner
                position: {
                    x: rows[0].position_x,
                    y: rows[0].position_y,
                    direction: rows[0].direction
                }
            };
        }

        var response = {
            action: "refreshCharacterResponse",
            data: character
        };

        //console.log(response);

        ctxCharacter.wss.broadcast(JSON.stringify(response));
    };
}

module.exports = PlayerClass;