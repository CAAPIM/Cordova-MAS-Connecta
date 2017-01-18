package com.ca.mas.cordova.connecta;

import android.util.Base64;
import android.util.Log;

import com.ca.mas.connecta.client.MASConnectOptions;
import com.ca.mas.connecta.client.MASConnectaClient;
import com.ca.mas.connecta.client.MASConnectaManager;
import com.ca.mas.cordova.core.MASCordovaException;
import com.ca.mas.foundation.MASCallback;
import com.ca.mas.foundation.MASException;
import com.ca.mas.messaging.MASMessage;
import com.ca.mas.messaging.topic.MASTopic;
import com.ca.mas.messaging.topic.MASTopicBuilder;
import com.ca.mas.messaging.util.MessagingConsts;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import static com.ca.mas.cordova.connecta.MASConnectaUtil.getError;

/**
 * Created by trima09 on 17/01/2017.
 */

public class MASPluginMQTTClient extends CordovaPlugin {
    private static final String TAG = MASPluginMQTTClient.class.getCanonicalName();

    @Override
    protected void pluginInitialize() {
        super.pluginInitialize();
    }

    @Override
    public boolean execute(String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        if (action.equalsIgnoreCase("connect")) {
            connect(args, callbackContext);
        } else if (action.equalsIgnoreCase("disconnect")) {
            disconnect(args, callbackContext);
        } else if (action.equalsIgnoreCase("subscribe")) {
            subscribe(args, callbackContext);
        } else if (action.equalsIgnoreCase("unsubscribe")) {
            unsubscribe(args, callbackContext);
        } else if (action.equalsIgnoreCase("publish")) {
            publish(args, callbackContext);
        } else if (action.equalsIgnoreCase("initializeMQTTClient")) {
            success(callbackContext, true);
        } else if (action.equalsIgnoreCase("isConnected")) {
            success(callbackContext, MASConnectaManager.getInstance().isConnected());
        } else {
            callbackContext.error("Invalid action");
            return false;
        }
        return true;
    }

