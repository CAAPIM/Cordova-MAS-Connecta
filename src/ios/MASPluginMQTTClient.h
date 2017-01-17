/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

#import <Cordova/CDV.h>



@interface MASPluginMQTTClient : CDVPlugin



#pragma mark - Properties

- (void)clientId:(CDVInvokedUrlCommand*)command;



- (void)setClientId:(CDVInvokedUrlCommand*)command;



- (void)connected:(CDVInvokedUrlCommand*)command;



- (void)debugMode:(CDVInvokedUrlCommand*)command;



- (void)setDebugMode:(CDVInvokedUrlCommand*)command;



#pragma mark - Lifecycle

- (void)initializeMQTTClient:(CDVInvokedUrlCommand*)command;



#pragma mark - Utility methods

- (void)setUserCredentials:(CDVInvokedUrlCommand*)command;



- (void)setWillToTopic:(CDVInvokedUrlCommand*)command;



- (void)clearWill:(CDVInvokedUrlCommand*)command;



- (void)setMessageRetry:(CDVInvokedUrlCommand*)command;



- (void)version:(CDVInvokedUrlCommand*)command;



#pragma mark - MQTT Connection methods

- (void)connect:(CDVInvokedUrlCommand*)command;



- (void)disconnect:(CDVInvokedUrlCommand*)command;



- (void)reconnect:(CDVInvokedUrlCommand*)command;



#pragma mark - Subscribe methods

- (void)subscribe:(CDVInvokedUrlCommand*)command;



- (void)unsubscribe:(CDVInvokedUrlCommand*)command;



#pragma mark - Publish methods

- (void)publish:(CDVInvokedUrlCommand*)command;



#pragma mark - Listeners

- (void)onMQTTMessageReceived:(CDVInvokedUrlCommand*)command;



- (void)onMQTTPublishMessage:(CDVInvokedUrlCommand*)command;



- (void)onMQTTClientConnected:(CDVInvokedUrlCommand*)command;



- (void)onMQTTClientDisconnect:(CDVInvokedUrlCommand*)command;



@end