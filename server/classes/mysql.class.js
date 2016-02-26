function MysqlClass(){

    this.mysql = null;
    this.connection = null;

    this.connect = function(host, port, username, password, database){
        this.connection = this.mysql.createConnection({
            host: host,
            port: port,
            user: username,
            password: password,
            database: database
        });

        this.connection.connect();
        console.log("Mysql connected...");
    };

    this.query = function(query, ctx, callback, args){
        this.connection.query(query, function(err, rows, fields){
            if(typeof callback == "function") callback(ctx, rows, args);
        });
    };
};

module.exports = MysqlClass;