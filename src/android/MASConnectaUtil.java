/*
 * Copyright (c) 2016 CA, Inc.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */
package com.ca.mas.cordova.connecta;

import com.ca.mas.connecta.client.MASConnectOptions;
import com.ca.mas.connecta.client.MASConnectaClient;
import com.ca.mas.cordova.core.MASCordovaException;
import com.ca.mas.core.client.ServerClient;
import com.ca.mas.core.error.MAGErrorCode;
import com.ca.mas.core.error.MAGException;
import com.ca.mas.core.error.MAGRuntimeException;
import com.ca.mas.core.error.MAGServerException;
import com.ca.mas.core.error.TargetApiException;
import com.ca.mas.foundation.MAS;
import com.ca.mas.foundation.MASConstants;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.PrintWriter;
import java.io.StringWriter;

/**
 * Created by trima09 on 26/12/2016.
 */

public class MASConnectaUtil {

    public static MASConnectOptions getConnectOptions(JSONObject obj) throws MASCordovaException {
        if(obj == null){
            return null;
        }
        MASConnectOptions options = new MASConnectOptions();
        String connectURL = obj.optString("connectURL");
        if (isNullOrEmpty(connectURL)) {
            throw new MASCordovaException("Server URL cannot be null for Broker host");
        }
        options.setServerURIs(new String[]{connectURL});
        String user = obj.optString("userName");
        String pass = obj.optString("password");
        if (!isNullOrEmpty(user) && !isNullOrEmpty(pass)) {
            options.setUserName(user);
            options.setPassword(pass.toCharArray());
        }
        int connectTimeout = obj.optInt("connectionTimeOut");
        if (connectTimeout > 0) {
            options.setConnectionTimeout(connectTimeout);
        }
        int keepAliveInterval = obj.optInt("keepAlive");
        if (keepAliveInterval > 0) {
            options.setKeepAliveInterval(keepAliveInterval);
        }
        boolean cleanSession = obj.optBoolean("cleanSession", true);
        options.setCleanSession(cleanSession);

        JSONObject will = obj.optJSONObject("will");
        if (will != null) {
            String topic = will.optString("topic");
            String message = will.optString("message");
            int qos = will.optInt("QoS");
            if (qos < 0 || qos > 2) {
                qos = MASConnectaClient.EXACTLY_ONCE;
            }
            boolean retained = will.optBoolean("retain", true);
            if (!isNullOrEmpty(topic) && !isNullOrEmpty(message)) {
                options.setWill(topic, message.getBytes(), qos, retained);
            }
        }
        return options;
    }

    public static boolean isNullOrEmpty(String ref) {
        return ref == null || ref.isEmpty();
    }

    public static JSONObject getError(Throwable throwable) {
        int errorCode = MAGErrorCode.UNKNOWN;
        String errorMessage = throwable.getMessage();
        String errorMessageDetail = "";
        //Try to capture the root cause of the error
        if (throwable instanceof MAGException) {
            MAGException ex = (MAGException) throwable;
            errorCode = ex.getErrorCode();
            errorMessage = ex.getMessage();
        } else if (throwable instanceof MAGRuntimeException) {
            MAGRuntimeException ex = (MAGRuntimeException) throwable;
            errorCode = ex.getErrorCode();
            errorMessage = ex.getMessage();
        } else if (throwable.getCause() != null && throwable.getCause() instanceof MAGException) {
            MAGException ex = (MAGException) throwable.getCause();
            errorCode = ex.getErrorCode();
            errorMessage = ex.getMessage();
        } else if (throwable.getCause() != null && throwable.getCause() instanceof MAGRuntimeException) {
            MAGRuntimeException ex = (MAGRuntimeException) throwable.getCause();
            errorCode = ex.getErrorCode();
            errorMessage = ex.getMessage();
        } else if (throwable.getCause() != null && throwable.getCause() instanceof MAGServerException) {
            MAGServerException serverException = ((MAGServerException) throwable.getCause());
            errorCode = serverException.getErrorCode();
            errorMessage = serverException.getMessage();
        } else if (throwable.getCause() != null && throwable.getCause() instanceof TargetApiException) {
            TargetApiException e = ((TargetApiException) throwable.getCause());
            try {
                errorCode = ServerClient.findErrorCode(e.getResponse());
            } catch (Exception ignore) {
            }

        } else if (errorMessage != null && errorMessage.equalsIgnoreCase("The session is currently locked.")) {
            errorCode = MAGErrorCode.UNKNOWN;

        } else if (throwable != null && throwable instanceof MASCordovaException) {
            errorMessage = throwable.getMessage();

        } else if ((throwable instanceof NullPointerException || throwable instanceof IllegalStateException) && (MAS.getContext() == null || MAS.getState(MASConnectaPlugin.getCordovaContext()) != MASConstants.MAS_STATE_STARTED)) {
            errorMessageDetail = "Mobile SSO has not been initialized.";
        } else {
            errorMessageDetail = throwable.getMessage();
        }

        JSONObject error = new JSONObject();
        try {
            error.put("errorCode", errorCode);
            error.put("errorMessage", errorMessage);
            StringWriter errors = new StringWriter();
            throwable.printStackTrace(new PrintWriter(errors));
            error.put("errorInfo", errors.toString());
            if (!"".equals(errorMessageDetail)) {
                error.put("errorMessageDetail", errorMessageDetail);
                error.put("errorMessage", "Internal Server Error");
            }
        } catch (JSONException ignore) {
        }

        return error;
    }
}
