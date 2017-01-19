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


@interface MASConnectaPlugin (Private)

@property (nonatomic, copy) OnUserMessageReceivedHandler onMessageReceivedHandler;

@end


@implementation MASConnectaPlugin


- (void)startListeningToMyMessages:(CDVInvokedUrlCommand *)command
{
    __block CDVPluginResult *result;
    
    [[MASUser currentUser] startListeningToMyMessages:
     ^(BOOL success, NSError *error) {
        
         if(success && !error) {
            
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


- (void)stopListeningToMyMessages:(CDVInvokedUrlCommand *)command
{
    __block CDVPluginResult *result;
    
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
                 
                 [user sendMessage:message toUser:user
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

- (void)sendMessageToTopic:(CDVInvokedUrlCommand *)command
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
                 
                 [user sendMessage:message toUser:user onTopic:topicName
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

- (void)registerReceiver:(CDVInvokedUrlCommand*)command {
    
    __block CDVPluginResult *result;
    
    __block MASConnectaPlugin *blockSelf = self;
    
    self.onMessageReceivedHandler = ^(MASMessage *message) {
        
        if (message) {
            
            NSMutableDictionary *messageInfo = [NSMutableDictionary dictionary];
            [messageInfo setObject:message.version forKey:@"version"];
            [messageInfo setObject:message.topic forKey:@"topic"];
            [messageInfo setObject:message.receiverObjectId forKey:@"receiverObjectId"];
            [messageInfo setObject:[NSNumber numberWithUnsignedInteger:message.senderType]
                            forKey:@"senderType"];
            [messageInfo setObject:message.senderObjectId forKey:@"senderObjectId"];
            [messageInfo setObject:message.senderDisplayName forKey:@"senderDisplayName"];
            [messageInfo setObject:message.sentTime forKey:@"sentTime"];            
            [messageInfo setObject:[message.payload base64EncodedStringWithOptions:0] forKey:@"payload"];
            [messageInfo setObject:message.contentType forKey:@"contentType"];
            [messageInfo setObject:message.contentEncoding forKey:@"contentEncoding"];
            
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


#pragma mark - Notification observers

- (void)messageReceivedNotification:(NSNotification *)notification
{
    MASMessage *myMessage = notification.userInfo[MASConnectaMessageKey];
 
    if (self.onMessageReceivedHandler) {
        
        self.onMessageReceivedHandler(myMessage);
    }
}


@end
