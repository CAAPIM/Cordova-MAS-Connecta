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

#import <MASConnecta/MASConnecta.h>
#import <MASConnecta/MASConnectaConstants.h>
#import <MASIdentityManagement/MASIdentityManagement.h>


typedef void (^OnUserMessageReceivedHandler)(MASMessage *message);


static OnUserMessageReceivedHandler _onUserMessageReceivedHandler_ = nil;


@interface MASConnectaPlugin (Private)
    <MASConnectaMessagingClientDelegate>

@end

@implementation MASConnectaPlugin


#pragma mark - User messaging with MQTT

#pragma mark - Listening to messages

- (void)startListeningToMyMessages:(CDVInvokedUrlCommand *)command
{
    __block CDVPluginResult *result;
    
    if ([MASUser currentUser]) {
        
        [[MASUser currentUser] startListeningToMyMessages:
         ^(BOOL success, NSError *error) {
             
             if(success && !error) {
                 
                 [[NSNotificationCenter defaultCenter] removeObserver:self
                                                                 name:MASConnectaMessageReceivedNotification
                                                               object:nil];
                 
                 [[NSNotificationCenter defaultCenter] addObserver:self
                                                          selector:@selector(messageReceivedNotification:)
                                                              name:MASConnectaMessageReceivedNotification
                                                            object:nil];
                 
                 result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                            messageAsString:@"Started listening to topics"];
             }
             else {
                 
                 NSDictionary *errorInfo = @{@"errorCode":[NSNumber numberWithInteger:[error code]],
                                             @"errorMessage":[error localizedDescription]};
                 
                 result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                        messageAsDictionary:errorInfo];
             }
             
             return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
         }];
    }
    else {
        
        NSDictionary *errorInfo = @{@"errorMessage":@"No authenticated user"};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                               messageAsDictionary:errorInfo];
        
        return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
}


- (void)stopListeningToMyMessages:(CDVInvokedUrlCommand *)command
{
    __block CDVPluginResult *result;
    
    if ([MASUser currentUser]) {
        
        [[MASUser currentUser] stopListeningToMyMessages:
         ^(BOOL success, NSError *error){
             
             if(success && !error) {
                 
                 [[NSNotificationCenter defaultCenter] removeObserver:self
                                                                 name:MASConnectaMessageReceivedNotification
                                                               object:nil];
                 
                 result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                            messageAsString:@"Stopped listening to messages"];
             }
             else {
                 
                 NSDictionary *errorInfo = @{@"errorCode":[NSNumber numberWithInteger:[error code]],
                                             @"errorMessage":[error localizedDescription]};
                 
                 result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                        messageAsDictionary:errorInfo];
             }
             
             return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
         }];
    }
    else {
        
        NSDictionary *errorInfo = @{@"errorMessage":@"No authenticated user"};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                               messageAsDictionary:errorInfo];
        
        return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
}


#pragma mark - Message sending

- (void)sendMessageToUser:(CDVInvokedUrlCommand *)command
{
    __block CDVPluginResult *result;
    
    if ([command.arguments count] > 1) {
        
        NSObject *message = [command.arguments objectAtIndex:0];
        
        NSString *userObjectId = [command.arguments objectAtIndex:1];
        
        [MASUser getUserByObjectId:userObjectId
                        completion:
         ^(MASUser * _Nullable user, NSError * _Nullable error) {
         
             if (user && !error) {
                 
                 [[MASUser currentUser] sendMessage:message toUser:user
                        completion:
                  ^(BOOL success, NSError * _Nullable error) {
                      
                      if (success && !error) {
                          
                          result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:YES];
                      }
                      else {
                          
                          NSDictionary *errorInfo = @{@"errorCode":[NSNumber numberWithInteger:[error code]],
                                                      @"errorMessage":[error localizedDescription]};
                          
                          result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                                 messageAsDictionary:errorInfo];
                      }
                      
                      [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
                 }];
             }
             else {
              
                 NSDictionary *errorInfo = @{@"errorCode":[NSNumber numberWithInteger:[error code]],
                                             @"errorMessage":[error localizedDescription]};
                 
                 result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                        messageAsDictionary:errorInfo];
                 
                 [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
             }
        }];
    }
    else {
        
        NSDictionary *errorInfo = @{@"errorMessage":@"Invalid arguments list"};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                               messageAsDictionary:errorInfo];
        
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
}

