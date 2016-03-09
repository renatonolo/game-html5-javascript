function PlayerClass(){

    this.ws = null;
    this.db = null;
    this.uuid = null;

    this.uid = "";
    this.accountUid = "";
    this.facebookID = 0;
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

    this.setup = function(db, uuid){
        this.db = db;
        this.uuid = uuid;
    };

    this.insert = function(req, res, next){
        console.log("Player.insert");
        if(req.account.status == 0){
            this.uid = this.uuid.v4();
            this.name = req.body.name || "";
            
            var sql = "INSERT INTO players (uid, name) VALUES ('" + this.uid + "', '" + this.name + "')";
            this.db.query(sql, this, function(ctx, rows){
                if(rows.affectedRows == 1){
                    req.player = {
                        status: 0,
                        player: {
                            uid: ctx.uid,
                            name: ctx.name
                        }
                    };
                } else {
                    req.player = {
                        status: 1,
                        player: {
                            uid: ctx.uid,
                            name: ctx.name
                        }
                    };
                }
                return next();
            });
        } else {
            return next();
        }
    };

    this.associateWithAccount = function(req, res, next){
        console.log("Player.associateWithAccount");
        if(req.account && req.account.status == 0 && req.player && req.player.status == 0){
            this.accountUid = req.account.account.uid;
            this.uid = req.player.player.uid;
            
            var sql = "INSERT INTO account_players (account, player) VALUES ('" + this.accountUid + "', '" + this.uid + "')";
            this.db.query(sql, this, function(ctx, rows){
                if(rows.affectedRows == 1){
                    req.account_players = {
                        status: 0,
                        account_players: {
                            account: ctx.accountUid,
                            player: ctx.uid
                        }
                    };
                } else {
                    req.account_players = {
                        status: 1,
                        account_players: {
                            account: ctx.accountUid,
                            player: ctx.uid
                        }
                    };
                }
                return next();
            });
        } else {
            return next();
        }
    };

    this.getByAccount = function(req, res, next){
        this.accountUid = req.params.accountUid || "";

        var sql = "SELECT p.* FROM players AS p INNER JOIN account_players AS ap ON p.uid = ap.player WHERE ap.account = '" + this.accountUid + "'";
        this.db.query(sql, this, function(ctx, rows){
            if(rows.length > 0){
                req.players = rows;
                return next();
            } else {
                return res.redirect('/status/3');
            }
        });
    }

    this.loadPlayer = function(ws, playerUid){
        this.ws = ws;

        var sql = "SELECT * FROM players WHERE uid = '" + playerUid + "'";
        this.db.query(sql, this, this.loadPlayerCallback);
    };

    this.loadPlayerCallback = function(ctxPlayer, rows){
        var player = {
            status: "Player not found"
        };

        if(rows.length == 1){
            var sql = "UPDATE players SET online = 1 WHERE uid = '" + rows[0].uid + "'";
            ctxPlayer.db.query(sql, null, null);
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

    this.logoff = function(uid){
        var sql = "UPDATE players SET online = 0 WHERE uid = '" + uid + "'";
        this.db.query(sql, null, null);
    }

    this.updatePosition = function(uid, x, y, walking, direction){
        if(walking) walking = 1;
        else walking = 0;
        this.db.query("UPDATE players SET position_x = " + x + ", position_y = " + y + ", walking = " + walking + ", direction = '" + direction + "' WHERE uid = '" + uid + "'", null, null);
    };
}

module.exports = PlayerClass;