function PlayerClass(){

    this.ws = null;
    this.db = null;

    this.uid = "";
    this.account = 0;
    this.password = "";
    this.name = "";
    this.level = 1;
    this.sex = 1;
    this.vocation = 0;
    this.skills = {};
    this.skills.melee = 1;
    this.skills.sword = 1;
    this.skills.shield = 1;
    this.equips = {};
    this.equips.helmet = 0;
    this.equips.armor = 0;
    this.equips.legs = 0;
    this.equips.boots = 0;
    this.equips.leftHand = 0;
    this.equips.rightHand = 0;
    this.position = {};
    this.position.x = 51;
    this.position.y = 49;

    this.setup = function(db){
        this.db = db;
    };

    this.loadPlayer = function(ws, account, password){
        this.ws = ws;
        this.db.query("SELECT * FROM players WHERE account = " + account, this, this.loadPlayerCallback);
    };

    this.loadPlayerCallback = function(ctxPlayer, rows){
        var player = {
            status: "Player not found"
        };

        if(rows.length == 1){
            player = {
                uid: rows[0].uid,
                name: rows[0].name,
                level: rows[0].level,
                sex: rows[0].sex, //0 = female, 1 = male
                vocation: rows[0].vocation, //0 for beginner
                skills: {
                    melee: rows[0].skills_melee,
                    sword: rows[0].skills_sword,
                    shield: rows[0].skills_shield
                },
                equips: {
                    helmet: rows[0].equips_helmet,
                    armor: rows[0].equips_armor,
                    legs: rows[0].equips_legs,
                    boots: rows[0].equips_boots,
                    leftHand: rows[0].equips_left_hand,
                    rightHand: rows[0].equips_right_hand
                },
                position: {
                    x: rows[0].position_x,
                    y: rows[0].position_y
                }
            };
            ctxPlayer.ws.uidPlayer = rows[0].uid;
        }

        var response = {
            action: "loadPlayerResponse",
            data: player
        };

        ctxPlayer.ws.send(JSON.stringify(response));
    };

    this.updatePosition = function(account, x, y, walking, direction){
        if(walking) walking = 1;
        else walking = 0;
        this.db.query("UPDATE players SET position_x = " + x + ", position_y = " + y + ", walking = " + walking + ", direction = '" + direction + "' WHERE account = " + account, null, null);
    };
}

module.exports = PlayerClass;