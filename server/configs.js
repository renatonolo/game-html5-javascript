module.exports = {

    'facebookAuth' : {
        //'clientID'      : '1079292658783779', // your App ID
        //'clientSecret'  : '2580e1a92213e29588e1cb43110a1879', // your App Secret
        'clientID'      : '1079587235420988', // your App ID
        'clientSecret'  : '5a11268ca1cef3b222d90a5e86d40566', // your App Secret
        'callbackURL'   : 'http://localhost:8000/auth/facebook/callback',
        'appNamespace'  : 'Game­H­T­M­L­5­Test'
    },

    'server': {
        'ipaddress': process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1",
        'port': process.env.OPENSHIFT_NODEJS_PORT || 8000,

        'mapsPath': __dirname + '/maps/map.json',
        'tilesBeforeX': 11,
        'tilesBeforeY': 6,
        'tilesAfterX': 13,
        'tilesAfterY': 8
    },

    'mysql': {
        'host': process.env.OPENSHIFT_MYSQL_DB_HOST || "127.0.0.1",
        'port': process.env.OPENSHIFT_MYSQL_DB_PORT || "3306",
        'username': 'root',
        'password': 'xxxxxx',
        'database': 'gameHTML5'
        //'username': 'admin1Dc4G2u',
        //'password': 'HVXQEb8Dv_F8',
        //'database': 'gamehtml5'
    }
};
