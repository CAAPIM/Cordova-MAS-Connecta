//
//  MASConnectaUtil.js
//

var MASConnectaUtil = function(){

    /*
    * ContentType : The various content or mime type supported for the message.
    */
    this.ContentType = {
      	TEXT_PLAIN:"text/plain",
       	APPLICATION_JSON:"application/json",
       	APPLICATION_BYTESTREAM:"application/octet-stream",
       	IMAGE:"image/jpeg"
    },

    /*
    * BroadcastReceiver : The receiver to be registered with the native Braodcast Receiver to receive all messages of type MAS Message. It is must to initialize this
    * class before any other function of MASConnectaPlugin. Call MASConnectaPlugin.MASConnectaUtil.registerReceiver in your apps onLoad or onDeviceReady. The successHandler
    * passed to the register function would be invoked everytime a message is received. Developer can pass their custom logic to consume the message.
    */
    this.registerReceiver = function(successHandler,errorHandler){
    	return Cordova.exec(successHandler, errorHandler, "MASConnectaPlugin", "registerReceiver", []);
    }
}

module.exports = MASConnectaUtil;