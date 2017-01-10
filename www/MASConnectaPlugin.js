/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */


/*
 * Pub/Sub Architecture with MQTTClient implementation.
 */
var MASMQTTClient = require("./MASMQTTClient"); 

var MASMQTTMessage = require("./MASMQTTMessage");

var MASMQTTConstants = require("./MASMQTTConstants");

/*
 * MASUser Messaging architecture.
 */
var MASConnectaPluginConstants = require("./MASConnectaPluginConstants");

var MASConnectaPluginMessage = require("./MASConnectaPluginMessage");

var MASPluginUser = require("cordova-plugin-mas-core.MASPluginUser");
{
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
	 MASPluginUser.prototype.stopListeningToMyMessages = function(successHandler, errorHandler) {
	 	
	 	return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "stopListeningToMyMessages", []);
	 };

	/**
	 * Send message to a user
	 *
	 * @param message : The message to be sent (String / MASPluginMessage).
	 * @param userObjectId The object id used to locate the 'MASPluginUser'.
	 */
	 MASPluginUser.prototype.sendMessageToUser = function(successHandler, errorHandler, message, userObjectId) {
	 	
	 	return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "sendMessageToUser", [message, userObjectId]);
	 };

	/**
	 * Send message to a user on a topic
	 *
	 * @param message : The message to be sent (String / MASPluginMessage).
	 * @param userObjectId The object id used to locate the 'MASPluginUser'.
	 * @param topicName : The topic on which the user needs to send the message.	 
	 */
	 MASPluginUser.prototype.sendMessageToTopic = function(successHandler, errorHandler, message, userObjectId , topicName) {
	 	
	 	return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "sendMessageToTopic", [message, userObjectId, topicName]);
	 };	
}

var MASConnectaPlugin = {

	MASMQTTClient: MASPluginMQTTClient,

	MASMQTTMessage: MASPluginMQTTMessage,

	MASMQTTConstants: MASPluginMQTTConstants,

	MASConnetaConstants: MASConnectaPluginConstants,

	MASConnectaMessage: MASConnectaPluginMessage,

	/**
	 MASUser which has the interfaces mapped to the native MASConneta extenstion for MASUser class.
	 */
	 MASUser: MASPluginUser
};

module.exports = MASConnectaPlugin;