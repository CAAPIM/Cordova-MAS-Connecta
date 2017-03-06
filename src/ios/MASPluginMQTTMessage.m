/*
 * Copyright (c) 2016 CA, Inc.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */
//
//  MASPluginMQTTMessage.m
//  PubSubTest
//
//  Created by YUSSY01 on 16/01/17.
//
//

#import "MASPluginMQTTMessage.h"

#import <MASFoundation/MASMQTTMessage.h>



@interface MASPluginMQTTMessage (Private)

@property (nonatomic, copy) NSMutableDictionary *messages;

@end

@implementation MASPluginMQTTMessage


- (void)initialize:(CDVInvokedUrlCommand*)command {
    
    CDVPluginResult *result;
    
    if ([command.arguments count] > 4) {
        
        NSString *topic = [command.arguments objectAtIndex:0];
        
        NSData *payload = [command.arguments objectAtIndex:1];
        
        unsigned int qos = (unsigned int)[command.arguments objectAtIndex:2];
        
        BOOL retained = [command.arguments objectAtIndex:3];
        
        unsigned int mid = (unsigned int)[command.arguments objectAtIndex:4];
        
        MASMQTTMessage *message =
            [[MASMQTTMessage alloc] initWithTopic:topic payload:payload qos:qos retain:retained mid:mid];
        
        if(!self.messages)
            self.messages = [NSMutableDictionary dictionary];
        
        NSNumber *midNumber = [NSNumber numberWithUnsignedInt:mid];
        [self.messages setObject:message forKey:[midNumber stringValue]];
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:YES];
        
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
    else {
        
        NSDictionary *errorInfo =
            @{@"errorMessage":[NSString stringWithFormat:@"Error Initializing message"]};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
        
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
}


- (void)payloadString:(CDVInvokedUrlCommand*)command {
    
    CDVPluginResult *result;
    
    unsigned int mid = (unsigned int)[command.arguments objectAtIndex:0];
    
    NSNumber *midNumber = [NSNumber numberWithUnsignedInt:mid];
    
    MASMQTTMessage *message = [self.messages objectForKey:[midNumber stringValue]];
    
    if (message) {
        
        NSString *payloadString = [message payloadString];
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:payloadString];
        
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
    else {
        
        NSDictionary *errorInfo =
        @{@"errorMessage":[NSString stringWithFormat:@"Error Initializing message"]};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
        
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
}


- (void)PayloadImage:(CDVInvokedUrlCommand*)command {
 
    CDVPluginResult *result;
    
    unsigned int mid = (unsigned int)[command.arguments objectAtIndex:0];
    
    NSNumber *midNumber = [NSNumber numberWithUnsignedInt:mid];
    
    MASMQTTMessage *message = [self.messages objectForKey:[midNumber stringValue]];
    
    if (message) {
        
        UIImage *payloadImage = [message payloadImage];
        
        NSData *payload = UIImagePNGRepresentation(payloadImage);
        
        NSString *payloadImageBase64 =
            [payload base64EncodedStringWithOptions:NSDataBase64Encoding64CharacterLineLength];
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:payloadImageBase64];
        
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
    else {
        
        NSDictionary *errorInfo =
        @{@"errorMessage":[NSString stringWithFormat:@"Error Initializing message"]};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
        
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
}


@end
