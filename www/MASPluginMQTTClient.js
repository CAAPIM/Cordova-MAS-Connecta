/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

var MASPluginMQTTConstants = require("./MASPluginMQTTConstants");

var MASPluginMQTTClient = function (clientId, cleanSession, masMQTTConstants) {
    
    ///------------------------------------------------------------------------------------------------------------------
    /// @name Lifecycle
    ///------------------------------------------------------------------------------------------------------------------

    this.initializeMQTTClient = function(successHandler, errorHandler, clientId, cleanSession) {

    	return Cordova.exec(successHandler, errorHandler, "MASPluginMQTTClient", "initializeMQTTClient", [this.clientId, this.cleanSession]);
    };

    // Initialize the client.
    if (clientId) {
		
		this.initializeMQTTClient(function(){}, function(){}, clientId, (cleanSession ? cleanSession : false));
    }

    ///------------------------------------------------------------------------------------------------------------------
    /// @name Properties
    ///------------------------------------------------------------------------------------------------------------------

	this.clientId = function(successHandler, errorHandler) {

		return Cordova.exec(successHandler, errorHandler, "MASPluginMQTTClient", "clientId", []);
	};

	this.setClientId = function(successHandler, errorHandler, clientId) {

		return Cordova.exec(successHandler, errorHandler, "MASPluginMQTTClient", "setClientId", []);
	};	

	this.masMQTTConstants = masMQTTConstants ? masMQTTConstants : new MASMQTTConstants();

	this.debugMode = function(successHandler, errorHandler){

		return Cordova.exec(successHandler, errorHandler, "MASPluginMQTTClient", "debugMode", []);
	};

	this.setDebugMode = function(successHandler, errorHandler, enableDebugMode) {

		this.debugMode = enableDebugMode;
		return Cordova.exec(successHandler, errorHandler, "MASPluginMQTTClient", "connected", [enableDebugMode]);		
	};

	this.connected = function(successHandler, errorHandler) {

		return Cordova.exec(successHandler, errorHandler, "MASPluginMQTTClient", "connected", []);
	};		

    ///------------------------------------------------------------------------------------------------------------------
    /// @name Utility methods
    ///------------------------------------------------------------------------------------------------------------------

    this.setUserCredentials = function(successHandler, errorHandler, userName, password) {

    	this.masMQTTConstants.setUserCredentials(userName, password);

    	return Cordova.exec(successHandler, errorHandler, "MASPluginMQTTClient", "setUserCredentials", [userName, password]);
    };

    this.setWillToTopic = function(payload, toTopic, willQoS, retain) {

    	this.masMQTTConstants.setWillToTopic(payload, toTopic, willQoS, retain);

    	return Cordova.exec(successHandler, errorHandler, "MASPluginMQTTClient", "setWillToTopic", [this.masMQTTConstants.will]);
    };

    this.clearWill = function(successHandler, errorHandler) {

    	return Cordova.exec(successHandler, errorHandler, "MASPluginMQTTClient", "clearWill", []);
    };

    this.setMessageRetry = function(successHandler, errorHandler, seconds) {

    	return Cordova.exec(successHandler, errorHandler, "MASPluginMQTTClient", "setMessageRetry", [seconds]);	
    };    

    this.version = function(successHandler, errorHandler) {

    	return Cordova.exec(successHandler, errorHandler, "MASPluginMQTTClient", "version", []);
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
	this.connect = function(successHandler, errorHandler, clientId) {
		
		return Cordova.exec(successHandler, errorHandler, "MASPluginMQTTClient", "connect", [clientId, this.masMQTTConstants]);
	};

	/**
	 * Disconnect to the existing connected message broker.
	 */
	this.disconnect = function(successHandler,errorHandler){
		
		return Cordova.exec(successHandler, errorHandler, "MASPluginMQTTClient", "disconnect", []);
	};

	this.reconnect = function(successHandler, errorHandler) {

		return Cordova.exec(successHandler, errorHandler, "MASPluginMQTTClient", "reconnect", []);	
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
		
		return Cordova.exec(successHandler, errorHandler, "MASPluginMQTTClient", "subscribe", [topic, QoS]);
	};

	/**
	 * Unsubscribe to a topic.
	 *
	 * @param topicName : The topic on which the user needs to unsubscribe.
	 */
	this.unsubscribe = function(successHandler, errorHandler, topic){
		
		return Cordova.exec(successHandler, errorHandler, "MASPluginMQTTClient", "unsubscribe", [topic]);
	};

	/**
	 * Publish to a topic using the broker connected via connect call.
	 *
	 * @param topicName : The topic on which the user needs to send the message.
	 * @param message : The message to be send. The message bytes should be Base64 encoded string, to support sending images also
	 * @param contentType : The mime type of the message to be send. Choose from MASConnectaContentType.
	 */
	this.publish = function(successHandler, errorHandler, topic, payload, QoS, retain) {
		
		return Cordova.exec(successHandler, errorHandler, "MASPluginMQTTClient", "publish", [topic, payload, QoS, retain]);
	};

	///------------------------------------------------------------------------------------------------------------------
    /// @name Listeners
    ///------------------------------------------------------------------------------------------------------------------

    this.onMQTTMessageReceived = function(successHandler, errorHandler) {

    	return Cordova.exec(successHandler, errorHandler, "MASPluginMQTTClient", "onMQTTMessageReceived", []);
    };

    this.onMQTTPublishMessage = function(successHandler, errorHandler) {

    	return Cordova.exec(successHandler, errorHandler, "MASPluginMQTTClient", "onMQTTPublishMessage", []);
    };

    this.onMQTTClientConnected = function(successHandler, errorHandler) {

    	return Cordova.exec(successHandler, errorHandler, "MASPluginMQTTClient", "onMQTTClientConnected", []);
    };

    this.onMQTTClientDisconnect = function(successHandler, errorHandler) {

    	return Cordova.exec(successHandler, errorHandler, "MASPluginMQTTClient", "onMQTTClientDisconnect", []);
    };
};

module.exports = MASPluginMQTTClient;