/**
 * Created by sanjaymurali on 4/2/17.
 */
module.exports = function () {

    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);
    passport.use(new LocalStrategy(localStrategy));

    passport.authenticate('local', function(err, user, info) {
        console.log(user)
        if (err) {
            return next(err); // will generate a 500 error
        }
        // Generate a JSON response reflecting authentication status
        if (! user) {
            return res.status(200).json({success : false, message : 'authentication failed' });
        }
        // ***********************************************************************
        // "Note that when using a custom callback, it becomes the application's
        // responsibility to establish a session (by calling req.login()) and send
        // a response."
        // Source: http://passportjs.org/docs
        // ***********************************************************************
        req.login(user, function(loginErr) {
            if (loginErr) {
                return next(loginErr);
            }
            return res.status(200).json({user: user});
        });
    });

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        userModel
            .findUserById(user._id)
            .then(
                function(user){
                    if(user)
                        done(null, user);
                    else
                        done(null, null);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    function localStrategy(username, password, done) {

        userModel
            .findUserByCredentials(username, password)
            .then(
                function(user) {
                    if(user) {
                        if(user.username === username && user.password === password) {
                            return done(null, user);
                        } else {
                            return done(null, false);
                        }
                    }
                    else
                        return done(null, false);
                },
                function(err) {
                    if (err) { return done(err); }
                });
    }

};