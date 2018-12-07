/*
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

var MASConnectaPluginConstants = require("./MASConnectaPluginConstants");

/**
* @class MASConnectaPluginMessage
* @hideconstructor
* @classdesc A Utility class that helps in creating and managing a MQTT Message. Specific to Cordova-iOS only.
* <table>
*	<tr bgcolor="#D3D3D3"><th>MASConnectaPluginMessage Construtor</th></tr>
*	<tr><td><i>var MASConnectaMessage = new MASConnectaPlugin.MASConnectaMessage();</i></td></tr>
* </table>
*/
var MASConnectaPluginMessage = function() {
	/**
     * The version of the message format
	 * @memberOf MASConnectaPluginMessage
     * @member {string} version
	 * @instance
     */
	this.version;

	/**
 	 * The topic of the message
	 * @memberOf MASConnectaPluginMessage
     * @member {string} topic
	 * @instance
 	 */
	this.topic;

	/**
 	 * The object identifier of the message receiver
	 * @memberOf MASConnectaPluginMessage
     * @member {string} receiverObjectId
	 * @instance
 	 */
	this.receiverObjectId;

	/**
 	 * The MASPluginSenderType that represents the sender
	 * @memberOf MASConnectaPluginMessage
     * @member {string} senderType
	 * @instance
 	 */
	this.senderType;

	/**
 	 * The object identifier of the message sender
	 * @memberOf MASConnectaPluginMessage
     * @member {string} senderObjectId
	 * @instance
 	 */
	this.senderObjectId;

	/**
 	 * The DisplayName (field in the /UserInfo mapping in the Gateway) of the message sender
	 * @memberOf MASConnectaPluginMessage
     * @member {string} senderDisplayName
	 * @instance
 	 */
	this.senderDisplayName;

	/**
 	 * The timestamp in UTC format when the message was sent
	 * @memberOf MASConnectaPluginMessage
     * @member {integer} sentTime
	 * @instance
 	 */
	this.sentTime;

	/**
 	 * The payload in binary format
	 * @memberOf MASConnectaPluginMessage
     * @member {byte[]} payload
	 * @instance
 	 */
	this.payload;

	/**
 	 * The content type of the payload
	 * @memberOf MASConnectaPluginMessage
     * @member {string} contentType
	 * @instance
 	 */
	this.contentType;

	/**
 	 * The content encoding of the payload
	 * @memberOf MASConnectaPluginMessage
     * @member {string} contentEncoding
	 * @instance
 	 */
	this.contentEncoding;

	/**
	* Initialize a message with a payload
    * @memberOf MASConnectaPluginMessage
	* @function initializeWithPayloadData
	* @instance
    * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
    * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
	* @param {byte[]} payload payload as binary
	* @param {string} contentType The content type of the message
	*/
	this.initializeWithPayloadData = function(successHandler, errorHandler, payload, contentType) {
		return Cordova.exec(successHandler, errorHandler, "MASPluginMessage", "initializeWithPayloadData", [payload, contentType]);
	};

	/**
	* Initialize a message with a payload
    * @memberOf MASConnectaPluginMessage
	* @function initializeWithPayloadString
	* @instance
    * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
    * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
	* @param {string} payload payload as a string
	* @param {string} contentType The content type of the message
	*/
	this.initializeWithPayloadString = function(successHandler, errorHandler, payload, contentType) {
		return Cordova.exec(successHandler, errorHandler, "MASPluginMessage", "initializeWithPayloadString", [payload, contentType]);
	};

	/**
	* Initialize a message with a payload
    * @memberOf MASConnectaPluginMessage
	* @function initializeWithPayloadImage
	* @instance
    * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
    * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
	* @param {string} payload payload of an image as a Base64 String.
	* @param {string} contentType The content type of the message
	*/
	this.initializeWithPayloadImage = function(successHandler, errorHandler, payload, contentType) {
		return Cordova.exec(successHandler, errorHandler, "MASPluginMessage", "initializeWithPayloadImage", [payload, contentType]);
	};

	/**
 	* The payload property in a string format
    * @memberOf MASConnectaPluginMessage
	* @function payloadTypeAsString
	* @instance
    * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
    * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
 	* @return String
 	*/
	this.payloadTypeAsString = function(successHandler, errorHandler) {
		return Cordova.exec(successHandler, errorHandler, "MASPluginMessage", "payloadTypeAsString", []);
	};

	/**
 	* The payload property in an image src format
    * @memberOf MASConnectaPluginMessage
	* @function payloadTypeAsImage
	* @instance
    * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
    * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
 	* @return base64 string
 	*/
	this.payloadTypeAsImage = function(successHandler, errorHandler) {
		return Cordova.exec(successHandler, errorHandler, "MASPluginMessage", "payloadTypeAsImage", []);
	};

	/**
 	* The senderType property in a string format
    * @memberOf MASConnectaPluginMessage
	* @function senderTypeAsString
	* @instance
    * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
    * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
 	* @return String
 	*/
	this.senderTypeAsString = function(successHandler, errorHandler) {
		return Cordova.exec(successHandler, errorHandler, "MASPluginMessage", "senderTypeAsString", []);
	};

	/**
 	* The MASConnectaPluginConstants.MASSenderType in a string format
    * @memberOf MASConnectaPluginMessage
	* @function stringFromSenderType
	* @instance
    * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
    * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
 	* @param {MASConnectaPluginConstants.MASSenderType} masSenderType specify the MAS sender type
 	* @return String
 	*/
	this.stringFromSenderType = function(successHandler, errorHandler, masSenderType) {
		return Cordova.exec(successHandler, errorHandler, "MASPluginMessage", "stringFromSenderType", [masSenderType]);
	};
};

module.exports = MASConnectaPluginMessage;