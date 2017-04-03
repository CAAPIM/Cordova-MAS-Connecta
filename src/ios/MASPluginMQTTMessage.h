/*
 * Copyright (c) 2016 CA, Inc.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */
//
//  MASPluginMQTTMessage.h
//  PubSubTest
//
//  Created by YUSSY01 on 16/01/17.
//
//

#import <Cordova/CDV.h>



@interface MASPluginMQTTMessage : CDVPlugin



- (void)initialize:(CDVInvokedUrlCommand*)command;



- (void)payloadString:(CDVInvokedUrlCommand*)command;



- (void)PayloadImage:(CDVInvokedUrlCommand*)command;



@end
