/*
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

/**
* @class MASConnectaPluginConstants
* @hideconstructor
* @classdesc MAS Connecta constansts.
* <table>
*	<tr bgcolor="#D3D3D3"><th>How to access this class's variables</th></tr>
*	<tr><td><i>var QosVal = MASConnectaPlugin.MASConnetaConstants.MQTTQualityOfService.AtLeastOnce;</i></td></tr>
* </table>
*/
var MASConnectaPluginConstants = {

	MASPluginSenderType: {
		MASSenderTypeUnknown: -1,
		MASSenderTypeApplication: 0,
		MASSenderTypeDevice: 1,
		MASSenderTypeGroup: 2,
		MASSenderTypeUser: 3
	},

	MASSenderTypeApplicationValue: "APPLICATION",
	MASSenderTypeDeviceValue: "DEVICE",
	MASSenderTypeGroupValue: "GROUP",
	MASSenderTypeUserValue: "USER",

	/**
 	 * The Quality of Service constant (QoS)
	 * @typedef {Object} MQTTQualityOfService
	 * @memberOf MASConnectaPluginConstants
	 * @property {number} AtMostOnce=0 The message should be tried at the most one time.
	 * @property {number} AtLeastOnce=1 The message should be tried at least one time.
	 * @property {number} ExactlyOnce=2 The message should be tried only once.
  	 */
	MQTTQualityOfService : {
		AtMostOnce: 0,
		AtLeastOnce: 1,
		ExactlyOnce: 2
    }
};
 /**
 * A user defined success callback function. The contract of the function is out of scope for Mobile SDK, but the object passed to that function by Mobile SDK will conform to a structure based on operation type.
 * @callback successCallbackFunction
 * @param {Object} result The result object can take any form. It can be an object, or a plain string, a boolean or a number based on the API.
 * Developer may check for existance of result object to define success in such case and must not rely on the exact response format.<br>
 * To know about specific result for each API see {@link http://mas.ca.com/docs/cordova/latest/guides}
 */

 /**
 * A user defined error callback function. The contract of the function is out of scope for Mobile SDK, but the object passed to that function by Mobile SDK will conform to a strict structure.
 * @callback errorCallbackFunction
 * @param {Object} error A Json Object with below structure <br>{<br>&nbsp;&nbsp;"errorCode": &lt;The error code. For ex. 3003123&gt;,<br>&nbsp;&nbsp;"errorMessage": "&lt;The error message&gt;"<br>&nbsp;&nbsp;"errorInfo":"&lt;The Error Info&gt;"<br>}<br>
 */
module.exports = MASConnectaPluginConstants;