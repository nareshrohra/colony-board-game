About the game
---------
 - Colony is a board game played between 2 or 4 players. The game is
   built with node as server and html5/javascript as client
    
 - Its a real time, turn based game and uses websocket protocol for
   communication

How to install
---------

**Pre-requisites**

 - node
 - npm
 - grunt-cli (install with npm command 'npm install -g grunt-cli')

To install dependency packages run this command

    npm install

For bundling client assets run the grunt default task

    grunt

The client assets will be copied under *dist* folder. Configure your internet server (IIS, Apache) to point this directory or copy the files under appropriate directory on internet server

To start the server node script, run this command

    npm start

The game uses port 8080 for web-socket communication, make sure that the port is available for use and open in firewall. To change the port edit following files. After, editing files re-run the commands for grunt task and starting node script

 - src/server/config.js
 - src/client/scripts/app/config.js

Demo
---------
For live demo click [here](http://projects.nareshrohra.com/colony-game/)
