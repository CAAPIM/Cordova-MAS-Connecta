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
* @class MASConnectaPlugin
* @hideconstructor
* @classdesc The parent Connecta interface to get the objects of MAS Messaging and PubSub interfaces.
* @example
* <caption>To get instance of {@link MASPluginMQTTConstants} : An interface that contains the required MQTT connection options for MQTT broker</caption>
var masMQTTConstants = new MASConnectaPlugin.MASMQTTConstants(host, port, false, "");
* @example
* <caption>To get instance of {@link MASPluginMQTTClient}: An interface that corresponds to a Public Broker including MAG</caption>
var masMQTTClient = new MASConnectaPlugin.MASMQTTClient(clientId, masMQTTConstants);
* @example
* <caption>Access {@link MASConnectaPluginConstants}: A static utility that contains the plugin related constants and Global callbacks</caption>
var MASConnetaConstants = MASConnectaPlugin.MASConnetaConstants;
* @example
* <caption>To get instance of {@link MASConnectaPluginMessage}: An interface that is mapped to the native MASMessage structure</caption>
var MASConnectaMessage = new MASConnectaPlugin.MASConnectaMessage();
* @example
* <caption>MASConnecta {@link MASPluginUser} APIs are static API that are called directly using the class reference as follows</caption>
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
	 * Call this function before using the MASConnecta messaging APIs. This API registers the notification receiver for observing the messages that are intended for the client.
	 * @memberOf MASConnectaPlugin
	 * @function MASRegisterListener
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
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