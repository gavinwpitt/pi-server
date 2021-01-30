# pi-server
all purpose node server for my raspberry pi

<h2>Hardware:</h2>
  BME280 weather sensor chip<br>
  RioRand 433MHz Superheterodyne RF Link Transmitter and Receiver Kits 3400 for<br>

<h2>Features:</h2>
  Saves room weather (humidity, pressure, temperature) in memory every minute in memory to see temperature over a day<br>
  Saves room weather (humidity, pressure, temperature) to MySql every hour to track data over long period of time<br>
  Uses RF transmitter to switch on RF electric switches via REST calls. Currently hooked up to spaceheater and LED string lights<br>
  Uses in memory temperature tracking to switch space heater on/off depending on input thresholds<br>

<h2>TODO:</h2>
  Set up IR system for controlling television/IR based LED lights<br>
  Set up Alarm Clock system to play music on spotify as a wake up alarm (requires IR switch to turn TV on)<br>
  Set up third party weather API to track weather outside of room in Boston area to compare indoor weather against outdoor weather<br>
  Set up RF reciever/transmitter hardware to read IR waves? Currenlty only supports transmitting for switches<br>
