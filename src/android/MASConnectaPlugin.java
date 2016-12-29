package com.ca.mas.cordova.connecta;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.util.Base64;
import android.util.Log;

import com.ca.mas.connecta.client.MASConnectOptions;
import com.ca.mas.connecta.client.MASConnectaManager;
import com.ca.mas.connecta.util.ConnectaConsts;
import com.ca.mas.cordova.core.MASCordovaException;
import com.ca.mas.foundation.MASCallback;
import com.ca.mas.foundation.MASException;
import com.ca.mas.foundation.MASUser;
import com.ca.mas.messaging.MASMessage;
import com.ca.mas.messaging.topic.MASTopic;
import com.ca.mas.messaging.topic.MASTopicBuilder;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import static com.ca.mas.cordova.connecta.MASConnectaUtil.getError;
import static com.ca.mas.foundation.MASUser.getCurrentUser;


public class MASConnectaPlugin extends CordovaPlugin {

    private static final String TAG = MASConnectaPlugin.class.getCanonicalName();
    private static CallbackContext _messageReceiverCallback = null;

    @Override
    protected void pluginInitialize() {
        super.pluginInitialize();
    }

    @Override
    public boolean execute(String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        if (action.equalsIgnoreCase("registerReceiver")) {
            registerReceiver(args, callbackContext);
        } else if (action.equalsIgnoreCase("startListeningToTopic")) {
            startListeningToTopic(args, callbackContext);
        } else if (action.equalsIgnoreCase("startListeningToMyMessages")) {
            startListeningToMyMessages(args, callbackContext);
        } else if (action.equalsIgnoreCase("stopListeningToMyMessages")) {
            stopListeningToMyMessages(args, callbackContext);
        } else if (action.equalsIgnoreCase("sendMessageToTopic")) {
            sendMessageToTopic(args, callbackContext);
        } else if (action.equalsIgnoreCase("sendMessageToUser")) {
            sendMessageToUser(args, callbackContext);
        } else if (action.equalsIgnoreCase("connect")) {
            connect(args, callbackContext);
        } else if (action.equalsIgnoreCase("disconnect")) {
            disconnect(args, callbackContext);
        } else if (action.equalsIgnoreCase("subscribe")) {
            subscribe(args, callbackContext);
        } else if (action.equalsIgnoreCase("unsubscribe")) {
            unsubscribe(args, callbackContext);
        } else if (action.equalsIgnoreCase("publish")) {
            publish(args, callbackContext);
        } else {
            callbackContext.error("Invalid action");
            return false;
        }
        return true;
    }

    /**
     * Register the listener for incoming messages
     */
    private void registerReceiver(final JSONArray args, final CallbackContext callbackContext) {
        _messageReceiverCallback = callbackContext;
        try {
            IntentFilter intentFilter = new IntentFilter();
            intentFilter.addAction(ConnectaConsts.MAS_CONNECTA_BROADCAST_MESSAGE_ARRIVED);

            BroadcastReceiver receiver = new BroadcastReceiver() {
                @Override
                public void onReceive(Context context, Intent intent) {
                    if (intent.getAction().equals(ConnectaConsts.MAS_CONNECTA_BROADCAST_MESSAGE_ARRIVED)) {
                        try {
                            MASMessage message = MASMessage.newInstance(intent);
                            final String senderId = message.getSenderId();
                            final String contentType = message.getContentType();
                            if (contentType.startsWith("image")) {
                                byte[] msg = message.getPayload();
                                Log.w(TAG, "message receiver got image from " + senderId + ", image length " + msg.length);
                            } else {
                                byte[] msg = message.getPayload();
                                final String m = new String(Base64.decode(msg, Base64.NO_WRAP));
                                Log.w(TAG, "message receiver got text message from " + senderId + ", " + m);
                            }
                            JSONObject obj = new JSONObject(message.createJSONStringFromMASMessage(context));
                            PluginResult result = new PluginResult(PluginResult.Status.OK, obj);
                            result.setKeepCallback(true);
                            _messageReceiverCallback.sendPluginResult(result);
                        } catch (JSONException jce) {
                            Log.w(TAG, "message parse exception: " + jce);
                        } catch (MASException me) {
                            Log.w(TAG, "message receiver exception: " + me);
                        }
                    }
                }
            };
            this.cordova.getActivity().getApplicationContext().registerReceiver(receiver, intentFilter);
            PluginResult result = new PluginResult(PluginResult.Status.OK, true);
            result.setKeepCallback(true);
            callbackContext.sendPluginResult(result);
        } catch (Exception ex) {
            Log.w(TAG, "initMessageReceiver exception: " + ex);
            callbackContext.error("Unable to initialize:" + ex.getMessage());
        }
    }

