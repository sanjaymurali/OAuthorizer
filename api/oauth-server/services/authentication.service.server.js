/**
 * Created by sanjaymurali on 4/2/17.
 */
module.exports = function (userModel, tokenModel) {

    var passport = require('passport');
    var bcrypt = require("bcrypt-nodejs");

    // For normal user login
    var LocalStrategy = require('passport-local').Strategy;

    // For client authentication.
    var BasicStrategy = require('passport-http').BasicStrategy;

    // For authorization code exchange for access token
    var BearerStrategy = require('passport-http-bearer').Strategy;


    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);


    passport.use('client-basic', new BasicStrategy(basicStrategy));
    passport.use('code-bearer', new BearerStrategy(bearerStrategy));
    passport.use('user-local', new LocalStrategy(localStrategy));

    function localStrategy(username, password, done) {

        userModel
            .findUserByUsername(username)
            .then(function (user) {
                    if (!user) {
                        return done(null, false);
                    }
                    else {
                        if(user.username === username && bcrypt.compareSync(password, user.password)) {
                            return done(null, user);
                        } else {
                            return done(null, false);
                        }
                    }
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                });
    }

    function basicStrategy(username, password, callback) {
        userModel.findUserByClientID(username).then(function (client) {

            if (!client) {
                return callback(null, false);
            }
            else {

                if(client.clientId === username && bcrypt.compareSync(password, client.secret)) {
                    return callback(null, client);
                } else {
                    return callback(null, false);
                }
            }
        }, function (err) {
            return callback(err);
        });
    }

    function bearerStrategy(accessToken, callback) {

        var access_Token = accessToken + "";
        tokenModel.findUserByAccessToken(access_Token).then(function (token) {
            if (!token) {
                return callback(null, false);
            }
            else {
                var userId = token.userId + "";

                userModel.findUserById(userId).then(function (user) {
                    if (!user) {
                        return callback(null, false);
                    }
                    else {
                        callback(null, user, {scope: '*'});
                    }

                }, function (err) {
                    return callback(err);
                });
            }
        }, function (err) {
            return callback(err);
        });
    }


    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {

        userModel.findUserById(user._id).then(function (user) {
            if (user)
                done(null, user);
            else
                done(null, null);
        }, function (err) {
            done(err, null);
        });
    }

};