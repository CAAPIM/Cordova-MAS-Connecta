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
#import <MASIdentityManagement/MASIdentityManagement.h>


@implementation MASConnectaPlugin


- (void)startListeningToMyMessages:(CDVInvokedUrlCommand *)command
{
    __block CDVPluginResult *result;
    
    [[MASUser currentUser] startListeningToMyMessages:
     ^(BOOL success, NSError *error) {
        
         if(success && !error) {
            
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


@end