    private void startListeningToTopic(final JSONArray args, final CallbackContext callbackContext) {
        if (getCurrentUser() == null) {
            MASUser.login(new MASCallback<MASUser>() {
                @Override
                public void onSuccess(MASUser masUser) {
                    startListeningToTopic(args, callbackContext);
                }

                @Override
                public void onError(Throwable throwable) {
                    callbackContext.error(getError(throwable));
                    return;
                }
            });
        } else {
            final String topicName;
            try {
                topicName = args.getString(0);
            } catch (JSONException e) {
                callbackContext.error(getError(new MASCordovaException("Topic Name is missing")));
                return;
            }
            try {
                final MASTopic masTopic = new MASTopicBuilder().setUserId(getCurrentUser().getId()).setCustomTopic(topicName).build();
                getCurrentUser().startListeningToTopic(masTopic, new MASCallback<Void>() {
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
            } catch (MASException mex) {
                Log.e(TAG, mex.getMessage());
                callbackContext.error(getError(new MASCordovaException("Unable to subscribe to topic:" + mex.getMessage())));
            }
        }
    }

    private void stopListeningToTopic(final JSONArray args, final CallbackContext callbackContext) {
        if (getCurrentUser() == null) {
            MASUser.login(new MASCallback<MASUser>() {
                @Override
                public void onSuccess(MASUser masUser) {
                    stopListeningToTopic(args, callbackContext);
                }

                @Override
                public void onError(Throwable throwable) {
                    callbackContext.error(getError(throwable));
                    return;
                }
            });
        } else {
            final String topicName;
            try {
                topicName = args.getString(0);
            } catch (JSONException e) {
                callbackContext.error(getError(new MASCordovaException("Topic Name is missing")));
                return;
            }
            try {
                final MASTopic masTopic = new MASTopicBuilder().setUserId(getCurrentUser().getId()).setCustomTopic(topicName).build();
                getCurrentUser().stopListeningToTopic(masTopic, new MASCallback<Void>() {
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
            } catch (MASException mex) {
                Log.e(TAG, mex.getMessage());
                callbackContext.error(getError(new MASCordovaException("Unable to unsubscribe to topic:" + mex.getMessage())));
            }
        }
    }

    private void startListeningToMyMessages(final JSONArray args, final CallbackContext callbackContext) {
        if (getCurrentUser() == null) {
            MASUser.login(new MASCallback<MASUser>() {
                @Override
                public void onSuccess(MASUser masUser) {
                    startListeningToMyMessages(args, callbackContext);
                }

                @Override
                public void onError(Throwable throwable) {
                    callbackContext.error(getError(throwable));
                    return;
                }
            });
        } else {
            getCurrentUser().startListeningToMyMessages(new MASCallback<Void>() {
                @Override
                public void onSuccess(Void aVoid) {
                    String message = "Started listening to my messages";
                    success(callbackContext, message);
                }

                @Override
                public void onError(Throwable throwable) {
                    Log.e(TAG, throwable.getMessage());
                    callbackContext.error(getError(new MASCordovaException("Unable to listen to my messages:" + throwable.getMessage())));
                }
            });
        }
    }

    private void stopListeningToMyMessages(final JSONArray args, final CallbackContext callbackContext) {
        if (getCurrentUser() == null) {
            MASUser.login(new MASCallback<MASUser>() {
                @Override
                public void onSuccess(MASUser masUser) {
                    stopListeningToMyMessages(args, callbackContext);
                }

                @Override
                public void onError(Throwable throwable) {
                    callbackContext.error(getError(throwable));
                    return;
                }
            });
        } else {
            getCurrentUser().startListeningToMyMessages(new MASCallback<Void>() {
                @Override
                public void onSuccess(Void aVoid) {
                    String message = "Unsubscribed to my messages";
                    success(callbackContext, message);
                }

                @Override
                public void onError(Throwable throwable) {
                    Log.e(TAG, throwable.getMessage());
                    callbackContext.error(getError(new MASCordovaException("Unable to unsubscribe to my messages:" + throwable.getMessage())));
                }
            });
        }
    }

    private void sendMessageToTopic(final JSONArray args, final CallbackContext callbackContext) {
        if (getCurrentUser() == null) {
            MASUser.login(new MASCallback<MASUser>() {
                @Override
                public void onSuccess(MASUser masUser) {
                    sendMessageToTopic(args, callbackContext);
                }

                @Override
                public void onError(Throwable throwable) {
                    callbackContext.error(getError(throwable));
                    return;
                }
            });
        } else {
            String topic = null;
            byte[] message = null;
            String contentType = null;
            MASTopic masTopic = null;

            try {
                topic = args.getString(0);
                masTopic = new MASTopicBuilder().setUserId(getCurrentUser().getId()).setCustomTopic(topic).build();
                String message_0 = args.getString(1);
                message = decodeBase64IncomingMessage(message_0);
                contentType = args.getString(2);
            } catch (JSONException e) {
                callbackContext.error(getError(new MASCordovaException("Invaid Input, topic/message/contentType missing")));
                return;
            } catch (MASCordovaException e) {
                callbackContext.error(getError(e));
                return;
            } catch (MASException e) {
                callbackContext.error(getError(new MASCordovaException("Invaid topic details:" + e.getMessage())));
                return;
            }

            MASMessage masMessage = MASMessage.newInstance();
            masMessage.setContentType(contentType);
            masMessage.setPayload(message);
            getCurrentUser().sendMessage(masTopic, masMessage, new MASCallback<Void>() {
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
    }


    private void sendMessageToUser(final JSONArray args, final CallbackContext callbackContext) {
        if (getCurrentUser() == null) {
            MASUser.login(new MASCallback<MASUser>() {
                @Override
                public void onSuccess(MASUser masUser) {
                    sendMessageToUser(args, callbackContext);
                }

                @Override
                public void onError(Throwable throwable) {
                    callbackContext.error(getError(throwable));
                    return;
                }
            });
        } else {
            String userName = null;
            final byte[] message;
            final String contentType;
            final MASTopic masTopic;

            try {
                userName = args.getString(0);
                String message_0 = args.getString(1);
                message = decodeBase64IncomingMessage(message_0);
                contentType = args.getString(2);
            } catch (JSONException e) {
                callbackContext.error(getError(new MASCordovaException("Invaid Input, userName/contentType/message missing")));
                return;
            } catch (MASCordovaException e) {
                callbackContext.error(getError(e));
                return;
            }
            getCurrentUser().getUserById(userName, new MASCallback<MASUser>() {
                @Override
                public void onSuccess(final MASUser masUser) {
                    if (masUser == null) {
                        callbackContext.error(getError(new MASCordovaException("User not Found")));
                        return;
                    }

                    MASMessage masMessage = MASMessage.newInstance();
                    masMessage.setContentType(contentType);
                    masMessage.setPayload(message);
                    getCurrentUser().sendMessage(masMessage, masUser, new MASCallback<Void>() {
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

                @Override
                public void onError(Throwable throwable) {
                    callbackContext.error(getError(new MASCordovaException("User not Found")));
                    return;
                }
            });
        }
    }

    private void connect(final JSONArray args, final CallbackContext callbackContext) {
        JSONObject connOpts;
        final MASConnectOptions connectOptions;
        final String clientId;
        try {
            connOpts = args.getJSONObject(0);
            connectOptions = MASConnectaUtil.getConnectOptions(connOpts);
            clientId = args.getString(1);
        } catch (MASCordovaException mc) {
            callbackContext.error(getError(mc));
            return;
        } catch (JSONException e) {
            callbackContext.error(getError(new MASCordovaException("ConnectOptions missing is missing")));
            return;
        }
        if (connectOptions != null) {
            MASConnectaManager.getInstance().setConnectOptions(connectOptions);
        }
        if (!MASConnectaUtil.isNullOrEmpty(clientId)) {
            MASConnectaManager.getInstance().setClientId(clientId);
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
        final String topicName;
        try {
            topicName = args.getString(0);
        } catch (JSONException e) {
            callbackContext.error(getError(new MASCordovaException("Topic Name is missing")));
            return;
        }
        MASTopic masTopic = new MASTopicBuilder().setCustomTopic(topicName).enforceTopicStructure(false).build();
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
        String contentType = null;
        MASTopic masTopic = null;

        try {
            topicName = args.getString(0);
            masTopic = new MASTopicBuilder().setCustomTopic(topicName).enforceTopicStructure(false).build();
            String message_0 = args.getString(1);
            message = decodeBase64IncomingMessage(message_0);
            contentType = args.getString(2);
        } catch (JSONException e) {
            callbackContext.error(getError(new MASCordovaException("Invaid Input, topic/message/contentType missing")));
            return;
        } catch (MASCordovaException e) {
            callbackContext.error(getError(e));
            return;
        }

        MASMessage masMessage = MASMessage.newInstance();
        masMessage.setContentType(contentType);
        masMessage.setPayload(message);
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