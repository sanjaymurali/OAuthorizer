/**
 * Created by sanjaymurali on 3/20/17.
 */

module.exports = function () {

    var codeModel = require('./code/code.model.server');
    var tokenModel = require('./token/token.model.server');

    var model = {
        codeModel: codeModel(),
        tokenModel: tokenModel()
    };

    return model;
};