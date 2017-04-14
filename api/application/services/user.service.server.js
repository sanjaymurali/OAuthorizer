/**
 * Created by sanjaymurali on 2/17/17.
 */

module.exports = function (app, userModel) {

    var multer = require('multer');
    var path = require('path');
    var passport = require('passport');

    var bcrypt = require("bcrypt-nodejs");

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, __dirname + '/../../../public/uploads');
        },
        filename: function (req, file, cb) {
            cb(null, path.basename(file.originalname, path.extname(file.originalname)) + "_" + Date.now() + path.extname(file.originalname));
        }
    });

    var upload = multer({storage: storage});

    app.post('/api/login', passport.authenticate('user-local'), login);

    app.post('/api/logout', logout);
    app.get('/api/checksession', checkSessionOrLoggedIn);

    app.post('/api/user', createUser);
    app.post('/api/register', register);
    app.get('/api/user', findUser);
    app.get('/api/user/:userId', findUserById);
    app.put('/api/user/:userId',authenticationMiddleware, updateUser);
    app.delete('/api/user/:userId',authenticationMiddleware, deleteUser);

    //Externally available.
    app.get('/api/oauth/user/:userId', passport.authenticate('code-bearer', {session: false}), findUserByIdOauth);

    app.post("/api/upload", upload.single('file'), checkSessionMiddleware, uploadImage);

    function uploadImage(req, res) {
        userModel.findUserById(req.user._id).then(function(user){
            user.profileimage = "/uploads/" + req.file.filename;
            user.save();
            res.sendStatus(200);
        }, function(err){
            res.sendStatus(500);
        });
    }


    function loggedIn(req, res) {
        var userid = req.query.userid;
        var user = {};
        /*
         This is done inorder to check whether the same user
         is accessing the page requested or not.
         */
        var requserid = !req.user ? "" : req.user._id + "";
        if(req.isAuthenticated() && requserid === userid){
            user = req.user;
            user.password = undefined;
            if(user.secret)
                user.secret = undefined;
            res.status(200).json({success: true, user: user});
        }

        else
            res.status(200).json({success: false})
    }

    function checkSession(req, res) {
        var user = {};
        if(req.isAuthenticated()) {
            user = req.user;
            user.password = undefined;
            res.status(200).json({success: true, user: user});
        }

        else
            res.status(200).json({success: false})
    }

    function login(req, res) {
        var user = req.user;
        /*
         This means that user isnt found, this is done to avoid
         401 unauthorized error, so by replacing done(null, false) with true
         I have made sure that the passport.authenticate middleware doesnt
         send the client a 401 unauthorized. This was getting printed
         in the console of the browser
         */
        if(user === true)
            return res.sendStatus(200);
        res.json({user: user});
    }

    function register(req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);
        userModel
            .createUser(user).then(function(user){
            if(user){
                req.login(user, function(err) {
                    if(err) {
                        res.sendStatus(400);
                    } else {
                        res.status(200).json({user: user});
                    }
                });
            }
        });
    }

    function logout(req, res) {
        req.logOut();
        req.session.destroy();
        res.clearCookie('connect.sid');

        res.sendStatus(200);
    }

    function createUser(req, res) {
        var user = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userType: req.body.userType
        };

        userModel
            .createUser(user)
            .then(function (createduser) {
                res.status(200).json({user: createduser});
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function updateUser(req, res) {
        var updatedUser = req.body;

        if(updatedUser.password)
            updatedUser.password = bcrypt.hashSync(updatedUser.password);

        if(updatedUser.secret)
            updatedUser.secret = bcrypt.hashSync(updatedUser.secret);

        var userId = req.params.userId + "";

        if(updatedUser.clientId){
            // to make sure that no to apps have the same clientId.
            userModel
                .findUserByClientID(updatedUser.clientId)
                .then(function(user){
                    if(!user){
                        userModel.updateUser(userId, updatedUser).then(function(user){
                            res.status(200).json({user: user});
                        }, function (error) {
                            res.sendStatus(500);
                        });
                    }
                    else{
                        res.sendStatus(409)
                    }

                })
        }

        else{
            userModel.updateUser(userId, updatedUser).then(function(user){
                res.status(200).json({user: user});
            }, function (error) {
                res.sendStatus(500);
            });
        }

    }

    function deleteUser(req, res) {
        var userId = req.params.userId;

        userModel.deleteUser(userId).then(function(user){
            res.sendStatus(200);
        }, function(err) {
            res.sendStatus(404);
        });
    }

    function findUserById(req, res) {
        var userId = req.params.userId + "";

        userModel.
        findUserById(userId)
            .then(function (user) {
                user.password = undefined;
                if(user.secret)
                    user.secret = undefined;
                res.status(200).json({user: user});
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function findUserByIdOauth(req, res) {
        if(!req.user)
            res.sendStatus(404);
        else {
            var userIdRequested = req.user._id + "";
            var userId = req.params.userId + "";

            if(userId === userIdRequested) {
                userModel.
                findUserById(userId)
                    .then(function (user) {
                        user.password = undefined;
                        user.registeredApps = undefined;
                        user.updatedAt = undefined;
                        user.dateCreated = undefined;
                        user.userType = undefined;
                        if(user.secret)
                            user.secret = undefined;
                        res.status(200).json({user: user});
                    }, function (err) {
                        res.sendStatus(404);
                    });
            }
            else
                res.sendStatus(404);

        }

    }

    function findUserByCredentials(req, res, next) {
        var username = req.query.username;
        var password = req.query.password;

        userModel
            .findUserByCredentials(username, password)
            .then(function (user) {
                user.password = undefined;
                if(user.secret)
                    user.secret = undefined;
                res.status(200).json({user: user});
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function findUserByUsername(req, res) {
        var username = req.query.username;

        userModel
            .findUserByUsername(username)
            .then(function (user) {
                if(!user)
                    res.sendStatus(200);
                else {
                    user.password = undefined; // This is to make sure that password isnt sent
                    if(user.secret)
                        user.secret = undefined;
                    res.status(200).json({user: user});
                }
            }, function (err) {
                res.sendStatus(200);
            });
    }

    function findUsersByType(req, res) {
        var usertype = req.query.usertype + "";

        userModel
            .findUsersByType(usertype)
            .then(function (users) {
                if(!users || users.length === 0)
                    res.sendStatus(200);
                else {
                    users.map(function(user){
                        user.password = undefined;
                        if(user.secret)
                            user.secret = undefined;
                    });

                    res.status(200).json({users: users});
                }
            }, function (err) {
                res.sendStatus(200);
            });
    }


    function findUser(req, res) {
        if(req.query.usertype)
            findUsersByType(req, res);
        else {
            if (req.query.username && req.query.password)
                findUserByCredentials(req, res);
            else
                findUserByUsername(req, res);
        }
    }

    function checkSessionOrLoggedIn(req, res) {
        if(req.query.userid)
            loggedIn(req, res);
        else
            checkSession(req,res);
    }

    function authenticationMiddleware(req, res, next) {

        var userid = req.params.userId;
        /*
         This is done inorder to check whether the same user
         is accessing the page requested or not.
         */
        var requserid = !req.user ? "" : req.user._id + "";
        if(req.isAuthenticated() && requserid === userid)
            next();
        else
            return res.json({loggedin: false});
    }

    function checkSessionMiddleware(req, res, next) {
        if(req.isAuthenticated())
            next();
        else
            return res.json({loggedin: false});
    }

};