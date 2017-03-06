/*
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

var MASPluginMQTTConstants = require("./MASPluginMQTTConstants");

var MASPluginMQTTClient = function (clientId, masMQTTConstants) {

    ///------------------------------------------------------------------------------------------------------------------
    /// @name Lifecycle
    ///------------------------------------------------------------------------------------------------------------------

    /**
    *	Initializes the MQTT client
    * 	@param {function} successHandler user defined success callback
    * 	@param {function} errorHandler user defined error callback
    *	@param {string} clientId specifies the client ID to initialize the client
    * 	@param {boolean} cleanSession specifies whether to clean the previous session
    */
    this.initializeMQTTClient = function(successHandler, errorHandler, clientId, cleanSession) {
    	return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "initializeMQTTClient", [clientId, cleanSession]);
    };

    /**
    *	Client ID of the current object
    *	@member {string}
    */
    this.clientId = clientId;


    this.masMQTTConstants = masMQTTConstants;

    // Initialize the client
    if (this.clientId) {
		this.initializeMQTTClient(function(){}, function(){}, this.clientId, (this.masMQTTConstants ? this.masMQTTConstants.cleanSession : true));
    }

    ///------------------------------------------------------------------------------------------------------------------
    /// @name Properties
    ///------------------------------------------------------------------------------------------------------------------

    /**
    *	Checks if device is connected to client
    * 	@param {function} successHandler user defined success callback
    * 	@param {function} errorHandler user defined error callback	
    */
	this.isConnected = function(successHandler, errorHandler) {
		return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "isConnected", []);
	};

	///------------------------------------------------------------------------------------------------------------------
    /// @name MQTT Connection methods
    ///------------------------------------------------------------------------------------------------------------------

    /**
	 * Connects to a message broker using the connect options and client id
	 * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
	 * @param {masConnectaOptions} masConnectaOptions MQTT connect options for client initialization. Use the MASConnectaPlugin.MASConnectOptions() method to create it.
	 * @param {string} clientId Client ID of the MQTT client i.e. this device's identification. This value must be unique per broker. If not provided, client_id from msso_config.json is used
	 */
	this.connect = function(successHandler, errorHandler) {
		return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "connect", [this.clientId, this.masMQTTConstants]);
	};

	/**
	 * Disconnects from the existing connected message broker
	 * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
	 */
	this.disconnect = function(successHandler,errorHandler){
		return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "disconnect", []);
	};


	///------------------------------------------------------------------------------------------------------------------
    /// @name Subscribe methods
    ///------------------------------------------------------------------------------------------------------------------

	/**
	 * Subscribe to a topic using the broker connected via connect call
	 * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
	 * @param {string} topicName topic to which the user needs to subscribe
     * @param {integer} QoS Quality of Service for message delivery.0-> At most once,1-> At least once, 2: Exactly once. Default is 2.
	 */
	this.subscribe = function(successHandler, errorHandler, topicName, QoS){
		return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "subscribe", [topicName, QoS]);
	};

	/**
	 * Unsubscribe from a topic
	 * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
	 * @param {string} topicName topic to which the user needs to unsubscribe.
	 */
	this.unsubscribe = function(successHandler, errorHandler, topicName){
		return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "unsubscribe", [topicName]);
	};

	/**
	 * Publish to a topic using the broker connected via connect call
	 * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
	 * @param {string} topicName topic to which the user sends the message
	 * @param {string} message specified the message to be sent. The message bytes should be a base64 encoded string to support sending images
	 * @param {integer} QoS Quality of Service for message delivery.0-> At most once,1-> At least once, 2: Exactly once. Default is 2
	 * @param {boolean} retain indication for the broker to persist the messages for a client
	 */
	this.publish = function(successHandler, errorHandler, topic, message, QoS, retain) {
		return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "publish", [topic, message, QoS, retain]);
	};
};

module.exports = MASPluginMQTTClient;