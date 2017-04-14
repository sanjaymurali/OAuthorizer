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

    app.get('/api/admin/checksession', checkSession);

    app.get('/api/admin/allusers', authenticationMiddleware, findAllUsers);
    app.get('/api/admin/user/:userid', authenticationMiddleware, findUserById);
    app.post('/api/admin/user', authenticationMiddleware, createUser);
    app.delete('/api/admin/user/:userId', authenticationMiddleware, deleteUser);
    app.put('/api/admin/user/:userId', authenticationMiddleware, updateUser);

    app.post("/api/admin/upload/:userid", authenticationMiddleware, upload.single('file'), uploadImage);

    function uploadImage(req, res) {
        var userid = req.params.userid + "";
        userModel.findUserById(userid).then(function(user){
            user.profileimage = "/uploads/" + req.file.filename;
            user.save();
            res.sendStatus(200);
        }, function(err){
            res.sendStatus(500);
        });
    }

    function findAllUsers(req, res) {
        userModel.allUsers().then(function(resp){

            var index = resp.indexOf(resp.find(function(user){
                return user.userType === "admin";
            }));

            resp.splice(index, 1);

            resp.map(function(user){
                user.password = undefined;
                if(user.secret)
                    user.secret = undefined;
            });

            res.json({users: resp});
        })
    }

    function createUser(req, res) {


        var user = {
            username: req.body.username,
            password: req.body.password,
            userType: req.body.userType
        };

        user.password = bcrypt.hashSync(user.password);

        userModel
            .createUser(user)
            .then(function (createduser) {
                res.sendStatus(200);
            }, function (err) {
                res.sendStatus(404);
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
        var userId = req.params.userid + "";
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

    function checkSession(req, res) {
        var user = {};
        var userType = !req.user ? "" : req.user.userType + "";
        if(req.isAuthenticated() && userType === "admin") {
            user = req.user;
            user.password = undefined;
            res.status(200).json({success: true, user: user});
        }
        else
            res.status(200).json({success: false})
    }

    function authenticationMiddleware(req, res, next) {

        var userid = req.params.userId;
        /*
         This is done inorder to check whether the same user
         is accessing the page requested or not.
         */
        var userType = !req.user ? "" : req.user.userType + "";
        if(req.isAuthenticated() && userType === "admin")
            next();
        else
            return res.json({loggedin: false});
    }


};