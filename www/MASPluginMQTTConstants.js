/*
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */


var MASPluginMQTTConstants = function(host, port, enableTLS, sslCACert) {
 		this.host = host ? host : "";
 		this.port = port ? port : "";
 		this.enableTLS = enableTLS ? enableTLS : false;
 		this.sslCACert = sslCACert ? sslCACert : "";
 		this.connectURL = (this.host && this.port) ? ("tcp://" + this.host + ":" + this.port) : "";
 		this.userName = "";
 		this.password = "";
 		this.connectionTimeOut = 30;
 		this.keepAlive = 60;
	 	this.cleanSession = true;
 	 	this.will = {
 		         message: "",
 		         topic: "",
 		         QoS: 1,
 		         retain: false
 	    };

		this.setCleanSession = function(mCleanSession){
 		         this.cleanSession = mCleanSession;
 	    };
 	    this.setConnectionTimeOut = function(timeOutSeconds) {
 		        this.connectionTimeOut = timeOutSeconds;
 	    };
 	    this.setKeepAlive = function(keepAliveSeconds) {
 		        this.keepAlive = keepAliveSeconds;
 	    };
 	    this.setWillToTopic = function(payload, toTopic, willQoS, retain) {
		 		this.will.message = payload;
 		        this.will.topic = toTopic;
 		        this.will.QoS = willQoS;
 		        this.will.retain = retain;
 	    };
 	    this.setUserCredentials = function(userName, password) {
 		        this.userName = userName;
 		        this.password = password;
 	    };
};
 module.exports = MASPluginMQTTConstants;