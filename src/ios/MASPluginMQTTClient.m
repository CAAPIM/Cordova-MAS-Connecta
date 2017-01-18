/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

#import "MASPluginMQTTClient.h"

#import <MASFoundation/MASFoundation.h>


typedef void (^OnMQTTMessageReceivedHandler)(MASMQTTMessage *message);

typedef void (^OnMQTTPublishMessageHandler)(NSNumber *messageId);

typedef void (^OnMQTTClientConnectedHandler)(MQTTConnectionReturnCode rc);

typedef void (^OnMQTTClientDisconnectHandler)(MQTTConnectionReturnCode rc);


@interface MASPluginMQTTClient (Private)
<MASConnectaMessagingClientDelegate>


@property (nonatomic, copy) OnMQTTMessageReceivedHandler onMessageReceivedHandler;

@property (nonatomic, copy) OnMQTTPublishMessageHandler onPublishHandler;

@property (nonatomic, copy) OnMQTTClientConnectedHandler onConnectedHandler;

@property (nonatomic, copy) OnMQTTClientDisconnectHandler onDisconnectHandler;


@end


@implementation MASPluginMQTTClient


#pragma mark - Properties

- (void)clientId:(CDVInvokedUrlCommand*)command {
    
    CDVPluginResult *result;
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                               messageAsString:[[MASMQTTClient sharedClient] clientID]];
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void)setClientId:(CDVInvokedUrlCommand*)command {
    
    CDVPluginResult *result;
    
    NSString *clientId = [command.arguments objectAtIndex:0];
    
    [MASMQTTClient sharedClient].clientID = clientId;
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:YES];
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void)isConnected:(CDVInvokedUrlCommand*)command {
    
    CDVPluginResult *result;
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                 messageAsBool:[[MASMQTTClient sharedClient] connected]];
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void)debugMode:(CDVInvokedUrlCommand*)command {
    
    CDVPluginResult *result;
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                 messageAsBool:[[MASMQTTClient sharedClient] debugMode]];
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void)setDebugMode:(CDVInvokedUrlCommand*)command {
    
    CDVPluginResult *result;
    
    BOOL debugMode = [command.arguments objectAtIndex:0];
    
    [MASMQTTClient sharedClient].debugMode = debugMode;
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:YES];
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


#pragma mark - Lifecycle

- (void)initializeMQTTClient:(CDVInvokedUrlCommand*)command {
    
    CDVPluginResult *result;
    
    NSString *clientId = [command.arguments objectAtIndex:0];
    
    BOOL cleanSession = [command.arguments objectAtIndex:1];
    
    MASMQTTClient *masMQTTClient =
    [[MASMQTTClient alloc] initWithClientId:clientId cleanSession:cleanSession];
    
    if (masMQTTClient) {
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:YES];
    }
    else {
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsBool:NO];
    }
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


#pragma mark - Utility methods

- (void)setUserCredentials:(CDVInvokedUrlCommand*)command {
    
    CDVPluginResult *result;
    
    NSString *userName = [command.arguments objectAtIndex:0];
    
    NSString *password = [command.arguments objectAtIndex:1];
    
    [[MASMQTTClient sharedClient] setUsername:userName Password:password];
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:YES];
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void)setWillToTopic:(CDVInvokedUrlCommand*)command {
    
    CDVPluginResult *result;
    
    NSString *payload = [command.arguments objectAtIndex:0];
    
    NSString *topic = [command.arguments objectAtIndex:1];
    
    NSUInteger qos = (NSUInteger)[command.arguments objectAtIndex:2];
    
    BOOL retain = [command.arguments objectAtIndex:3];
    
    [[MASMQTTClient sharedClient] setWill:payload toTopic:topic withQos:qos retain:retain];
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:YES];
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void)clearWill:(CDVInvokedUrlCommand*)command {
    
    CDVPluginResult *result;
    
    [[MASMQTTClient sharedClient] clearWill];
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:YES];
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void)setMessageRetry:(CDVInvokedUrlCommand*)command {
    
    CDVPluginResult *result;
    
    NSUInteger seconds = (NSUInteger)[command.arguments objectAtIndex:0];
    
    [[MASMQTTClient sharedClient] setMessageRetry:seconds];
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:YES];
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void)version:(CDVInvokedUrlCommand*)command {
    
    CDVPluginResult *result;
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                               messageAsString:[MASMQTTClient version]];
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


