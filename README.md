# Smart home app
- This app is a part of my smart home solution project. Other parts include backend code and embedded system repo (ESP32 code)
- I worked on this project (Smart Home Solution project ) to get an introduction to the world of Embedded Systems and at the same time upgrade my App Development and Backend Development skills
- This android app is used to control the I.O.T device [ESP32 microcontroller in this case]. 

## Demo 

<p align="center" >
<img src="https://github.com/piyushnanwani/ultra-legendary-fortnight/blob/master/smart-home.gif" width=350>
</p>

## Steps
- User sign's in the app using one click Google Sign In
- User add's the I.O.T. device by clicking on 'Add Device' button.
- User turns on Bluetooth and location of the android device.
- User then enters his/her WiFi credentials which are then sent to the I.O.T device via Bluetooth
- I.O.T device connects to the home WiFi after receiving credentials
- I.O.T device registers itself on the cloud. [By sending POST request on the Backend API ][Details sent include secret token, user details, device details]
- After device is succeesfully added, now user can control the device remotely. User can turn ON/OFF the LED of our I.O.T device.
- MQTT communication protocol is used to communicate to device. And Adafruit MQTT broker is used in this project to send updates to our device on realtime.
