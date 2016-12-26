//
//  MASConnectaPublicBroker.js
//

/**
* MASConnectaPublicBroker : This function is specific for Publish and Subscribing to other host's(apart from MAG)MQTT broker implementation hosted. 
* It requires a set of Connect options to connect to the broker like broker hostname etc.
*/
var MASConnectaPublicBroker = function(){
	/**
	 * Connect to a message broker using connect options and client id
	 *
	 * @param masConnectaOptions : The MQTT connect options for Client initializatio. Use MASConnectaPlugin.MASConnectOptions() to create it.
	 * @param clientId : The client Id of the MQTT client i.e. this device's identification. This value needs to be unique per broker. If not provided, client_id from msso_config.json is used
	 */
	this.connect = function(successHandler,errorHandler,masConnectOptions,clientId){
		return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "connect", [masConnectOptions,clientId]);
	}

	/**
	 * Disconnect to the existing connected message broker.
	 */
	this.disconnect = function(successHandler,errorHandler){
		return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "disconnect", []);
	}

	/**
	 * Subscribe to a topic using the broker connected via connect call.
	 *
	 * @param topicName : The topic on which the user needs to subscribe.
	 */
	this.subscribe = function(successHandler,errorHandler,topicName){
		return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "subscribe", [topicName]);
	}

	/**
	 * Unsubscribe to a topic.
	 *
	 * @param topicName : The topic on which the user needs to unsubscribe.
	 */
	this.unsubscribe = function(successHandler,errorHandler,topicName){
		return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "unsubscribe", [topicName]);
	}

	/**
	 * Publish to a topic using the broker connected via connect call.
	 *
	 * @param topicName : The topic on which the user needs to send the message.
	 * @param message : The message to be send.
	 * @param contentType : The mime type of the message to be send. Choose from MASConnectaContentType.
	 */
	this.publish = function(successHandler,errorHandler,topicName,message,contentType){
		return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "publish", [topicName,message,contentType]);
	}
}

module.exports = MASConnectaPublicBroker;
