/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

//
//  MASConnectaPlugin.h
//

#import <Cordova/CDV.h>



///--------------------------------------
/// @name MASConnectaPlugin
///--------------------------------------

@interface MASConnectaPlugin : CDVPlugin



#pragma mark - User messaging with MQTT

#pragma mark - Listening to messages

- (void)startListeningToMyMessages:(CDVInvokedUrlCommand*)command;



- (void)stopListeningToMyMessages:(CDVInvokedUrlCommand*)command;



#pragma mark - Message sending

- (void)sendMessageToUser:(CDVInvokedUrlCommand*)command;



- (void)sendMessageToUserOnTopic:(CDVInvokedUrlCommand *)command;



#pragma mark - Pub/Sub architecture with MQTT

#pragma mark - Properties

- (void)clientId:(CDVInvokedUrlCommand*)command;



- (void)setClientId:(CDVInvokedUrlCommand*)command;



- (void)isConnected:(CDVInvokedUrlCommand*)command;



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

- (void)registerReceiver:(CDVInvokedUrlCommand*)command;



@end
