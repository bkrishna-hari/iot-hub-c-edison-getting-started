/*
* IoT Hub Intel Edison C Blink - Microsoft Sample Code - Copyright (c) 2016 - Licensed MIT
*/

#include <stdio.h>
#include <stdbool.h>
#include <mraa.h>

static const int MAX_BLINK_TIMES = 20;
static const int LED_PIN = 13;

int main(int argc, char *argv[])
{
    // Initialize GPIO and set its direction to output
    mraa_gpio_context context = mraa_gpio_init(LED_PIN);
    mraa_gpio_dir(context, MRAA_GPIO_OUT);

    int blink_number = 0;
    while (MAX_BLINK_TIMES > blink_number++)
    {
        printf("[Device] #%d Blink LED \n", blink_number);
        mraa_gpio_write(context, 1);
        usleep(100000);  // light on the LED for 0.1 second
        mraa_gpio_write(context, 0);
        usleep(2000000);  // turn off the LED for 2 seconds
    }

    return 0;
}
