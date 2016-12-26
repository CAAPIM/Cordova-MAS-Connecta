//
//  MASConnectaPlugin.js
//

var MASPluginUser = require("./MASPluginUser");
var MASConnectaPublicBroker = require("./MASConnectaPublicBroker");
var MASConnectaUtil = require("./MASConnectaUtil");
var MASConnectaPlugin = {
		/**
		* MASMessageReceiver : The receiver to be registered with the native Braodcast Receiver to receive all messages of type MAS Message. It is must to initialize this
		* class before any other function of MASConnectaPlugin. Call MASConnectaPlugin.MASMessageReceiver.register in your apps onLoad or onDeviceReady. The successHandler
		* passed to the register function would be invoked everytime a message is received. Developer can pass their custom logic to consume the message.
		*/
		 MASMessageReceiver : MASConnectaUtil.BroadcastRreceiver,
		/**
		 MASUser which has the interfaces mapped to the native MASUser class.
		 */
		 MASUser : MASPluginUser,
		/**
		 MASPublicBroker which can be used to subscribe and publish to any public broker.
		 */
		 MASPublicBroker : MASConnectaPublicBroker,
		/**
		 MessageContentType which specifies the mime type of the message to be published.
		 */
		 MessageContentType : MASConnectaUtil.ContentType,
		/**
		 MASConnectaOptions which specifies MQTT options to connect to a public broker.
		 */
		 MASConnectOptions : MASConnectaUtil.ConnectOptions
};

module.exports = MASConnectaPlugin;
