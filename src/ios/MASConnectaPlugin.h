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



#pragma mark - Message sending

- (void)startListeningToMyMessages:(CDVInvokedUrlCommand*)command;



- (void)stopListeningToMyMessages:(CDVInvokedUrlCommand*)command;



#pragma mark - Message sending

- (void)sendMessageToUser:(CDVInvokedUrlCommand*)command;



- (void)sendMessageToUserOnTopicCompletion:(CDVInvokedUrlCommand*)command;



@end
