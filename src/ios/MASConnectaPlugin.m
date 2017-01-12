/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

//
//  MASConnectaPlugin.m
//

#import "MASConnectaPlugin.h"

#import <MASFoundation/MASFoundation.h>
#import <MASConnecta/MASConnecta.h>
#import <MASIdentityManagement/MASIdentityManagement.h>

@interface MASConnectaPlugin (Private)

@end

@implementation MASConnectaPlugin

- (void)sendMessageToUser:(CDVInvokedUrlCommand *)command
{
    __block CDVPluginResult *result;
    
    
    NSDictionary *userDictionary = nil;
    if (command.arguments.count>0) {
        userDictionary = [command.arguments objectAtIndex:0];
    }
    NSString *sendToUserName = [userDictionary objectForKey:@"userName"];
    
    NSObject *messageObject = nil;
    if (command.arguments.count>1) {
        messageObject = [command.arguments objectAtIndex:1];
    }
    
    NSString *mimeType = nil;
    if (command.arguments.count>2) {
        mimeType = [command.arguments objectAtIndex:2];
    }
    
    MASMessage *message = nil;
    MASUser *user = [MASUser currentUser];
    if([mimeType isEqualToString:@"text/plain"]){
        message = [message initWithPayloadString:(NSString*)messageObject contentType:@"text/plain"];

    }
    else if([mimeType isEqualToString:@"application/json"]) {
        message = [message initWithPayloadData:(NSData*)messageObject contentType:@"application/json"];
    }
    else {
        message = [message initWithPayloadString:@"" contentType:@"text/plain"];
    }
    
    
    [MASUser getUserByObjectId:sendToUserName completion:^(MASUser *sendToUser, NSError *error){
        [user sendMessage:message toUser:sendToUser completion:^(BOOL success, NSError *error){
            if(error) {
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Could not send message"];
            }
            else {
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Message Sent"];
            }
            
            return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        }];
    }];
}

- (void)sendMessageToUserOnTopicCompletion:(CDVInvokedUrlCommand *)command
{
    __block CDVPluginResult *result;
    
    
    NSString *topicName = nil;
    if (command.arguments.count>0) {
        topicName = [command.arguments objectAtIndex:0];
    }
    NSString *sendToUserName = [MASUser currentUser];
    
    NSObject *messageObject = nil;
    if (command.arguments.count>1) {
        messageObject = [command.arguments objectAtIndex:1];
    }
    
    NSString *mimeType = nil;
    if (command.arguments.count>2) {
        mimeType = [command.arguments objectAtIndex:2];
    }
    
    MASMessage *message = nil;
    MASUser *user = [MASUser currentUser];
    if([mimeType isEqualToString:@"text/plain"]){
        message = [message initWithPayloadString:(NSString*)messageObject contentType:@"text/plain"];

    }
    else if([mimeType isEqualToString:@"application/json"]) {
        message = [message initWithPayloadData:(NSData*)messageObject contentType:@"application/json"];
    }
    else {
        message = [message initWithPayloadString:@"" contentType:@"text/plain"];
    }
    
    
    [user sendMessage:message toUser:sendToUserName onTopic:topicName completion:^(BOOL success, NSError *error){
        if(error) {
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Could not send message"];
        }
        else {
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Message Sent"];
        }
        return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void)startListeningToMyMessages:(CDVInvokedUrlCommand *)command
{
    __block CDVPluginResult *result;
    MASUser *currentUser = [MASUser currentUser];
    
    [currentUser startListeningToMyMessages:^(BOOL success, NSError *error){
        if(error) {
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Could not start service"];
        }
        else {
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Started listening to topics"];
        }
        return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void)stopListeningToMyMessages:(CDVInvokedUrlCommand *)command
{
    __block CDVPluginResult *result;
    MASUser *currentUser = [MASUser currentUser];
    
    [currentUser stopListeningToMyMessages:^(BOOL success, NSError *error){
        if(error) {
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Could not stop service"];
        }
        else {
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Stopped listening to messages"];
        }
        return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}


@end
