#Copyright (c) Microsoft. All rights reserved.
#Licensed under the MIT license. See LICENSE file in the project root for full license information.
cmake_minimum_required(VERSION 2.8)

set (CMAKE_C_FLAGS "--std=gnu99 ${CMAKE_C_FLAGS}")

option(azure_IoT_Sdks "passes path of azure iot sdks build libs source path" OFF)

if(NOT "${azure_IoT_Sdks}" STREQUAL "OFF")
    include_directories(${azure_IoT_Sdks}/c/c-utility/inc
                        ${azure_IoT_Sdks}/c/iothub_client/inc
                        ${azure_IoT_Sdks}/c/serializer/inc)
    link_directories(${azure_IoT_Sdks}/c/cmake/iotsdk_linux/serializer
                     ${azure_IoT_Sdks}/c/cmake/iotsdk_linux/iothub_client
                     ${azure_IoT_Sdks}/c/cmake/iotsdk_linux/c-utility
                     ${azure_IoT_Sdks}/c/cmake/iotsdk_linux/umqtt)
else()
    include_directories(~/azure-iot-sdk-c/c-utility/inc
                        ~/azure-iot-sdk-c/iothub_client/inc
                        ~/azure-iot-sdk-c/serializer/inc)
    link_directories(~/azure-iot-sdk-c/cmake/iotsdk_linux/serializer
                     ~/azure-iot-sdk-c/cmake/iotsdk_linux/iothub_client
                     ~/azure-iot-sdk-c/cmake/iotsdk_linux/c-utility
                     ~/azure-iot-sdk-c/cmake/iotsdk_linux/umqtt)
endif()

add_executable(lesson4 main.c certs.c)
target_link_libraries(lesson4 mraa
                          serializer
                          iothub_client
                          iothub_client_mqtt_transport
                          umqtt
                          aziotsharedutil
                          ssl
                          crypto
                          curl
                          pthread
                          m
                          ssl
                          crypto)