- (void)sendMessageToUserOnTopic:(CDVInvokedUrlCommand *)command
{
    __block CDVPluginResult *result;
    
    if ([command.arguments count] > 2) {
        
        NSObject *message = [command.arguments objectAtIndex:0];
        
        NSString *userObjectId = [command.arguments objectAtIndex:1];
        
        NSString *topicName = [command.arguments objectAtIndex:2];
        
        [MASUser getUserByObjectId:userObjectId
                        completion:
         ^(MASUser * _Nullable user, NSError * _Nullable error) {
             
             if (user && !error) {
                 
                 [[MASUser currentUser] sendMessage:message toUser:user onTopic:topicName
                        completion:
                  ^(BOOL success, NSError * _Nullable error) {
                      
                      if (success && !error) {
                          
                          result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:YES];
                      }
                      else {
                          
                          NSDictionary *errorInfo = @{@"errorCode":[NSNumber numberWithInteger:[error code]],
                                                      @"errorMessage":[error localizedDescription]};
                          
                          result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                                 messageAsDictionary:errorInfo];
                      }
                      
                      [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
                  }];
             }
             else {
                 
                 NSDictionary *errorInfo = @{@"errorCode":[NSNumber numberWithInteger:[error code]],
                                             @"errorMessage":[error localizedDescription]};
                 
                 result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                        messageAsDictionary:errorInfo];
                 
                 [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
             }
         }];
    }
    else {
        
        NSDictionary *errorInfo = @{@"errorMessage":@"Invalid arguments list"};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                               messageAsDictionary:errorInfo];
        
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
}


#pragma mark - Listeners

+ (void)setOnUserMessageReceivedHandler:(OnUserMessageReceivedHandler)messageReceived {
    
    _onUserMessageReceivedHandler_ = [messageReceived copy];
}


#pragma mark - Notification observers

- (void)messageReceivedNotification:(NSNotification *)notification
{
    MASMessage *myMessage = notification.userInfo[MASConnectaMessageKey];
 
    if (_onUserMessageReceivedHandler_) {
        
        _onUserMessageReceivedHandler_(myMessage);
    }
}


#pragma mark - Pub/Sub architecture with MQTT

#pragma mark - Constants

typedef void (^OnMQTTMessageReceivedHandler)(MASMQTTMessage *message);

typedef void (^OnMQTTPublishMessageHandler)(NSNumber *messageId);

typedef void (^OnMQTTClientConnectedHandler)(MQTTConnectionReturnCode rc);

typedef void (^OnMQTTClientDisconnectHandler)(MQTTConnectionReturnCode rc);


static OnMQTTMessageReceivedHandler _onMessageReceivedHandler_ = nil;

static OnMQTTPublishMessageHandler _onPublishHandler_ = nil;

static OnMQTTClientConnectedHandler _onConnectedHandler_ = nil;

