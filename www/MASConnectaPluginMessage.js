/*
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

var MASConnectaPluginConstants = require("./MASConnectaPluginConstants");


var MASConnectaPluginMessage = function() {

	/**
 	 * The version of the message format
 	 * @member {string}
 	 */
	this.version;

	/**
 	 *  The topic of the message
 	 * @member {string}
 	 */
	this.topic;

	/**
 	 * The object identifier of the message receiver
 	 * @member {string}
 	 */
	this.receiverObjectId;

	/**
 	 * The MASPluginSenderType that represents the sender
 	 * @member {string}
 	 */
	this.senderType;

	/**
 	 * The object identifier of the message sender
 	 * @member {string}
 	 */
	this.senderObjectId;

	/**
 	 *  The DisplayName (field in the /UserInfo mapping in the Gateway) of the message sender
 	 *  @member {string}
 	 */
	this.senderDisplayName;

	/**
 	 * The timestamp in UTC format when the message was sent
 	 * @member {integer}
 	 */
	this.sentTime;

	/**
 	 * The payload in binary format
 	 * @member {binary}
 	 */
	this.payload;

	/**
 	 * The content type of the payload
 	 * @member {string}
 	 */
	this.contentType;

	/**
 	 * The content encoding of the payload
 	 * @member {string}
 	 */
	this.contentEncoding;


	///------------------------------------------------------------------------------------------------------------------
	/// @name Lifecycle
	///------------------------------------------------------------------------------------------------------------------

	/**
	*	Initialize a message with a payload
	* 	@param {function} successHandler user defined success callback
	* 	@param {function} errorHandler user defined error callback
	* 	@param {binary} payload payload as binary
	*/
	this.initializeWithPayloadData = function(successHandler, errorHandler, payload, contentType) {

		return Cordova.exec(successHandler, errorHandler, "MASPluginMessage", "initializeWithPayloadData", [payload, contentType]);
	};

	/**
	*	Initialize a message with a payload
	* 	@param {function} successHandler user defined success callback
	* 	@param {function} errorHandler user defined error callback
	* 	@param {string} payload payload as a string
	*/
	this.initializeWithPayloadString = function(successHandler, errorHandler, payload, contentType) {

		return Cordova.exec(successHandler, errorHandler, "MASPluginMessage", "initializeWithPayloadString", [payload, contentType]);
	};

	/**
	*	Initialize a message with a payload
	* 	@param {function} successHandler user defined success callback
	* 	@param {function} errorHandler user defined error callback
	* 	@param {base64} payload payload as an image
	*/
	this.initializeWithPayloadImage = function(successHandler, errorHandler, payload, contentType) {

		return Cordova.exec(successHandler, errorHandler, "MASPluginMessage", "initializeWithPayloadImage", [payload, contentType]);
	};


	///------------------------------------------------------------------------------------------------------------------
	/// @name Public
	///------------------------------------------------------------------------------------------------------------------

	/**
 	 * The payload property in a string format
 	 * @param {function} successHandler user defined success callback
 	 * @param {function} errorHandler user defined error callback
 	 * @return String
 	 */
	this.payloadTypeAsString = function(successHandler, errorHandler) {

		return Cordova.exec(successHandler, errorHandler, "MASPluginMessage", "payloadTypeAsString", []);
	};

	/**
 	 *  The payload property in an image src format
 	 *  @param {function} successHandler user defined success callback
 	 *  @param {function} errorHandler user defined error callback
 	 *  @return base64 string
 	 */
	this.payloadTypeAsImage = function(successHandler, errorHandler) {

		return Cordova.exec(successHandler, errorHandler, "MASPluginMessage", "payloadTypeAsImage", []);
	};

	/**
 	 * The senderType property in a string format
 	 * @param {function} successHandler user defined success callback
 	 * @param {function} errorHandler user defined error callback
 	 * @return String
 	 */
	this.senderTypeAsString = function(successHandler, errorHandler) {

		return Cordova.exec(successHandler, errorHandler, "MASPluginMessage", "senderTypeAsString", []);
	};

	/**
 	 * The MASConnectaPluginConstants.MASSenderType in a string format
 	 * @param {function} successHandler user defined success callback
 	 * @param {function} errorHandler user defined error callback
 	 * @param {MASConnectaPluginConstants.MASSenderType} masSenderType specify the MAS sender type
 	 * @return String
 	 */
	this.stringFromSenderType = function(successHandler, errorHandler, masSenderType) {

		return Cordova.exec(successHandler, errorHandler, "MASPluginMessage", "stringFromSenderType", [masSenderType]);
	};
};

module.exports = MASConnectaPluginMessage;