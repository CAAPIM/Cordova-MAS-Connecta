/*
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */


/*
 * Pub/Sub Architecture with MQTTClient implementation.
 */
var MASPluginMQTTClient = require("./MASPluginMQTTClient"); 
var MASPluginMQTTMessage = require("./MASPluginMQTTMessage");
var MASPluginMQTTConstants = require("./MASPluginMQTTConstants");

/*
 * MASUser Messaging architecture
 */
var MASConnectaPluginConstants = require("./MASConnectaPluginConstants");
var MASConnectaPluginMessage = require("./MASConnectaPluginMessage");
var MASPluginUser = require("cordova-plugin-mas-core.MASPluginUser");
{
	/**
	 * Subscribe (starts Listening) to user's own custom topic. Topic name defaults to userid of the logged in user
	 * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
	 */
	 MASPluginUser.startListeningToMyMessages = function(successHandler, errorHandler) {
	 	return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "startListeningToMyMessages", []);
	 };

	 /**
	 * Unsubscribe (stop Listening) to user's own custom topic. Topic name defaults to userid of the logged in user
	 * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
	 */
	 MASPluginUser.stopListeningToMyMessages = function(successHandler, errorHandler) {
	 	return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "stopListeningToMyMessages", []);
	 };

	/**
	 * Send message to a user
	 * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
	 * @param {string} message message to be sent (String / MASPluginMessage)
	 * @param {string} userObjectId Unique Id of the user to whom the message is intended to
	 */
	 MASPluginUser.sendMessageToUser = function(successHandler, errorHandler, message, userObjectId) {
	 	return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "sendMessageToUser", [message, userObjectId]);
	 };

	/**
	 * Send message to a user on a topic
	 * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
	 * @param {string} message  message to be sent (String / MASPluginMessage)
	 * @param {string} topicName topic on which the user wants to send the message
	 * @param {string} userObjectId Unique Id of the user to whom the message is intended to
	 */
	 MASPluginUser.sendMessageToUserOnTopic = function(successHandler, errorHandler, message, userObjectId, topicName) {
	 	return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "sendMessageToUserOnTopic", [message, userObjectId, topicName]);
	 };
}

var MASConnectaPlugin = {
	/**
	 MASMQTTClient which corresponds to any Public Broker including MAG
	 */
	MASMQTTClient: MASPluginMQTTClient,
	/**
	 MASMQTTMessage which has the interfaces mapped to the native MASMessage structure
	 */
	MASMQTTMessage: MASPluginMQTTMessage,
	/**
	 MASMQTTConstants which contains required MQTT connection options for any MQTT broker
	 */
	MASMQTTConstants: MASPluginMQTTConstants,
	/**
	 MASMQTTConstants which contains required MQTT connection options for any MQTT broker
	 */
	MASConnetaConstants: MASConnectaPluginConstants,
	/**
	 MASConnectaMessage which contains utility for creating MAS Message
	 */
	MASConnectaMessage: MASConnectaPluginMessage,
	/**
	 MASUser which has the interfaces mapped to the native MASConneta extenstion for MASUser class
	 */
	 MASUser: MASPluginUser,
	/**
	 MASRegisterListener : Funtion must to be called before using MASConnecta. This API register the notification receiver for observing the message intended to this client
	 * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
	 */
	 MASRegisterListener: function(successHandler, errorHandler) {
	 	return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "registerReceiver", []);
	 }
};

module.exports = MASConnectaPlugin;