/*
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

var MASPluginMQTTConstants = require("./MASPluginMQTTConstants");

/**
* @class MASPluginMQTTClient
* @classdesc The MAS Messaging client that connects to any Public Broker including MAG
* @param {string} clientId Unique broker-client ID for this client. Default clientId is the one picked from msso_config.json
* @param {MASPluginMQTTConstants} masMQTTConstants An instance of populated MASPluginMQTTConstants object.
*/
var MASPluginMQTTClient = function (clientId, masMQTTConstants) {
    
	this.clientId = clientId;
    this.masMQTTConstants = masMQTTConstants;

	/**
    * Initializes the MQTT client.
    * @memberOf MASPluginMQTTClient
	* @function initializeMQTTClient
	* @private
    * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
    * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
    * @param {string} clientId specifies the client ID to initialize the client
    * @param {boolean} cleanSession specifies whether to clean the previous session
    */
    this.initializeMQTTClient = function(successHandler, errorHandler, clientId, cleanSession) {
    	return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "initializeMQTTClient", [clientId, cleanSession]);
    };

    /**
    * Checks if device is connected to the MQTT broker.
    * @memberOf MASPluginMQTTClient
	* @function isConnected
	* @instance
    * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
    * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
    */
	this.isConnected = function(successHandler, errorHandler) {
		return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "isConnected", []);
	};

    /**
	* Connects to a message broker using the MASPluginMQTTConstants that is provided during construction of this object.
    * @memberOf MASPluginMQTTClient
	* @function connect
	* @instance
    * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
    * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
	*/
	this.connect = function(successHandler, errorHandler) {
		return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "connect", [this.clientId, this.masMQTTConstants]);
	};

	/**
	* Disconnects from the connected message broker
    * @memberOf MASPluginMQTTClient
	* @function disconnect
	* @instance
    * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
    * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
	*/
	this.disconnect = function(successHandler,errorHandler){
		return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "disconnect", []);
	};

	/**
	* Subscribes to a topic via the connected MQTT broker.
    * @memberOf MASPluginMQTTClient
	* @function subscribe
	* @instance
    * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
    * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
	* @param {string} topicName topic to which the user wants to subscribe
    * @param {MASConnectaPluginConstants.MQTTQualityOfService} QoS Quality of Service for message delivery.Default value is 2.
	*/
	this.subscribe = function(successHandler, errorHandler, topicName, QoS){
		return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "subscribe", [topicName, QoS]);
	};

	/**
	* Unsubscribe from a topic
    * @memberOf MASPluginMQTTClient
	* @function unsubscribe
	* @instance
    * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
    * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
	* @param {string} topicName topic to which the user needs to unsubscribe.
	*/
	this.unsubscribe = function(successHandler, errorHandler, topicName){
		return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "unsubscribe", [topicName]);
	};

	/**
	* Publish to a topic via the connected MQTT broker.
    * @memberOf MASPluginMQTTClient
	* @function publish
	* @instance
    * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
    * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
	* @param {string} topicName topic to which the user sends the message
	* @param {string} message specifies the message to be sent. The message bytes should be a base64 encoded string to support sending images
	* @param {integer} QoS Quality of Service for message delivery.0-> At most once,1-> At least once, 2: Exactly once. Default is 2
	* @param {boolean} retain indication for the broker to persist the messages for a client
	*/
	this.publish = function(successHandler, errorHandler, topic, message, QoS, retain) {
		return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "publish", [topic, message, QoS, retain]);
	};
};

module.exports = MASPluginMQTTClient;