//
//  MASConnectaPlugin.js
//
var MASConnectaPublicBroker = require("./MASConnectaPublicBroker");
var MASConnectaUtil = require("./MASConnectaUtil");
var MASConnectOptions = require("./MASConnectOptions");
var MASPluginUser = require("./MASPluginUser");

var MASConnectaPlugin = {

		 MASConnectaUtil : MASConnectaUtil,
		/**
		 MASUser which has the interfaces mapped to the native MASUser class.
		 */
		 MASUser : MASPluginUser,
		/**
		 MASPublicBroker which can be used to subscribe and publish to any public broker.
		 */
		 MASPublicBroker : MASConnectaPublicBroker,

		/**
		 MASConnectaOptions which specifies MQTT options to connect to a public broker.
		 */
		 MASConnectOptions : MASConnectOptions
};

module.exports = MASConnectaPlugin;