/***
 * This file acts as an hub for the API server
 * @param app is the instance of express
 */
module.exports = function (app) {
    var userModels = require('./application/model/models.server.js')(); // All the user related models
    var oauthModels = require('./oauth-server/model/models.server.js')(); // All the OAuth 2.0 Server related models

	// Setup the OAuth 2.0 Server
    require("./oauth-server/services/authentication.service.server.js")(userModels.userModel, oauthModels.tokenModel);
	require("./oauth-server/services/oauth.server.js")(app, userModels.userModel, oauthModels.codeModel, oauthModels.tokenModel);

	// Setup User Profiles and Comments
	require("./application/services/user.service.server.js")(app, userModels.userModel);
    require("./application/services/admin.service.server.js")(app, userModels.userModel);
    require("./application/services/comment.service.server.js")(app, userModels.commentModel);

};