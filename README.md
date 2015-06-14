About the game
---------
 - Colony is a board game played between 2 or 4 players. The game is
   build with node as server and html5/javascript as client
    
 - Its a real time, turn based game and uses works on websocket protocol for
   communication

How to install
---------

**Pre-requisites**

 - node
 - npm

To install dependency packages run this command

    npm install

For bundling client assets run the grunt default task

    grunt

The client assets will be copied under *dist* folder. Configure your internet server (IIS, Apache) to point this directory or copy the files under appropriate directory on internet server

To start the server node script, run this command

    npm start

The game uses port 8081 for web-socket communication, make sure that the port is available for use and open in firewall. To change the port edit following files 

 - src/server/config.js
 - src/client/scripts/app/config.js

Demo
---------
For live demo click [here](http://projects.nareshrohra.com/colony-game/)
