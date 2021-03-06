﻿/*
* IoT Hub sample for Intel Edison board - Microsoft Sample Code - Copyright (c) 2016 - Licensed MIT
*/
'use strict';

var gulp = require('gulp');
var gulpCommon = require('gulp-common');
var helper = gulpCommon.all;

var configPostfix = "edison";

/**
 * Setup common gulp tasks: init, install-tools, deploy, run
 */
gulpCommon(gulp, 'edison-c', {
  appName: 'lesson-4',
  configTemplate: {
    "device_host_name_or_ip_address": "[device hostname or IP adress]",
    "device_user_name": "root",
    "device_password": "[device password]",
    "iot_hub_connection_string": "[IoT hub connection string]",
    "iot_device_connection_string": "[IoT device connection string]",
  },
  configPostfix: configPostfix,
  app: ['main.c', 'certs.h', 'certs.c', 'CMakeLists.txt'],
  appParams: ' "' + helper.getDeviceConnectionString(configPostfix) + '"'
});

var config = gulp.config;

/**
 * Gulp task to send cloud-to-device messages from host machine
 */
gulp.task('send-cloud-to-device-messages', false, function () {
  // Blink interval in ms
  var INTERVAL = 2000;
  // Total messages to be sent
  var MAX_MESSAGE_COUNT = 20;
  var sentMessageCount = 0;

  var Message = require('azure-iot-common').Message;
  var client = require('azure-iothub').Client.fromConnectionString(config.iot_hub_connection_string);

  // Build cloud-to-device message with message Id
  var buildMessage = function (messageId) {
    if (messageId < MAX_MESSAGE_COUNT) {
      return new Message(JSON.stringify({ command: 'blink', messageId: messageId }));
    } else {
      return new Message(JSON.stringify({ command: 'stop', messageId: messageId }));
    }
  };

  // Construct and send cloud-to-device message to IoT Hub
  var sendMessage = function () {
    sentMessageCount++;
    var message = buildMessage(sentMessageCount);
    console.log('[IoT Hub] Sending message #' + sentMessageCount + ': ' + message.getData());
    client.send(helper.getDeviceId(configPostfix), message, sendMessageCallback);
  };

  // Start another run after message is sent out
  var sendMessageCallback = function (err) {
    if (err) {
      console.error('[IoT Hub] Sending message error: ' + err.message);
    }
    run();
  };

  var run = function () {
    if (sentMessageCount == MAX_MESSAGE_COUNT) {
      client.close(closeConnectionCallback);
    } else {
      setTimeout(sendMessage, INTERVAL);
    }
  };

  // Log information to console when closing connection to IoT Hub
  var closeConnectionCallback = function (err) {
    if (err) {
      console.error('[IoT Hub] Close connection error: ' + err.message + '\n');
    } else {
      console.log('[IoT Hub] Connection closed\n');
    }
  };

  // Start running this sample after getting connected to IoT Hub.
  // If there is any error, log the error message to console.
  var connectCallback = function (err) {
    if (err) {
      console.error('[IoT Hub] Fail to connect: ' + err.message + '\n');
    } else {
      console.log('[IoT Hub] Client connected\n');
      // Wait for 5 seconds so that device gets connected to IoT Hub.
      setTimeout(run, 5000);
    }
  };

  client.open(connectCallback);
});

/**
 * Override 'run' task with customized behavior
 */
gulp.task('run', 'Runs deployed sample on the board', ['run-internal', 'send-cloud-to-device-messages']);