#pragma mark - MQTT Connection methods

- (void)connect:(CDVInvokedUrlCommand *)command {
    
    __block CDVPluginResult *result;
    
    NSString *clientId = [command.arguments objectAtIndex:0];
    
    NSDictionary *masMQTTConstants = [command.arguments objectAtIndex:1];
    
    [MASMQTTClient sharedClient].clientID = clientId;
    
    [[MASMQTTClient sharedClient]
     connectWithHost:[masMQTTConstants objectForKey:@"host"]
     withPort:(int)[masMQTTConstants objectForKey:@"port"]
     enableTLS:(BOOL)[masMQTTConstants objectForKey:@"enableTLS"]
     usingSSLCACert:[masMQTTConstants objectForKey:@"usingSSLCACert"]
     completionHandler:^(MQTTConnectionReturnCode code) {
         
         if (code == ConnectionAccepted) {
             
             result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsNSUInteger:code];
         }
         else {
             
             result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsNSUInteger:code];
         }
         
         [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
     }];
}

- (void)disconnect:(CDVInvokedUrlCommand *)command {
    
    __block CDVPluginResult *result;
    
    if ([[MASMQTTClient sharedClient] disconnectionHandler]) {
        
        [[MASMQTTClient sharedClient]
         disconnectWithCompletionHandler:[[MASMQTTClient sharedClient] disconnectionHandler]];
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:YES];
        
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
    else {
        
        [[MASMQTTClient sharedClient] disconnectWithCompletionHandler:
         ^(NSUInteger code) {
             
             result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsNSUInteger:code];
             
             [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
         }];
    }
}


- (void)reconnect:(CDVInvokedUrlCommand *)command {
    
    CDVPluginResult *result;
    
    [[MASMQTTClient sharedClient] reconnect];
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:YES];
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}



#pragma mark - Subscribe methods

- (void)subscribe:(CDVInvokedUrlCommand*)command {
    
    __block CDVPluginResult *result;
    
    NSString *topic = [command.arguments objectAtIndex:0];
    
    NSUInteger qos = (NSUInteger)[command.arguments objectAtIndex:1];
    
    [[MASMQTTClient sharedClient] subscribeToTopic:topic
                                           withQos:qos
                                 completionHandler:
     ^(NSArray *grantedQos) {
         
         NSOrderedSet *availableQoS = [NSOrderedSet orderedSetWithArray:@[@0,@1,@2]];
         NSOrderedSet *receivedQoS = [NSOrderedSet orderedSetWithArray:grantedQos];
         
         //
         // If the received QoS is within the availables QoS
         //
         if (![receivedQoS isSubsetOfOrderedSet:availableQoS])
         {
             NSDictionary *errorInfo =
             @{@"errorMessage":[NSString stringWithFormat:@"Error Subscribing to Topic: %@", topic]};
             
             result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
         }
         else
         {
             result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:grantedQos];
         }
         
         [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
     }];
}


- (void)unsubscribe:(CDVInvokedUrlCommand*)command {
    
    __block CDVPluginResult *result;
    
    NSString *topic = [command.arguments objectAtIndex:0];
    
    [[MASMQTTClient sharedClient] unsubscribeFromTopic:topic
                                 withCompletionHandler:
     ^(void) {
         
         result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:YES];
         
         [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
     }];
}


#pragma mark - Publish methods

- (void)publish:(CDVInvokedUrlCommand*)command {
    
    __block CDVPluginResult *result;
    
    NSString *payload = [command.arguments objectAtIndex:0];
    
    NSString *topic = [command.arguments objectAtIndex:1];
    
    NSUInteger qos = (NSUInteger)[command.arguments objectAtIndex:2];
    
    BOOL retain = (BOOL)[command.arguments objectAtIndex:3];
    
    [[MASMQTTClient sharedClient] publishString:payload
                                        toTopic:topic
                                        withQos:qos
                                         retain:retain
                              completionHandler:
     ^(int mid) {
         
         if (mid) {
             
             result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:mid];
         }
         else {
             
             result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:mid];
         }
         
         [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
     }];
}


