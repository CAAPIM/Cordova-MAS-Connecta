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



@interface MASConnectaPlugin : CDVPlugin

///--------------------------------------
/// @name MASConnectaPlugin
///--------------------------------------

- (void)sendMessageToUser:(CDVInvokedUrlCommand*)command;

- (void)sendMessageToUserOnTopicCompletion:(CDVInvokedUrlCommand*)command;

- (void)startListeningToMyMessages:(CDVInvokedUrlCommand*)command;

- (void)stopListeningToMyMessages:(CDVInvokedUrlCommand*)command;

@end
