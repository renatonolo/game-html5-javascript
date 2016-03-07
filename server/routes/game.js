exports.login = function(req, res){
    res.redirect('/game');
};

exports.game = function(account, req, res){
    req.facebook.api('/me?fields=email,name', function(err, user) {
        if(err || !user || !user.id){
            res.redirect('/');
        } else {
            req.body = {
                facebookID: user.id
            };

            account.get(req, res, function(){
                if(req.account && req.account.status == 1){
                    res.redirect("/create/" + user.id);
                } else {
                    res.redirect("/start/" + req.account.account.uid);
                }
            });

            //user.provider = "facebook";
            //res.render('index', {user: user});
        }
    });
};

exports.create = function(req, res){
    res.render('create', {facebookID: req.params.facebookID});
};

exports.renderCreate = function(req, res){
    if(req.account_players && req.account_players.status == 0){
        console.log("Account created!");
    } else {
        console.log("Error to create account.");
    }
    return res.redirect('/status/' + req.account_players.status);
};

exports.renderStart = function(req, res){
    console.log(req.players);
    return res.render("index", {players: req.players});
}