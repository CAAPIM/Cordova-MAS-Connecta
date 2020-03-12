# Cordova-MAS-Connecta
Cordova-MAS-Connecta is the core messaging framework of the Layer7 Cordova Mobile SDK, which is part of the Layer7 Mobile API Gateway. It gives developers the ability to create social collaborative apps where users can subscribe and publish to a topic directly connecting to a MQTT broker, or via Layer7 Mobile API Gateway serving as a MQTT proxy.
*********************************************************

## Features

The MAS Connecta framework comes with the following features:

- MQTT client with built-in mutual SSL
**************************************

## Get Started
Follow our [documentation](https://techdocs.broadcom.com/content/broadcom/techdocs/us/en/ca-enterprise-software/layer7-api-management/mobile-sdk-for-ca-mobile-api-gateway/2-1/Cordova/Cordova_2-1.html) to install Cordova and set up iOS and Android projects.
*********************************************************

## How You Can Contribute
Contributions are welcome and much appreciated. To learn more, see the [Contribution Guidelines](https://github.com/CAAPIM/Cordova-MAS-Connecta/blob/develop/CONTRIBUTING.md).

## Generate Reference documents
The reference documents for the MAS modules are generated using the JSDoc markdown language. JSDoc reads the JS files with annotations in comments, and generates an HTML output. It considers the comments that start with /**.

To install JSDoc, follow the instructions on [JSDoc](http://usejsdoc.org/) website.

The Cordova reference documents are available at our [techdocs]( https://techdocs.broadcom.com/content/broadcom/techdocs/us/en/ca-enterprise-software/layer7-api-management/mobile-sdk-for-ca-mobile-api-gateway/2-1/Cordova/CordovaTR_2-1/MASConnecta.html) site.

Example:
An annotated comment for validateOTP method is as follows:
```
 /**
  Validate the OTP.
  * @param {function} successHandler user defined success callback
  * @param {function} errorHandler user defined error callback
  * @param {string} otp user defined one-time password to verify
  */
```
**Param** – Specifies a parameter.
**{string}**  – Specifies the return type of the method.
**otp** – Specifies the variable name.
**user defined one-time password to verify** – Describes the method.

Compile the JSDoc reference document as follows:
```
jsdoc www/ -d jsdocs
```
where “www/” is the location of the js file, and “-d jsdocs” is the location where the generated reference documents are placed.

For more information about how to write and compile the JSDoc reference documents, see the [JSDoc](http://usejsdoc.org/) website.

## Communication

- *Have general questions or need help?*, use [Stack Overflow][StackOverflow]. (Tag 'massdk')
- *Find a bug?*, open an issue with the steps to reproduce it.
- *Request a feature or have an idea?*, open an issue.

## License
Copyright (c) 2019 Broadcom. All Rights Reserved.
The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.

This software may be modified and distributed under the terms of the MIT license. See the [LICENSE](https://github.com/CAAPIM/Cordova-MAS-Connecta/blob/develop/LICENSE) file for details.
