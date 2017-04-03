/*
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

 var MQTTQualityOfService = {

 	AtMostOnce: 0,

 	AtLeastOnce: 1,

 	ExactlyOnce: 2
 };

 module.exports = MQTTQualityOfService;

 var MASPluginMQTTMessage = function (mid, topic, payload, qos, retained) {

 	this.mid = mid ? mid : NaN;

 	this.topic = topic ? topic : "";

 	this.payload = payload ? payload : undefined;

 	this.qos = qos ? qos : MQTTQualityOfService.ExactlyOnce;

 	this.retained = retained ? true : false;

 	this.initialize = function(successHandler, errorHandler, topic, payload, qos, retained, mid) {

 		return Cordova.exec(successHandler, errorHandler, "MASPluginMQTTMessage", "initialize", [topic, payload, qos, retained, mid]);
 	};

 	if (this.mid && this.topic && this.payload) {

 		this.initialize(function(){}, function(){}, this.mid, this.topic, this.payload);
 	}

 	this.payloadString = function() {

 		return Cordova.exec(successHandler, errorHandler, "MASPluginMQTTMessage", "payloadString", [this.mid]);
 	};

 	this.payloadImage = function() {

 		return Cordova.exec(successHandler, errorHandler, "MASPluginMQTTMessage", "payloadImage", [this.mid]);
 	};
 };

 module.exports = MASPluginMQTTMessage;