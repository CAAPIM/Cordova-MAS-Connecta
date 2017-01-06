/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

var MASConnectaPluginConstants = require("./MASConnectaPluginConstants");


var MASPluginMessage = function() {

	/**
 	 * The version of the message format.
 	 */
	this.version;

	/**
 	 *  The topic of the message
 	 */
	this.topic;

	/**
 	 * The object identifier of the message receiver.
 	 */
	this.receiverObjectId;

	/**
 	 * The MASPluginSenderType representing the sender.
 	 */
	this.senderType;

	/**
 	 * The object identifier of the message sender.
 	 */
	this.senderObjectId;

	/**
 	 *  The DisplayName (field in the /UserInfo mapping in the Gateway) of the message sender.
 	 */
	this.senderDisplayName;

	/**
 	 * The timestamp when the message was sent in UTC format.
 	 */
	this.sentTime;

	/**
 	 * The payload in binary format.
 	 */
	this.payload;

	/**
 	 * The content type of the payload.
 	 */
	this.contentType;

	/**
 	 *  The content encoding of the payload.
 	 */
	this.contentEncoding;


	///------------------------------------------------------------------------------------------------------------------
	/// @name Lifecycle
	///------------------------------------------------------------------------------------------------------------------

	this.initializeWithPayloadData = function(successHandler, errorHandler, payload, contentType) {

		return Cordova.exec(successHandler, errorHandler, "MASPluginMessage", "initializeWithPayloadData", [payload, contentType]);
	};

	this.initializeWithPayloadString = function(successHandler, errorHandler, payload, contentType) {

		return Cordova.exec(successHandler, errorHandler, "MASPluginMessage", "initializeWithPayloadString", [payload, contentType]);
	};

	this.initializeWithPayloadImage = function(successHandler, errorHandler, payload, contentType) {

		return Cordova.exec(successHandler, errorHandler, "MASPluginMessage", "initializeWithPayloadImage", [payload, contentType]);
	};


	///------------------------------------------------------------------------------------------------------------------
	/// @name Public
	///------------------------------------------------------------------------------------------------------------------

	/**
 	 * The payload property in String format.
 	 *
 	 * @return String.
 	 */
	this.payloadTypeAsString = function(successHandler, errorHandler) {

		return Cordova.exec(successHandler, errorHandler, "MASPluginMessage", "payloadTypeAsString", []);
	};

	/**
 	 *  The payload property in image src format.
 	 *
 	 *  @return base64 string
 	 */
	this.payloadTypeAsImage = function(successHandler, errorHandler) {

		return Cordova.exec(successHandler, errorHandler, "MASPluginMessage", "payloadTypeAsImage", []);
	};

	/**
 	 * The senderType property in String format.
 	 *
 	 * @return String.
 	 */
	this.senderTypeAsString = function(successHandler, errorHandler) {

		return Cordova.exec(successHandler, errorHandler, "MASPluginMessage", "senderTypeAsString", []);
	};

	/**
 	 * The MASConnectaPluginConstants.MASSenderType in String format.
 	 *
 	 * @param type MASConnectaPluginConstants.MASSenderType.
 	 * @return String.
 	 */
	this.stringFromSenderType = function(successHandler, errorHandler, masSenderType) {

		return Cordova.exec(successHandler, errorHandler, "MASPluginMessage", "stringFromSenderType", [masSenderType]);
	};
};

module.exports = MASPluginMessage;