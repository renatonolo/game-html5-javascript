function AccountClass(){
    this.db = null;
    this.uuid = null;

    this.uid = "";
    this.email = "";
    this.facebookID = 0;

    this.setup = function(db, uuid){
        this.db = db;
        this.uuid = uuid;
    };

    this.get = function(req, res, next){
        console.log("Account.get");
        this.uid = req.body.uid || "";
        this.email = req.body.email || "";
        this.facebookID = req.body.facebookID || 0;

        var sql = "SELECT * FROM accounts WHERE uid = '" + this.uid + "' or email = '" + this.email + "' or facebookID = " + this.facebookID;
        this.db.query(sql, this, function(ctx, rows){
            req.account = {};
            if(rows.length == 1){
                req.account = {
                    status: 0,
                    account: rows[0]
                };
            } else {
                req.account = {
                    status: 1,
                    account: {
                        uid: ctx.uid,
                        email: ctx.email,
                        facebookID: ctx.facebookID
                    }
                };
            }
            return next();
        });
    };

    this.insert = function(req, res, next){
        console.log("Account.insert");
        if(req.account.status == 1){
            this.uid = this.uuid.v4();
            this.email = req.body.email || "";
            this.facebookID = req.body.facebookID || 0;

            var sql = "INSERT INTO accounts (uid, email, facebookID) VALUES ('" + this.uid + "', '" + this.email + "', " + this.facebookID + ")";
            this.db.query(sql, this, function(ctx, rows){
                if(rows.affectedRows == 1){
                    req.account = {
                        status: 0,
                        account: {
                            uid: ctx.uid,
                            email: ctx.email,
                            facebookID: ctx.facebookID
                        }
                    };
                } else {
                    req.account = {
                        status: 1,
                        account: {
                            uid: ctx.uid,
                            email: ctx.email,
                            facebookID: ctx.facebookID
                        }
                    };
                }
                return next();
            });
        } else {
            return res.redirect('/status/1');
        }
    };
}

module.exports = AccountClass;