/**
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

    this.initializeMQTTClient = function(successHandler, errorHandler, clientId, cleanSession) {

    	return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "initializeMQTTClient", [clientId, cleanSession]);
    };

    this.clientId = clientId;

    this.masMQTTConstants = masMQTTConstants;

    // Initialize the client.
    if (this.clientId) {

		this.initializeMQTTClient(function(){}, function(){}, this.clientId, (this.masMQTTConstants ? this.masMQTTConstants.cleanSession : true));
    }

    ///------------------------------------------------------------------------------------------------------------------
    /// @name Properties
    ///------------------------------------------------------------------------------------------------------------------	

	this.isConnected = function(successHandler, errorHandler) {

		return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "isConnected", []);
	};

	///------------------------------------------------------------------------------------------------------------------
    /// @name MQTT Connection methods
    ///------------------------------------------------------------------------------------------------------------------

    /**
	 * Connect to a message broker using connect options and client id
	 *
	 * @param masConnectaOptions : The MQTT connect options for Client initializatio. Use MASConnectaPlugin.MASConnectOptions() to create it.
	 * @param clientId : The client Id of the MQTT client i.e. this device's identification. This value needs to be unique per broker. If not provided, client_id from msso_config.json is used
	 */
	this.connect = function(successHandler, errorHandler) {

		return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "connect", [this.clientId, this.masMQTTConstants]);
	};

	/**
	 * Disconnect to the existing connected message broker.
	 */
	this.disconnect = function(successHandler,errorHandler){

		return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "disconnect", []);
	};


	///------------------------------------------------------------------------------------------------------------------
    /// @name Subscribe methods
    ///------------------------------------------------------------------------------------------------------------------

	/**
	 * Subscribe to a topic using the broker connected via connect call.
	 *
	 * @param topicName : The topic on which the user needs to subscribe.
	 */
	this.subscribe = function(successHandler, errorHandler, topic, QoS){

		return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "subscribe", [topic, QoS]);
	};

	/**
	 * Unsubscribe to a topic.
	 *
	 * @param topicName : The topic on which the user needs to unsubscribe.
	 */
	this.unsubscribe = function(successHandler, errorHandler, topic){

		return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "unsubscribe", [topic]);
	};

	/**
	 * Publish to a topic using the broker connected via connect call.
	 *
	 * @param topicName : The topic on which the user needs to send the message.
	 * @param message : The message to be send. The message bytes should be Base64 encoded string, to support sending images also
	 * @param contentType : The mime type of the message to be send. Choose from MASConnectaContentType.
	 */
	this.publish = function(successHandler, errorHandler, topic, payload, QoS, retain) {

		return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "publish", [topic, payload, QoS, retain]);
	};
};

module.exports = MASPluginMQTTClient;