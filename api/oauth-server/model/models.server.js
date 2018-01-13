/***
 * This file acts as hub for the OAuth 2.0 Server
 * @returns {{codeModel: api, tokenModel: api}}
 */
module.exports = function () {

    var codeModel = require('./code/code.model.server'); // Code Model for Authorization codes
    var tokenModel = require('./token/token.model.server'); // Token Model for obtaining access token for user's info

    var model = {
        codeModel: codeModel(),
        tokenModel: tokenModel()
    };

    return model;
};