static OnMQTTClientDisconnectHandler _onDisconnectHandler_ = nil;


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
    
    if (clientId && [clientId length])
        [MASMQTTClient sharedClient].clientID = clientId;
    
    NSString *host = [masMQTTConstants objectForKey:@"host"];
    int port = (int)[[masMQTTConstants objectForKey:@"port"] integerValue];
    BOOL enableTLS = [[masMQTTConstants objectForKey:@"enableTLS"] boolValue];
    NSString *sslCACert = [masMQTTConstants objectForKey:@"usingSSLCACert"];
    
    [[MASMQTTClient sharedClient] setDelegate:self];

    // Try port with TLS
    if (host && !port) {
        
        [[MASMQTTClient sharedClient] connectToHost:host withTLS:enableTLS
                                  completionHandler:
         ^(MQTTConnectionReturnCode code) {
            
            if (code == ConnectionAccepted) {
                
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                       messageAsString:[self toStringConnectionReturnCode:code]];
            }
            else {
                
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                           messageAsString:[self toStringConnectionReturnCode:code]];
            }
            
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        }];
    }
    else if (host && port && ![sslCACert length]) {
        
        [[MASMQTTClient sharedClient] connectWithHost:host withPort:port enableTLS:enableTLS
                                    completionHandler:
         ^(MQTTConnectionReturnCode code) {
            
            if (code == ConnectionAccepted) {
                
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                       messageAsString:[self toStringConnectionReturnCode:code]];
            }
            else {
                
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                           messageAsString:[self toStringConnectionReturnCode:code]];
            }
            
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        }];
    }
    else if (host && port && [sslCACert length]) {
        
        [[MASMQTTClient sharedClient] connectWithHost:host withPort:port enableTLS:enableTLS usingSSLCACert:sslCACert completionHandler:^(MQTTConnectionReturnCode code) {
            
            if (code == ConnectionAccepted) {
                
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                       messageAsString:[self toStringConnectionReturnCode:code]];
            }
            else {
                
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                           messageAsString:[self toStringConnectionReturnCode:code]];
            }
            
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        }];
    }
    else {
        
        [[MASMQTTClient sharedClient] connectToHost:host
                                  completionHandler:
         ^(MQTTConnectionReturnCode code) {
            
            if (code == ConnectionAccepted) {
                
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                       messageAsString:[self toStringConnectionReturnCode:code]];
            }
            else {
                
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                           messageAsString:[self toStringConnectionReturnCode:code]];
            }
            
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        }];
    }
}

- (void)disconnect:(CDVInvokedUrlCommand *)command {
    
    __block CDVPluginResult *result;
    
    [[MASMQTTClient sharedClient] setDelegate:self];

    if ([[MASMQTTClient sharedClient] disconnectionHandler]) {
        
        [[MASMQTTClient sharedClient]
         disconnectWithCompletionHandler:[[MASMQTTClient sharedClient] disconnectionHandler]];
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                   messageAsString:@"Disconnected succesfully !!"];
        
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
    else {
        
        [[MASMQTTClient sharedClient] disconnectWithCompletionHandler:
         ^(NSUInteger code) {
             
             result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                   messageAsString:@"Disconnected succesfully !!"];
             
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
    
    NSUInteger qos = [[command.arguments objectAtIndex:1] integerValue];
    
    if ([[MASMQTTClient sharedClient] connected]) {
        
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
                 NSMutableArray *grantedQoSStr = [self toStringQoS:grantedQos];
                 
                 result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                             messageAsArray:grantedQoSStr];
             }
             
             [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
         }];
    }
    else {
        
        NSDictionary *errorInfo =
            @{@"errorMessage":
                  [NSString stringWithFormat:@"Error Subscribing to Topic: %@ : Client not connected", topic]};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
        
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
}