#pragma mark - Listeners

- (void)onMQTTMessageReceived:(CDVInvokedUrlCommand*)command {
    
    __block CDVPluginResult *result;
    
    __block MASPluginMQTTClient *blockSelf = self;

    self.onMessageReceivedHandler = ^(MASMQTTMessage *message) {
        
        if (message) {
            
            NSMutableDictionary *messageInfo = [NSMutableDictionary dictionary];
            [messageInfo setObject:[NSNumber numberWithUnsignedInteger:message.mid] forKey:@"mid"];
            [messageInfo setObject:message.topic forKey:@"topic"];
            [messageInfo setObject:[message.payload base64EncodedStringWithOptions:0] forKey:@"payload"];
            [messageInfo setObject:[NSNumber numberWithUnsignedInteger:message.qos] forKey:@"qos"];
            [messageInfo setObject:[NSNumber numberWithBool:message.retained] forKey:@"retained"];
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                   messageAsDictionary:messageInfo];
            
            [result setKeepCallbackAsBool:YES];
        }
        else {
            
            NSDictionary *errorInfo =
            @{@"errorMessage":@"Error receiving message as nil"};
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                   messageAsDictionary:errorInfo];
            
            [result setKeepCallbackAsBool:YES];
        }
        
        [blockSelf.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    };
}


- (void)onMQTTPublishMessage:(CDVInvokedUrlCommand*)command {
    
    __block CDVPluginResult *result;
    
    __block MASPluginMQTTClient *blockSelf = self;
    
    self.onPublishHandler = ^(NSNumber *messageId) {
      
        if (messageId) {
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                   messageAsNSUInteger:[messageId unsignedIntegerValue]];
            
            [result setKeepCallbackAsBool:YES];
        }
        else {
            
            NSDictionary *errorInfo =
            @{@"errorMessage":@"Error publishing message as nil"};
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                   messageAsDictionary:errorInfo];
            
            [result setKeepCallbackAsBool:YES];
        }
        
        [blockSelf.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    };
}


- (void)onMQTTClientConnected:(CDVInvokedUrlCommand*)command {
 
    __block CDVPluginResult *result;
    
    __block MASPluginMQTTClient *blockSelf = self;
    
    self.onConnectedHandler = ^(MQTTConnectionReturnCode rc) {
      
        if (rc == ConnectionAccepted) {
        
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsNSUInteger:rc];
            
            [result setKeepCallbackAsBool:YES];
        }
        else {
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsNSUInteger:rc];
            
            [result setKeepCallbackAsBool:YES];
        }
        
        [blockSelf.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    };
}


- (void)onMQTTClientDisconnect:(CDVInvokedUrlCommand*)command {
    
    __block CDVPluginResult *result;
    
    __block MASPluginMQTTClient *blockSelf = self;
    
    self.onDisconnectHandler = ^(MQTTConnectionReturnCode rc) {
        
        if (rc == ConnectionAccepted) {
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsNSUInteger:rc];
            
            [result setKeepCallbackAsBool:YES];
        }
        else {
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsNSUInteger:rc];
            
            [result setKeepCallbackAsBool:YES];
        }
        
        [blockSelf.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    };
}


#pragma mark - MASConnectaMessagingClientDelegate

- (void)onMessageReceived:(MASMQTTMessage *)message {
    
    if (self.onMessageReceivedHandler) {
        
        self.onMessageReceivedHandler(message);
    }
}


- (void)onPublishMessage:(NSNumber *)messageId {
    
    if (self.onPublishHandler) {
        
        self.onPublishHandler(messageId);
    }
}


- (void)onConnected:(MQTTConnectionReturnCode)rc {
    
    if (self.onConnectedHandler) {
        
        self.onConnectedHandler(rc);
    }
}


- (void)onDisconnect:(MQTTConnectionReturnCode)rc {
    
    if (self.onDisconnectHandler) {
        
        self.onDisconnectHandler(rc);
    }
}


@end
