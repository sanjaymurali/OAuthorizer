/**
 *
 * @returns {string} which is the connection URL to the MongoDB
 */
module.exports = function() {

	var connectionString = 'mongodb://127.0.0.1:27017/webdev-project'; //Local connectionString

	if (process.env.MLAB_USERNAME) {
		connectionString = 'mongodb://'+process.env.MLAB_USERNAME + ":" +
			process.env.MLAB_PASSWORD + "@" +
			process.env.MLAB_HOST + ':' +
			process.env.MLAB_PORT + '/' +
			process.env.MLAB_APP_NAME;
	}

	return connectionString;
}