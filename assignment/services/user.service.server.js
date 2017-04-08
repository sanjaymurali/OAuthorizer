/**
 * Created by sanjaymurali on 2/17/17.
 */

module.exports = function (app, userModel) {

    /*
       have a nav menu item in the model, have a set of items that need to
       go in there based on appowner or user.
       implement a service that retrieves the menu items based on user id and
       create a nav bar directive that populates from the service.
     */

    //TODO: create bcrypt passwords!

    var multer = require('multer');
    var path = require('path');
    var passport = require('passport');

    var LocalStrategy = require('passport-local').Strategy;

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, __dirname + '/../../public/uploads');
        },
        filename: function (req, file, cb) {
            cb(null, path.basename(file.originalname, path.extname(file.originalname)) + "_" + Date.now() + path.extname(file.originalname));
        }
    });

    var upload = multer({storage: storage});

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);
    passport.use(new LocalStrategy(localStrategy));

    app.post('/api/login',passport.authenticate('local'), login);
    app.post('/api/logout', logout);
    app.get('/api/checksession', checkSessionOrLoggedIn);

    app.post('/api/user', createUser);
    app.post('/api/register', register);
    app.get('/api/user', findUser);
    app.get('/api/user/:userId', findUserById);
    app.put('/api/user/:userId',authenticationMiddleware, updateUser);
    app.delete('/api/user/:userId',authenticationMiddleware, deleteUser);

    app.post("/api/upload", upload.single('file'), checkSessionMiddleware, uploadImage);

    function uploadImage(req, res) {
        userModel.findUserById(req.user._id).then(function(user){
            console.log(req.file.filename);
            user.profileimage = "/uploads/" + req.file.filename;
            user.save();
            res.sendStatus(200);
        }, function(err){
            res.sendStatus(500);
        });
    }


    function loggedIn(req, res) {
        var userid = req.query.userid;
        /*
         This is done inorder to check whether the same user
         is accessing the page requested or not.
         */
        var requserid = !req.user ? "" : req.user._id + "";
        if(req.isAuthenticated() && requserid === userid)
            res.status(200).json({success: true, user: req.user});
        else
            res.status(200).json({success: false})
    }

    function checkSession(req, res) {
        if(req.isAuthenticated())
            res.status(200).json({success: true, user: req.user});
        else
            res.status(200).json({success: false})
    }

    function login(req, res, next) {
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
        var userId = req.params.userId + "";
        userModel.updateUser(userId, req.body).then(function(user){
            res.status(200).json({user: user});
        }, function (error) {
            res.sendStatus(500);
        });

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
                res.status(200).json({user: user});
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function findUserByCredentials(req, res, next) {
        var username = req.query.username;
        var password = req.query.password;
        
        userModel
            .findUserByCredentials(username, password)
            .then(function (user) {
                user.password = undefined;
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
                    res.status(200).json({user: user});
                }
            }, function (err) {
                res.sendStatus(200);
            });
    }

    function findUser(req, res) {
        if (req.query.username && req.query.password)
            findUserByCredentials(req, res);
        else
            findUserByUsername(req, res);
    }

    function checkSessionOrLoggedIn(req, res) {
        if(req.query.userid)
            loggedIn(req, res);
        else
            checkSession(req,res);
    }

    // Passport and Session

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
                    if(!user) {
                        return done(null, true);
                    }
                    else {
                        if(user.username === username && user.password === password) {
                            return done(null, user);
                        } else {
                            return done(null, false);
                        }
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                });
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