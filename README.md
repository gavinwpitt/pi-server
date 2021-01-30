# pi-server
all purpose node server for my raspberry pi

Hardware:
  BME280 weather sensor chip
  RioRand 433MHz Superheterodyne RF Link Transmitter and Receiver Kits 3400 for

Features:
  Saves room weather (humidity, pressure, temperature) in memory every minute in memory to see temperature over a day
  Saves room weather (humidity, pressure, temperature) to MySql every hour to track data over long period of time
  Uses RF transmitter to switch on RF electric switches via REST calls. Currently hooked up to spaceheater and LED string lights
  Uses in memory temperature tracking to switch space heater on/off depending on input thresholds
  
TODO:
  Set up IR system for controlling television/IR based LED lights
  Set up Alarm Clock system to play music on spotify as a wake up alarm (requires IR switch to turn TV on)
  Set up third party weather API to track weather outside of room in Boston area to compare indoor weather against outdoor weather
  Set up RF reciever/transmitter hardware to read IR waves? Currenlty only supports transmitting for switches
