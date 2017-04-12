/**
 * Created by sanjaymurali on 4/10/17.
 */

module.exports = function(app, userModel, codeModel, tokenModel) {



/*    var userModel = require('../../assignment/model/models.server')().userModel;
    var codeModel = require('../model/models.server')().codeModel;
    var tokenModel = require('../model/models.server')().tokenModel;*/

    var oauth2orize = require('oauth2orize');

    var passport = require('passport');

    var server = oauth2orize.createServer();

    server.serializeClient(function(client, callback) {
        return callback(null, client._id);
    });


    server.deserializeClient(function(id, callback) {
        // This gives us the user details of the app-owner
        id += "";
        userModel.findUserById(id).then(function(user){
            if(user.userType === "appOwner")
                callback(null, user);
            else
                callback(null, false);
        }, function(err) {
            return callback(err);
        });

    });

    // Register authorization code grant type
    server.grant(oauth2orize.grant.code(function(client, redirectUri, user, ares, callback) {
        // Create a new authorization code
        console.log("Grant: Client: ", client);
        var code = {
            authCode: "alwayssame", //make it regenerating using Date.now
            clientId: client._id + "",
            redirectUri: redirectUri,
            userId: user._id + ""
        };

        // Save the auth code and check for errors
        codeModel.createCode(code).then(function(response) {
                callback(null, response.authCode);
            }, function(err) {
                return callback(err);
        });
    }));

    // Exchange authorization codes for access tokens
    server.exchange(oauth2orize.exchange.code(function(client, code, redirectUri, callback) {
        console.log("Inside exchange", code)

        console.log("Client: ", client);

        var x = client._id + "";

        codeModel.findAuthByClientId(x).then(function (authCode) {
            console.log("AuthCode: ", authCode);

            //console.log(redirectUri !== authCode.redirectUri)
            if (authCode === undefined) { return callback(null, false); }
            if (client._id.toString() !== authCode.clientId + "") { return callback(null, false); }
            if (redirectUri !== authCode.redirectUri) { return callback(null, false); }

            // Delete auth code now that it has been used
            authCode.remove(function (err) {
                console.log("Error: ", err);
                if(err) { return callback(err); }

                // Create a new access token
                var token = {
                    authCode: "alwayssame",
                    clientId: authCode.clientId + "",
                    userId: authCode.userId + ""
                };

                console.log("token; ", token);

                // Save the access token and check for errors
                tokenModel
                    .createToken(token)
                    .then(function (token) {

                    callback(null, token);
                }, function(err){
                        if (err) { return callback(err); }
                    });
            });
        }, function(err){
            if (err) { return callback(err); }
        });
    }));

// User authorization endpoint

   function somefunction(clientId, redirectUri, callback) {
       console.log("somefunc: ", clientId);
       clientId += "";
        userModel
            .findUserById(clientId)
            .then(function(user){
                callback(null, user, redirectUri);
            }, function (err) {

            if (err) { return callback(err); }

        });
    }


    function responsefunc(req, res){
       console.log("Hit!");
       console.log("req.user: ", req.user);
       console.log("req.oauth2.client: ", req.oauth2.client);
        res.render('dialog', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
    }


    app.get('/api/oauth2/authorize', server.authorization(somefunction), responsefunc);
    app.post('/api/oauth2/authorize', server.decision());

    app.post('/api/oauth2/token', passport.authenticate('client-basic', {session: false}), server.token(), server.errorHandler());

}



