/**
 * Created by sanjaymurali on 4/10/17.
 */

module.exports = function (app, userModel, codeModel, tokenModel) {

    var oauth2orize = require('oauth2orize');

    var passport = require('passport');

    var server = oauth2orize.createServer();

    server.serializeClient(serializeClient);
    server.deserializeClient(deserializeClient);

    app.get('/api/oauth2/authorize', server.authorization(authorizationForServer), authorizeServer);
    app.post('/api/oauth2/authorize', server.decision());

    app.post('/api/oauth2/token', passport.authenticate('client-basic', {session: false}), server.token(), server.errorHandler());


    function authorizeServer(req, res) {
        res.json({transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client});
    }

    /*
     The Grant method helps us generate a mechanism in which the
     user can either choose to "Allow" or "Deny" the request for a client
     to access their data. When the user "Allows" the client, an authorization code
     is generated and is registered in the database.
     This authorization code must be exhanged for an access token.
     */
    server.grant(oauth2orize.grant.code(function (client, redirectUri, user, ares, callback) {

        var code = {
            authCode: Date.now() + "", //make it regenerating using Date.now
            clientId: client._id + "",
            redirectUri: redirectUri,
            userId: user._id + ""
        };

        codeModel.createCode(code).then(function (response) {
            callback(null, response.authCode);
        }, function (err) {
            return callback(err);
        });
    }));

    /*
     The authorization code we recieved, is just to make sure that the user has allowed
     us to access their information, to access their information in our server (us being the
     resource owner), an access token is needed.
     The authorization code is exchanged for an access token, the access token contains
     information such as the authorizing user's username.
     */
    server.exchange(oauth2orize.exchange.code(function (client, code, redirectUri, callback) {
        var clientid = client._id + "";

        codeModel.findAuthByClientId(clientid).then(function (authCode) {

            if (authCode === undefined || authCode === null) {
                // cancel the exchange process, if such an client doesnt exists.
                return callback(null, false);
            }
            if ((client._id + "") !== (authCode.clientId + "")) {
                // This is to make sure that same client is requesting access token
                return callback(null, false);
            }
            if (redirectUri !== authCode.redirectUri) {
                // if the redirectUri isnt the same, it denotes a positive attack, stop it!
                return callback(null, false);
            }

            var authCodeid = authCode._id + "";

            // As the authCode is used, we delete it immediately
            codeModel.deleteCode(authCodeid).then(function (res) {

                var token = {
                    accessToken: Date.now() + "",
                    clientId: authCode.clientId + "",
                    userId: authCode.userId + ""
                };

                /*
                 Create a new Access token for client authorization when accessing
                 api endpoints
                 */
                tokenModel
                    .createToken(token)
                    .then(function (token) {
                        callback(null, token);
                    }, function (err) {
                        return callback(err);
                    });

            }, function (err) {
                return callback(err);
            });
        }, function (err) {
            return callback(err);
        });
    }));


    function authorizationForServer(clientId, redirectUri, callback) {
        clientId += "";
        userModel
            .findUserById(clientId)
            .then(function (user) {
                callback(null, user, redirectUri);
            }, function (err) {
                return callback(err);
            });
    }


    function serializeClient(client, callback) {
        return callback(null, client._id);
    }

    function deserializeClient(id, callback) {
        // This gives us the user details of the app-owner
        id += "";
        userModel.findUserById(id).then(function (user) {
            if (user.userType === "appOwner")
                callback(null, user);
            else
                callback(null, false);
        }, function (err) {
            return callback(err);
        });

    }


}