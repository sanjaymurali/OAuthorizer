/**
 * Created by sanjaymurali on 2/17/17.
 */

module.exports = function (app) {

    var userModels = require('./application/model/models.server.js')();

    var oauthModels = require('./oauth-server/model/models.server.js')();

    require("./oauth-server/services/authentication.service.server.js")(userModels.userModel, oauthModels.tokenModel);

    require("./application/services/user.service.server.js")(app, userModels.userModel);
    require("./application/services/comment.service.server.js")(app, userModels.commentModel);

    require("./oauth-server/services/oauth.server.js")(app, userModels.userModel, oauthModels.codeModel, oauthModels.tokenModel);

};