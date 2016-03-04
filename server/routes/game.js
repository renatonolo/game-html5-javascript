exports.login = function(req, res){
    res.redirect('/game');
};

exports.start = function(req, res){
    req.facebook.api('/me?fields=email,name', function(err, user) {
        if(err || !user || !user.id){
            res.redirect('/');
        } else {
            user.provider = "facebook";
            console.log(user);
            res.render('index', {user: user});
            //res.redirect('/game');
        }
    });
};