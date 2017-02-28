/*
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */


var MASConnectaPluginConstants = {

	/**
 	 * Message Sender Type
 	 */
	MASPluginSenderType: {

		/**
     	 * Unknown
     	 */
		MASSenderTypeUnknown: -1,

		/**
     	 * MASApplication
     	 */
		MASSenderTypeApplication: 0,

		/**
     	 * MASDevice
     	 */
		MASSenderTypeDevice: 1,

		/**
     	 * MASGroup
     	 */
		MASSenderTypeGroup: 2,

		/**
     	 * MASUser
     	 */
		MASSenderTypeUser: 3
	},

	MASSenderTypeApplicationValue: "APPLICATION",

	MASSenderTypeDeviceValue: "DEVICE",

	MASSenderTypeGroupValue: "GROUP",

	MASSenderTypeUserValue: "USER"
};

module.exports = MASConnectaPluginConstants;