- (void)unsubscribe:(CDVInvokedUrlCommand*)command {
    
    __block CDVPluginResult *result;
    
    NSString *topic = [command.arguments objectAtIndex:0];
    
    if ([[MASMQTTClient sharedClient] connected]) {
    
        [[MASMQTTClient sharedClient] unsubscribeFromTopic:topic
                                     withCompletionHandler:
         ^(BOOL completed, NSError * _Nullable error) {
            
             if (completed && !error) {
                 
                 result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                            messageAsString:@"Successfully unsubscribed"];
             }
             else {
                 
                 NSDictionary *errorInfo = @{@"errorCode":[NSNumber numberWithInteger:[error code]],
                                             @"errorMessage":[error localizedDescription],
                                             @"errorInfo":[error userInfo]};
                 
                 result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
             }
             
             [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        }];
    }
    else {
     
        NSDictionary *errorInfo =
        @{@"errorMessage":
              [NSString stringWithFormat:@"Error Unsubscribing to Topic: %@ : Client not connected", topic]};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
        
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
}


#pragma mark - Publish methods

- (void)publish:(CDVInvokedUrlCommand*)command {
    
    __block CDVPluginResult *result;
    
    NSString *topic = [command.arguments objectAtIndex:0];
    
    NSString *payload = [command.arguments objectAtIndex:1];
    
    NSUInteger qos = [[command.arguments objectAtIndex:2] integerValue];
    
    BOOL retain = (BOOL)[command.arguments objectAtIndex:3];
    
    if ([[MASMQTTClient sharedClient] connected]) {
        
        [[MASMQTTClient sharedClient] publishString:payload
                                            toTopic:topic
                                            withQos:qos
                                             retain:retain
                                         completion:^(BOOL completed, NSError * _Nullable error, int mid) {
                                             
             if (completed) {
                 
                 result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                            messageAsString:
                           [NSString stringWithFormat:@"Successfully Published - Message with Id : %d", mid]];
             }
             else {
                 
                 result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                            messageAsString:
                           [NSString stringWithFormat:@"Failed to publish - Message with Id : %d", mid]];
             }
             
             [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
         }];
    }
    else {
        
        NSDictionary *errorInfo =
        @{@"errorMessage":
              [NSString stringWithFormat:@"Error Publishing to Topic: %@ : Client not connected", topic]};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
        
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
}


#pragma mark - Listeners

+ (void)setOnConnectedHandler:(OnMQTTClientConnectedHandler)onConnected
{
    _onConnectedHandler_ = [onConnected copy];
}


+ (void)setOnDisconnectHandler:(OnMQTTClientDisconnectHandler)onDisconnect
{
    _onDisconnectHandler_ = [onDisconnect copy];
}


+ (void)setOnMessageReceivedHandler:(OnMQTTMessageReceivedHandler)onMessageReceived
{
    _onMessageReceivedHandler_ = [onMessageReceived copy];
}


+ (void)setOnPublishMessageHandler:(OnMQTTPublishMessageHandler)onPublishMessage
{
    _onPublishHandler_ = [onPublishMessage copy];
}


#pragma mark - MASConnectaMessagingClientDelegate

- (void)onConnected:(MQTTConnectionReturnCode)rc {
    
    if (_onConnectedHandler_) {
        
        _onConnectedHandler_(rc);
    }
}


- (void)onDisconnect:(MQTTConnectionReturnCode)rc {
    
    if (_onDisconnectHandler_) {
        
        _onDisconnectHandler_(rc);
    }
}


- (void)onMessageReceived:(MASMQTTMessage *)message {
    
    if (_onMessageReceivedHandler_) {
        
        _onMessageReceivedHandler_(message);
    }
}


- (void)onPublishMessage:(NSNumber *)messageId {
    
    if (_onPublishHandler_) {
        
        _onPublishHandler_(messageId);
    }
}


#pragma mark - Common

#pragma mark - Register Listeners

- (void)registerReceiver:(CDVInvokedUrlCommand*)command {
    
    __block CDVPluginResult *result;
    
    __block MASConnectaPlugin *blockSelf = self;
    
    [MASConnectaPlugin setOnUserMessageReceivedHandler:^(MASMessage *message) {
        
        if (message && ![message.topic hasSuffix:@"error"]) {
            
            NSMutableDictionary *messageInfo = [NSMutableDictionary dictionary];
            
            message.version ?
                [messageInfo setObject:message.version forKey:@"Version"] :
                [messageInfo setObject:@"" forKey:@"Version"];
            
            message.topic ?
                [messageInfo setObject:message.topic forKey:@"Topic"] :
                [messageInfo setObject:@"" forKey:@"Topic"];
            
            message.receiverObjectId ?
                [messageInfo setObject:message.receiverObjectId forKey:@"ReceiverId"] :
                [messageInfo setObject:@"" forKey:@"ReceiverId"];
            
            [messageInfo setObject:[NSNumber numberWithUnsignedInteger:message.senderType]
                            forKey:@"SenderType"];
            
            message.senderObjectId ?
                [messageInfo setObject:message.senderObjectId forKey:@"SenderId"] :
                [messageInfo setObject:@"" forKey:@"SenderId"];
            
            message.senderDisplayName ?
                [messageInfo setObject:message.senderDisplayName forKey:@"DisplayName"] :
                [messageInfo setObject:@"" forKey:@"DisplayName"];
            
            NSDateFormatter *dateFormat = [[NSDateFormatter alloc] init];
            [dateFormat setDateFormat:@"yyyy-MM-dd'T'HH:mm:ss.SSS"];
            
            NSString *sentTimeStr = [dateFormat stringFromDate:message.sentTime];
            
            sentTimeStr ? [messageInfo setObject:sentTimeStr forKey:@"SentTime"] :
                            [messageInfo setObject:@"" forKey:@"SentTime"];
            
            NSString *payloadStr =
                [[NSString alloc] initWithData:message.payload encoding:NSUTF8StringEncoding];
            
            payloadStr ? [messageInfo setObject:payloadStr forKey:@"Payload"] :
                            [messageInfo setObject:@"" forKey:@"Payload"];

            message.contentType ?
                [messageInfo setObject:message.contentType forKey:@"ContentType"] :
                [messageInfo setObject:@"" forKey:@"ContentType"];
            
            message.contentEncoding ?
                [messageInfo setObject:message.contentEncoding forKey:@"ContentEncoding"] :
                [messageInfo setObject:@"" forKey:@"ContentEncoding"];
            
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
    }];
    
    [MASConnectaPlugin setOnConnectedHandler:^(MQTTConnectionReturnCode rc) {
        
        if (rc == ConnectionAccepted) {
            
            NSDictionary *userInfo =
            [NSDictionary dictionaryWithObjectsAndKeys:
             [NSNumber numberWithUnsignedInteger:rc], @"MQTTConnectionReturnCode", nil];
            
            NSMutableDictionary * payload = [NSMutableDictionary dictionary];
            
            [payload setObject:@"onDisconnect" forKey:@"callback"];
            
            [payload setObject:userInfo forKey:@"payload"];
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:payload];
            
            [result setKeepCallbackAsBool:YES];
        }
        else {
            
            NSDictionary *errorInfo =
            @{@"callback":@"onMessageReceived",
              @"errorMessage":[NSString stringWithFormat:@"Error disconnecting with return code : %lu",(unsigned long)rc]};
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
            
            [result setKeepCallbackAsBool:YES];
        }
        
        [blockSelf.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
    
    [MASConnectaPlugin setOnDisconnectHandler:^(MQTTConnectionReturnCode rc) {
        
        if (rc == ConnectionAccepted) {
            
            
            
            NSDictionary *userInfo = [NSDictionary dictionaryWithObjectsAndKeys:
                                      [NSNumber numberWithUnsignedInteger:rc], @"MQTTConnectionReturnCode", nil];
            
            NSMutableDictionary * payload = [NSMutableDictionary dictionary];
            
            [payload setObject:@"onDisconnect" forKey:@"callback"];
            
            [payload setObject:userInfo forKey:@"payload"];
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:payload];
            
            [result setKeepCallbackAsBool:YES];
        }
        else {
            
            NSDictionary *errorInfo =
            @{@"callback":@"onMessageReceived",
              @"errorMessage":[NSString stringWithFormat:@"Error disconnecting with return code : %lu",(unsigned long)rc]};
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
            
            [result setKeepCallbackAsBool:YES];
        }
        
        [blockSelf.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
    
    [MASConnectaPlugin setOnMessageReceivedHandler:^(MASMQTTMessage *message) {
        
        if (message) {
            
            NSMutableDictionary *messageInfo = [NSMutableDictionary dictionary];
            
            [messageInfo setObject:[NSNumber numberWithUnsignedInteger:message.mid] forKey:@"MID"];
            [messageInfo setObject:message.topic forKey:@"Topic"];
            
            [messageInfo setObject:[[NSString alloc] initWithData:message.payload
                                                         encoding:NSUTF8StringEncoding]
                            forKey:@"Payload"];

            [messageInfo setObject:[NSNumber numberWithUnsignedInteger:message.qos] forKey:@"QoS"];
            [messageInfo setObject:[NSNumber numberWithBool:message.retained] forKey:@"Retained"];
            
//            NSMutableDictionary * payload = [NSMutableDictionary dictionary];
//            
//            [payload setObject:@"onMessageReceived" forKey:@"callback"];
//            
//            [payload setObject:[NSDictionary dictionaryWithObjectsAndKeys:messageInfo, @"message", nil]
//                        forKey:@"Payload"];
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:messageInfo];
            
            [result setKeepCallbackAsBool:YES];
        }
        else {
            
            NSDictionary *errorInfo =
            @{@"callback":@"onMessageReceived",
              @"errorMessage":@"Error receiving message as nil"};
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                   messageAsDictionary:errorInfo];
            
            [result setKeepCallbackAsBool:YES];
        }
        
        [blockSelf.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
    
    [MASConnectaPlugin setOnPublishMessageHandler:^(NSNumber *messageId) {
        
        if (messageId) {
            
            NSMutableDictionary * payload = [NSMutableDictionary dictionary];
            
            [payload setObject:@"onPublishMessage" forKey:@"callback"];
            
            [payload setObject:[NSDictionary dictionaryWithObjectsAndKeys:messageId, @"messageId", nil]
                        forKey:@"payload"];
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:payload];
            
            [result setKeepCallbackAsBool:YES];
        }
        else {
            
            NSDictionary *errorInfo =
            @{@"callback":@"onPublishMessage",
              @"errorMessage":@"Error publishing message as nil"};
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                   messageAsDictionary:errorInfo];
            
            [result setKeepCallbackAsBool:YES];
        }
        
        [blockSelf.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}


#pragma mark - Utillity

- (NSMutableArray *)toStringQoS:(NSArray *)grantedQoS {
    
    NSMutableArray *toStringQoS = [NSMutableArray array];
    
    for (int i = 0; i < [grantedQoS count]; i++) {
        
        NSNumber *QoS = [grantedQoS objectAtIndex:i];
        
        switch ([QoS integerValue]) {
            
            case AtMostOnce:
            
                [toStringQoS addObject:@"AtMostOnce"];
            
                break;
            
            case AtLeastOnce:
            
                [toStringQoS addObject:@"AtLeastOnce"];
            
                break;
            
            case ExactlyOnce:
            
                [toStringQoS addObject:@"ExactlyOnce"];
            
                break;
        }
    }
    
    return toStringQoS;
}


- (NSString *)toStringConnectionReturnCode:(MQTTConnectionReturnCode)rc {
    
    NSString *rcStr = @"None";
    
    switch (rc) {
        
        case ConnectionAccepted:
        
            rcStr = @"ConnectionAccepted";
        
        break;
        
        case ConnectionRefusedUnacceptableProtocolVersion:
        
            rcStr = @"ConnectionRefusedUnacceptableProtocolVersion";
        
        break;
        
        case ConnectionRefusedIdentifierRejected:
        
            rcStr = @"ConnectionRefusedIdentifierRejected";
        
        break;
        
        case ConnectionRefusedServerUnavailable:
        
            rcStr = @"ConnectionRefusedServerUnavailable";
        
        break;
        
        case ConnectionRefusedBadUserNameOrPassword:
        
            rcStr = @"ConnectionRefusedBadUserNameOrPassword";
        
        break;
        
        case ConnectionRefusedNotAuthorized:
        
            rcStr = @"ConnectionRefusedNotAuthorized";
        
        break;
    }
    
    return rcStr;
}


@end
