//
//  MASConnectOptions.js
//
/**
* ConnectOptions : The various connect options like MQTT broker URL etc to initialize and connect to a any MQTT broker.
*/
var MASConnectOptions = function(){
		this.settings = {will:{}},

		// connection string for a MQTT broker host ex. tcp://myhost.org:1883
		this.setConnectURL = function(url){
			this.settings.connectURL = url;
		},
		// username needed to connect to the broker
		this.setUsername = function(username){
			this.settings.user = username;
		},
		// password needed to connect to the broker
		this.setPassword = function(password){
			this.settings.pass = password;
		},
		// connection timeout in seconds to be set for MQTT connection. Default is `30 seconds`.
		this.setConnectionTimeout = function(timeoutInSeconds){
			this.settings.connectTimeout = timeoutInSeconds;
		},
		// keepAlive interval in seconds to be set for MQTT connection. Default is `60 seconds`.
		this.setKeepAliveInterval = function(keepAliveIntervalInSeconds){
			this.settings.keepAliveInterval = keepAliveIntervalInSeconds;
		},
		// whether the client and server should remember state for the client across reconnects. True means `do not persist state` and false `remmebers state` Default is `true`
		this.setCleanSessionFalse = function(){
			this.settings.cleanSession = false;
		},
		
		// Sets the last will details for this client i.e. the message to be sent to all other clients it this client stops abrubtly
		this.setWill = function(topic,message,qos,retained){
			this.settings.will.topic = topic;
			this.settings.will.message = message;
			this.settings.will.qos = qos;
			this.settings.will.retained = retained;
		},

		// returns the final connect options
		this.getMASConnectOptions = function(){
			return this.settings;
		}
}

module.exports = MASConnectOptions;

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