    private void connect(final JSONArray args, final CallbackContext callbackContext) {
        JSONObject connOpts = null;
        final MASConnectOptions connectOptions;
        String clientId = null;
        try {
            clientId = args.optString(0);
            if (!MASConnectaUtil.isNullOrEmpty(clientId)) {
                MASConnectaManager.getInstance().setClientId(clientId);
            }
            connOpts = args.optJSONObject(1);
            connectOptions = MASConnectaUtil.getConnectOptions(connOpts);
            if (connectOptions != null) {
                MASConnectaManager.getInstance().setConnectOptions(connectOptions);
            }
        } catch (MASCordovaException mc) {
            callbackContext.error(getError(mc));
            return;
        }


        MASConnectaManager.getInstance().connect(new MASCallback<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                String message = "Successfully connected to host:" + connectOptions.getServerURIs()[0];
                success(callbackContext, message);
            }

            @Override
            public void onError(Throwable throwable) {
                Log.e(TAG, throwable.getMessage());
                callbackContext.error(getError(new MASCordovaException("Unable to connect to host :" + connectOptions.getServerURIs()[0] + "::" + throwable.getMessage())));
            }
        });
    }

    private void disconnect(final JSONArray args, final CallbackContext callbackContext) {
        MASConnectaManager.getInstance().disconnect(new MASCallback<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                String message = "Successfully disconnected from host";
                success(callbackContext, message);
            }

            @Override
            public void onError(Throwable throwable) {
                Log.e(TAG, throwable.getMessage());
                callbackContext.error(getError(new MASCordovaException("Unable to disconnect from host :" + throwable.getMessage())));
            }
        });
    }

    private void subscribe(final JSONArray args, final CallbackContext callbackContext) {
        String topicName = null;
        int qos = MASConnectaClient.EXACTLY_ONCE;
        MASTopic masTopic = null;
        try {
            topicName = args.getString(0);
            qos = args.optInt(1, MASConnectaClient.EXACTLY_ONCE);
            masTopic = new MASTopicBuilder().setCustomTopic(topicName).setQos(qos).enforceTopicStructure(false).build();
        } catch (JSONException e) {
            callbackContext.error(getError(new MASCordovaException("Invaid Input, topic/qos missing")));
            return;
        } catch (MASException e) {
            callbackContext.error(getError(new MASCordovaException("Invaid Input, topic/qos missing")));
            return;
        }

        MASConnectaManager.getInstance().subscribe(masTopic, new MASCallback<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                String message = "Successfully subscribed to topic";
                success(callbackContext, message);
            }

            @Override
            public void onError(Throwable throwable) {
                Log.e(TAG, throwable.getMessage());
                callbackContext.error(getError(new MASCordovaException("Unable to subscribe to topic:" + throwable.getMessage())));
            }
        });
    }

    private void unsubscribe(final JSONArray args, final CallbackContext callbackContext) {
        final String topicName;
        try {
            topicName = args.getString(0);
        } catch (JSONException e) {
            callbackContext.error(getError(new MASCordovaException("Topic Name is missing")));
            return;
        }
        MASTopic masTopic = new MASTopicBuilder().setCustomTopic(topicName).enforceTopicStructure(false).build();
        MASConnectaManager.getInstance().unsubscribe(masTopic, new MASCallback<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                String message = "Unsubscribed to topic";
                success(callbackContext, message);
            }

            @Override
            public void onError(Throwable throwable) {
                Log.e(TAG, throwable.getMessage());
                callbackContext.error(getError(new MASCordovaException("Unable to unsubscribe to topic:" + throwable.getMessage())));
            }
        });
    }

    private void publish(final JSONArray args, final CallbackContext callbackContext) {
        String topicName = null;
        byte[] message = null;
        String contentType = MessagingConsts.DEFAULT_TEXT_PLAIN_CONTENT_TYPE;
        MASTopic masTopic = null;
        int qos = MASConnectaClient.EXACTLY_ONCE;
        boolean retained = false;

        try {
            topicName = args.getString(0);
            qos = args.optInt(2, MASConnectaClient.EXACTLY_ONCE);
            retained = args.optBoolean(3, false);
            masTopic = new MASTopicBuilder().setCustomTopic(topicName).setQos(qos).enforceTopicStructure(false).build();
            String message_0 = args.getString(1);
            message = decodeBase64IncomingMessage(message_0);
            //contentType = args.optString(2,"text/plain");

        } catch (JSONException e) {
            callbackContext.error(getError(new MASCordovaException("Invaid Input, topic/message/qos/retained missing")));
            return;
        } catch (MASException e) {
            callbackContext.error(getError(new MASCordovaException("Invaid Input, topic/message/qos/retained missing")));
            return;
        } catch (MASCordovaException e) {
            callbackContext.error(getError(e));
            return;
        }

        MASMessage masMessage = MASMessage.newInstance();
        masMessage.setContentType(contentType);
        masMessage.setPayload(message);
        masMessage.setRetained(retained);
        MASConnectaManager.getInstance().publish(masTopic, masMessage, new MASCallback<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                String result = "Message send successfully";
                success(callbackContext, result);
            }

            @Override
            public void onError(Throwable throwable) {
                Log.e(TAG, throwable.getMessage());
                callbackContext.error(getError(new MASCordovaException("Message sending failure:" + throwable.getMessage())));
            }
        });
    }


    private byte[] decodeBase64IncomingMessage(String message) throws MASCordovaException {
        try {
            return Base64.decode(message, Base64.DEFAULT);
        } catch (Exception ex) {
            throw new MASCordovaException("Invalid message format");
        }
    }


    private void success(CallbackContext callbackContext, boolean value) {
        PluginResult result = new PluginResult(PluginResult.Status.OK, value);
        callbackContext.sendPluginResult(result);
    }

    private void success(CallbackContext callbackContext, JSONObject resultData) {
        PluginResult result = new PluginResult(PluginResult.Status.OK, resultData);
        callbackContext.sendPluginResult(result);
    }

    private void success(CallbackContext callbackContext, Object resultData) {
        PluginResult result = new PluginResult(PluginResult.Status.OK, resultData.toString());
        callbackContext.sendPluginResult(result);
    }

    private void success(CallbackContext callbackContext, JSONArray resultData) {
        PluginResult result = new PluginResult(PluginResult.Status.OK, resultData);
        callbackContext.sendPluginResult(result);
    }
}
