/*
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

var MASPluginMQTTClient = require("./MASPluginMQTTClient"); 
var MASPluginMQTTMessage = require("./MASPluginMQTTMessage");
var MASPluginMQTTConstants = require("./MASPluginMQTTConstants");
var MASConnectaPluginConstants = require("./MASConnectaPluginConstants");
var MASConnectaPluginMessage = require("./MASConnectaPluginMessage");

/**
* @class MASPluginUser
* @hideconstructor
* @classdesc An extension of cordova-plugin-mas-core.MASPluginUser which exposes new APIs for MAS Messaging. The methods are static hence can be called directly on MASPluginUser class.
*/
var MASPluginUser = require("cordova-plugin-mas-core.MASPluginUser");
{
	/**
	* Subscribe (starts Listening) to user's own custom topic. Topic name defaults to userid of the logged in user
    * @memberOf MASPluginUser
	* @function startListeningToMyMessages
    * @param {successCallbackFunction} successHandler user defined success callback which will be invoked on success scenario.
    * @param {errorCallbackFunction} errorHandler user defined error callback which will be invoked on failure scenario.
	* @example
	* MASConnectaPlugin.MASUser.startListeningToMyMessages(successHandler, errorHandler);
	*/
	 MASPluginUser.startListeningToMyMessages = function(successHandler, errorHandler) {
	 	return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "startListeningToMyMessages", []);
	 };

    /**
	* Unsubscribe (stop Listening) to user's own custom topic. Topic name defaults to userid of the logged in user.
    * @memberOf MASPluginUser
	* @function stopListeningToMyMessages
    * @param {successCallbackFunction} successHandler user defined success callback which will be invoked on success scenario.
	* @param {errorCallbackFunction} errorHandler user defined error callback which will be invoked on failure scenario.
	* @example
	* MASConnectaPlugin.MASUser.stopListeningToMyMessages(successHandler, errorHandler);
	*/
	 MASPluginUser.stopListeningToMyMessages = function(successHandler, errorHandler) {
	 	return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "stopListeningToMyMessages", []);
	 };

    /**
	* Send message to a user
    * @memberOf MASPluginUser
	* @function sendMessageToUser
    * @param {successCallbackFunction} successHandler user defined success callback which will be invoked on success scenario.
    * @param {errorCallbackFunction} errorHandler user defined error callback which will be invoked on failure scenario.
	* @param {string} message message to be sent (String / MASPluginMessage)
	* @param {string} userObjectId Unique Id of the user to whom the message is intended to
	* @example
	* MASConnectaPlugin.MASUser.sendMessageToUser(successHandler, errorHandler,message,userObjectId);
	*/
	 MASPluginUser.sendMessageToUser = function(successHandler, errorHandler, message, userObjectId) {
	 	return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "sendMessageToUser", [message, userObjectId]);
	 };

	/**
	* Send message to a user on a topic
    * @memberOf MASPluginUser
	* @function sendMessageToUserOnTopic
    * @param {successCallbackFunction} successHandler user defined success callback which will be invoked on success scenario.
    * @param {errorCallbackFunction} errorHandler user defined error callback which will be invoked on failure scenario.
	* @param {string} message  message to be sent (String / MASPluginMessage)
	* @param {string} topicName topic on which the user wants to send the message
	* @param {string} userObjectId Unique Id of the user to whom the message is intended to
	* @example
	* MASConnectaPlugin.MASUser.sendMessageToUserOnTopic(successHandler, errorHandler,message, userObjectId, topicName);
	*/
	 MASPluginUser.sendMessageToUserOnTopic = function(successHandler, errorHandler, message, userObjectId, topicName) {
	 	return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "sendMessageToUserOnTopic", [message, userObjectId, topicName]);
	 };
}

/**
* @class MASConnectaPlugin
* @hideconstructor
* @classdesc The parent Connecta interface to get objects of MAS Messaging and PubSub interfaces.
* @example
* <caption>To get instance of {@link MASPluginMQTTConstants} : An interfaces which contains required MQTT connection options for any MQTT broker</caption>
var masMQTTConstants = new MASConnectaPlugin.MASMQTTConstants(host, port, false, "");
* @example
* <caption>To get instance of {@link MASPluginMQTTClient}: An interface which corresponds to any Public Broker including MAG</caption>
var masMQTTClient = new MASConnectaPlugin.MASMQTTClient(clientId, masMQTTConstants);
* @example
* <caption>Access {@link MASConnectaPluginConstants}: A static utility containing the plugin related constants and Global callbacks</caption>
var MASConnetaConstants = MASConnectaPlugin.MASConnetaConstants;
* @example
* <caption>To get instance of {@link MASConnectaPluginMessage}: An interfaces mapped to the native MASMessage structure</caption>
var MASConnectaMessage = new MASConnectaPlugin.MASConnectaMessage();
* @example
* <caption>MASConnecta {@link MASPluginUser} APIs are static API which can be called directly using the class reference as below</caption>
* MASConnectaPlugin.MASUser.sendMessageToUser(successHandler, errorHandler, message, userObjectId);
*/
var MASConnectaPlugin = {
	MASMQTTClient: MASPluginMQTTClient,
	MASMQTTMessage: MASPluginMQTTMessage,
	MASMQTTConstants: MASPluginMQTTConstants,
	MASConnetaConstants: MASConnectaPluginConstants,
	MASConnectaMessage: MASConnectaPluginMessage,
    MASUser: MASPluginUser,
	 /**
	 * This funtion must to be called before using MASConnecta messaging APIs. This API register the notification receiver for observing the message intended to this client
	 * @memberOf MASConnectaPlugin
	 * @function MASRegisterListener
     * @param {successCallbackFunction} successHandler user defined success callback which will be invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback which will be invoked on failure scenario.
	 * @example
	 * <caption>Initializing and registering the listener</caption>
	MASConnectaPlugin.MASRegisterListener(
		function(success) {
			if (null != success.Payload) {
				var toAlert = {};
				toAlert.sender = success.SenderId;
				var payload = (success.Payload!=null?success.Payload:success.payload);
				toAlert.payload = atob(payload);
				toAlert.topic = success.Topic;
				alert(JSON.stringify(toAlert));
            }
        }, function(error) {
			console.log("Listener registration failed!!!:" + JSON.stringify(error));
        }
	);
	 */
	 MASRegisterListener: function(successHandler, errorHandler) {
	 	return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "registerReceiver", []);
	 }
};
module.exports = MASConnectaPlugin;