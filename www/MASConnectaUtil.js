//
//  MASConnectaUtil.js
//

var MASConnectaUtil = {
	/**
	* ContentType : The various content or mime type supported for the message.
	*/
	this.ContentType = {
		TEXT_PLAIN:"text/plain",
		APPLICATION_JSON:"application/json",
		APPLICATION_BYTESTREAM:"application/octet-stream",
		IMAGE:"image/jpeg"
	},

	/**
	* ConnectOptions : The various connect options like MQTT broker URL etc to initialize and connect to a any MQTT broker.
	*/
	this.ConnectOptions = function(){
		this.settings = {will:{}};

		// connection string for a MQTT broker host ex. tcp://myhost.org:1883
		this.setConnectURL = function(url){
			this.settings.connectURL = url;
		}
		// username needed to connect to the broker
		this.setUsername = function(username){
			this.settings.user = username;
		}
		// password needed to connect to the broker
		this.setPassword = function(password){
			this.settings.pass = password;
		}
		// connection timeout in seconds to be set for MQTT connection. Default is `30 seconds`.
		this.setConnectionTimeout = function(timeoutInSeconds){
			this.settings.connectTimeout = timeoutInSeconds;
		}
		// keepAlive interval in seconds to be set for MQTT connection. Default is `60 seconds`.
		this.setKeepAliveInterval = function(keepAliveIntervalInSeconds){
			this.settings.keepAliveInterval = keepAliveIntervalInSeconds;
		}
		// whether the client and server should remember state for the client across reconnects. True means `do not persist state` and false `remmebers state` Default is `true`
		this.setCleanSessionFalse = function(){
			this.settings.cleanSession = false;
		}
		
		// Sets the last will details for this client i.e. the message to be sent to all other clients it this client stops abrubtly
		this.setWill = function(topic,message,qos,retained){
			this.settings.will.topic = topic;
			this.settings.will.message = message;
			this.settings.will.qos = qos;
			this.settings.will.retained = retained;
		}

		// returns the final connect options
		this.getMASConnectOptions = function(){
			return this.settings;
		}
	},
	
	/**
	* MASMessageReceiver : The receiver to be registered with the native Braodcast Receiver to receive all messages of type MAS Message. It is must to initialize this
	* class before any other function of MASConnectaPlugin. Call MASConnectaPlugin.MASMessageReceiver.register in your apps onLoad or onDeviceReady. The successHandler
	* passed to the register function would be invoked everytime a message is received. Developer can pass their custom logic to consume the message.
	*/
	this.BroadcastRreceiver = function(){
		this.register = function(successHandler,errorHandler){
			return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "registerReceiver", []);
		}
	}
}

module.exports = MASConnectaUtil;

// Final JSON for ConnectOptions should look like
/*
{
  "will": {
    "topic": "/connect/will",
    "message": "MAR GAYA Bhai!!!",
    "qos": 1,
    "retained": true
  },
  "connectUrl": "tcp://doosra.ca.com:1899",
  "user": "manu",
  "pass": "dost1234",
  "connectTimeout": 120,
  "keepAliveInterval": 60,
  "cleanSession": false
}
*/
