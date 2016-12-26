//
//  MASPluginUser.js
//


/**
* MASPluginUser : This function is an extension of MASPluginUser from MASFoundation, with added functionalities for messaging.
* The messaging functionalities are bound with MAG MQTT message broker only. To connect and message using other host
* use MASConnectaPlugin.MASPublicBroker.
*/
var MASPluginUser = require("cordova-plugin-mas-core.MASPluginUser");
{
	/**
	 * Subscribe (starts Listening) to a particular topic.
	 *
	 * @param topicName : The topic on which the user needs to subscribe.
	 */
	 MASPluginUser.prototype.startListeningToTopic = function(successHandler, errorHandler, topicName) {
	 	return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "startListeningToTopic", [topicName]);
	 };

	/**
	 * Unsubscribe (stop Listening) to a particular topic.
	 *
	 * @param topicName : The topic on which the user needs to unsubscribe.
	 */
	 MASPluginUser.prototype.stopListeningToTopic = function(successHandler, errorHandler, topicName) {
	 	return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "stopListeningToTopic", [topicName]);
	 };

	/**
	 * Subscribe (starts Listening) to user's own custom topic. Topic name defaults to userid of the logged in user.
	 *
	 */
	 MASPluginUser.prototype.startListeningToMyMessages = function(successHandler, errorHandler) {
	 	return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "startListeningToMyMessages", []);
	 };

	 /**
	 * Unsubscribe (stop Listening) to user's own custom topic. Topic name defaults to userid of the logged in user.
	 *
	 */
	 MASPluginUser.prototype.stopListeningToMyMessages = function(successHandler, errorHandler, topicName) {
	 	return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "stopListeningToMyMessages", []);
	 };

	/**
	 * Send message to a topic
	 *
	 * @param topicName : The topic on which the user needs to send the message.
	 * @param message : The message to be send.
	 * @param contentType : The mime type of the message to be send. Choose from MASConnectaContentType.
	 */
	 MASPluginUser.prototype.sendMessageToTopic = function(successHandler, errorHandler, topicName,message,contentType) {
	 	return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "sendMessageToTopic", [topicName,message,contentType]);
	 };

	 /**
	 * Send message to a user
	 *
	 * @param userName : The user's name to whom you need to send the message.
	 * @param message : The message to be send.
	 * @param contentType : The mime type of the message to be send. Choose from MASConnectaContentType.
	 */
	 MASPluginUser.prototype.sendMessageToUser = function(successHandler, errorHandler, userName,message,contentType) {
	 	return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "sendMessageToUser", [userName,message,contentType]);
	 };
}

module.exports = MASPluginUser;
