/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

var MASMQTTConstants = require("./MASMQTTConstants");

var MASMQTTClient = function (clientId, cleanSession, masMQTTConstants) {
    
    ///------------------------------------------------------------------------------------------------------------------
    /// @name Properties
    ///------------------------------------------------------------------------------------------------------------------

	this.clientId = clientId ? clientId : "";

	this.cleanSession = (!cleanSession) ? cleanSession : true;

	this.masMQTTConstants = masMQTTConstants ? masMQTTConstants : new MASMQTTConstants();

	this.debugMode = false;

	this.setDebugMode = function(successHandler, errorHandler, enableDebugMode) {

		this.debugMode = enableDebugMode;
		return Cordova.exec(successHandler, errorHandler, "MASMQTTClient", "connected", [enableDebugMode]);		
	};

	this.connected = function(successHandler, errorHandler) {

		return Cordova.exec(successHandler, errorHandler, "MASMQTTClient", "connected", []);
	};	

	///------------------------------------------------------------------------------------------------------------------
    /// @name Lifecycle
    ///------------------------------------------------------------------------------------------------------------------

    this.initializeMQTTClient = function(successHandler, errorHandler, clientId, cleanSession) {

    	this.clientId = clientId;

    	this.cleanSession = cleanSession;

    	return Cordova.exec(successHandler, errorHandler, "MASMQTTClient", "initializeMQTTClient", [clientId, cleanSession]);
    };

    ///------------------------------------------------------------------------------------------------------------------
    /// @name Utility methods
    ///------------------------------------------------------------------------------------------------------------------

    this.setUserCredentials = function(successHandler, errorHandler, userName, password) {

    	this.masMQTTConstants.setUserCredentials(userName, password);

    	return Cordova.exec(successHandler, errorHandler, "MASMQTTClient", "setUserCredentials", [userName, password]);
    };

    this.clearWill = function(successHandler, errorHandler) {

    	return Cordova.exec(successHandler, errorHandler, "MASMQTTClient", "clearWill", []);
    };

    this.setMessageRetry = function(successHandler, errorHandler, seconds) {

    	return Cordova.exec(successHandler, errorHandler, "MASMQTTClient", "setMessageRetry", [seconds]);	
    };

    this.setWillToTopic = function(payload, toTopic, willQoS, retain) {

    	this.masMQTTConstants.setWillToTopic(payload, toTopic, willQoS, retain);

    	return Cordova.exec(successHandler, errorHandler, "MASMQTTClient", "setWillToTopic", [this.masMQTTConstants.will]);
    };

    this.version = function(successHandler, errorHandler) {

    	return Cordova.exec(successHandler, errorHandler, "MASMQTTClient", "version", []);
    }

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
		
		return Cordova.exec(successHandler, errorHandler, "MASMQTTClient", "connect", [this.clientId, this.masMQTTConstants]);
	}

	/**
	 * Disconnect to the existing connected message broker.
	 */
	this.disconnect = function(successHandler,errorHandler){
		
		return Cordova.exec(successHandler, errorHandler, "MASMQTTClient", "disconnect", []);
	}

	this.reconnect = function(successHandler, errorHandler) {

		return Cordova.exec(successHandler, errorHandler, "MASMQTTClient", "reconnect", []);	
	}

	///------------------------------------------------------------------------------------------------------------------
    /// @name Subscribe methods
    ///------------------------------------------------------------------------------------------------------------------

	/**
	 * Subscribe to a topic using the broker connected via connect call.
	 *
	 * @param topicName : The topic on which the user needs to subscribe.
	 */
	this.subscribe = function(successHandler, errorHandler, topic, QoS){
		
		return Cordova.exec(successHandler, errorHandler, "MASMQTTClient", "subscribe", [topic, QoS]);
	}

	/**
	 * Unsubscribe to a topic.
	 *
	 * @param topicName : The topic on which the user needs to unsubscribe.
	 */
	this.unsubscribe = function(successHandler, errorHandler, topic){
		
		return Cordova.exec(successHandler, errorHandler, "MASMQTTClient", "unsubscribe", [topic]);
	}

	/**
	 * Publish to a topic using the broker connected via connect call.
	 *
	 * @param topicName : The topic on which the user needs to send the message.
	 * @param message : The message to be send. The message bytes should be Base64 encoded string, to support sending images also
	 * @param contentType : The mime type of the message to be send. Choose from MASConnectaContentType.
	 */
	this.publish = function(successHandler, errorHandler, topic, payload, QoS, retain) {
		
		return Cordova.exec(successHandler, errorHandler, "MASMQTTClient", "publish", [topic, payload, QoS, retain]);
	}
};

module.exports = MASMQTTClient;